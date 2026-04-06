/**
 * Structured Logging Service
 * 
 * Provides production-safe logging with different levels, request correlation,
 * and sensitive data filtering. Replaces console.log statements throughout
 * the codebase for better security and monitoring.
 * 
 * Features:
 * - Multiple log levels (error, warn, info, debug)
 * - Request correlation IDs for traceability
 * - Environment-aware output formatting
 * - Sensitive data filtering
 * - Performance metrics logging
 * - Structured JSON output for production
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration?: number;
    operation?: string;
    metadata?: Record<string, any>;
  };
  tenant?: string;
  module: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStructured: boolean;
  enablePerformance: boolean;
  sensitiveFields: string[];
  redactionValue: string;
}

/**
 * Default sensitive fields that should never be logged
 */
const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'credential',
  'private',
  'ssn',
  'credit_card',
  'bank_account',
  'api_key',
  'session',
  'cookie',
  'authorization',
  'bearer',
];

/**
 * Logger class implementing structured logging
 */
export class Logger {
  private config: LoggerConfig;
  private correlationId?: string;
  private module: string;

  constructor(module: string, config?: Partial<LoggerConfig>) {
    this.module = module;
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableConsole: process.env.NODE_ENV !== 'production',
      enableStructured: process.env.NODE_ENV === 'production',
      enablePerformance: process.env.ENABLE_PERFORMANCE_LOGGING === 'true',
      sensitiveFields: DEFAULT_SENSITIVE_FIELDS,
      redactionValue: '[REDACTED]',
      ...config,
    };
  }

  /**
   * Get log level from environment variables
   */
  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    switch (envLevel) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warn';
      case 'info':
        return 'info';
      case 'debug':
        return 'debug';
      default:
        return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
    }
  }

  /**
   * Check if a log level should be logged based on current configuration
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    return levels[level] <= levels[this.config.level];
  }

  /**
   * Filter sensitive data from log context
   */
  private filterSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const filtered = Array.isArray(data) ? [...data] : { ...data };

    const filterRecursive = (obj: any, path: string = ''): any => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map((item, index) => filterRecursive(item, `${path}[${index}]`));
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        const lowerKey = key.toLowerCase();
        const lowerPath = currentPath.toLowerCase();

        // Check if this field or any part of its path contains sensitive data
        const isSensitive = this.config.sensitiveFields.some(
          sensitive => lowerKey.includes(sensitive) || lowerPath.includes(sensitive)
        );

        if (isSensitive) {
          result[key] = this.config.redactionValue;
        } else if (typeof value === 'object' && value !== null) {
          result[key] = filterRecursive(value, currentPath);
        } else {
          result[key] = value;
        }
      }

      return result;
    };

    return filterRecursive(filtered);
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      correlationId: this.correlationId,
      module: this.module,
    };

    if (context) {
      entry.context = this.filterSensitiveData(context);
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  /**
   * Output log entry based on configuration
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    if (this.config.enableConsole) {
      this.outputToConsole(entry);
    }

    if (this.config.enableStructured) {
      this.outputStructured(entry);
    }
  }

  /**
   * Output to console for development
   */
  private outputToConsole(entry: LogEntry): void {
    const prefix = [
      entry.timestamp,
      entry.level.toUpperCase(),
      entry.module,
      entry.correlationId && `[${entry.correlationId}]`,
    ].filter(Boolean).join(' ');

    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'error':
        console.error(message, entry.context || entry.error || '');
        break;
      case 'warn':
        console.warn(message, entry.context || '');
        break;
      case 'info':
        console.info(message, entry.context || '');
        break;
      case 'debug':
        console.debug(message, entry.context || '');
        break;
    }
  }

  /**
   * Output structured JSON for production
   */
  private outputStructured(entry: LogEntry): void {
    // In production, this would go to your logging service
    // For now, we'll output to stderr for errors and stdout for others
    const json = JSON.stringify(entry);

    if (entry.level === 'error') {
      console.error(json);
    } else {
      console.log(json);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>, error?: Error): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.output(entry);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.output(entry);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('info', message, context);
    this.output(entry);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.output(entry);
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    if (!this.config.enablePerformance) {
      return;
    }

    const entry: LogEntry = {
      level: 'info',
      message: `Performance: ${operation}`,
      timestamp: new Date().toISOString(),
      correlationId: this.correlationId,
      module: this.module,
      performance: {
        duration,
        operation,
        metadata: metadata ? this.filterSensitiveData(metadata) : undefined,
      },
    };

    this.output(entry);
  }

  /**
   * Set correlation ID for request tracing
   */
  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  /**
   * Clear correlation ID
   */
  clearCorrelationId(): void {
    this.correlationId = undefined;
  }

  /**
   * Set tenant context for filtering
   */
  setTenant(tenantId: string): void {
    // This could be used to add tenant context to all log entries
    // Implementation depends on your tenant logging requirements
  }

  /**
   * Create a child logger with additional context
   */
  child(childModule: string, additionalContext?: Record<string, any>): Logger {
    const childLogger = new Logger(`${this.module}:${childModule}`, this.config);
    childLogger.correlationId = this.correlationId;
    return childLogger;
  }
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private logger: Logger;
  private operation: string;
  private startTime: number;
  private metadata?: Record<string, any>;

  constructor(logger: Logger, operation: string, metadata?: Record<string, any>) {
    this.logger = logger;
    this.operation = operation;
    this.metadata = metadata;
    this.startTime = performance.now();
  }

  /**
   * End the timer and log the duration
   */
  end(additionalMetadata?: Record<string, any>): void {
    const duration = performance.now() - this.startTime;
    const combinedMetadata = { ...this.metadata, ...additionalMetadata };
    this.logger.performance(this.operation, duration, combinedMetadata);
  }

  /**
   * Create a timer and automatically log when disposed
   */
  static async measure<T>(
    logger: Logger,
    operation: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    const timer = new PerformanceTimer(logger, operation, metadata);
    try {
      const result = await fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end({ error: true });
      throw error;
    }
  }
}

/**
 * Default logger instance factory
 */
export function createLogger(module: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(module, config);
}

/**
 * Global logger for general usage
 */
export const logger = createLogger('app');
