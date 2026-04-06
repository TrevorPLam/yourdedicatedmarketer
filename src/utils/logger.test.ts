/**
 * Logger test script
 * 
 * Basic verification that the structured logging system works correctly
 * and filters sensitive data appropriately.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Logger, PerformanceTimer, createLogger } from './logger';

describe('Structured Logger', () => {
  let logger: Logger;
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    info: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = createLogger('test-module', {
      level: 'debug',
      enableConsole: true,
      enableStructured: false,
      enablePerformance: true,
      sensitiveFields: ['password', 'secret', 'token'],
      redactionValue: '[REDACTED]',
    });

    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should log info messages', () => {
    logger.info('Test message', { key: 'value' });
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-module Test message'),
      { key: 'value' }
    );
  });

  it('should log error messages with error object', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', { context: 'test' }, error);
    
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR test-module Error occurred'),
      expect.objectContaining({
        name: 'Test error',
        message: 'Test error',
        stack: expect.any(String),
      })
    );
  });

  it('should filter sensitive data', () => {
    const sensitiveData = {
      username: 'user123',
      password: 'secret123',
      apiToken: 'token456',
      nested: {
        secretKey: 'hidden',
        normalField: 'visible',
      },
    };

    logger.info('User login', sensitiveData);
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-module User login'),
      expect.objectContaining({
        username: 'user123',
        password: '[REDACTED]',
        apiToken: '[REDACTED]',
        nested: {
          secretKey: '[REDACTED]',
          normalField: 'visible',
        },
      })
    );
  });

  it('should respect log levels', () => {
    const warnLogger = createLogger('test-warn', {
      level: 'warn',
      enableConsole: true,
      enableStructured: false,
      enablePerformance: true,
      sensitiveFields: [],
      redactionValue: '[REDACTED]',
    });

    warnLogger.debug('Debug message');
    warnLogger.info('Info message');
    warnLogger.warn('Warn message');
    warnLogger.error('Error message');

    expect(consoleSpy.debug).not.toHaveBeenCalled();
    expect(consoleSpy.info).not.toHaveBeenCalled();
    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(consoleSpy.error).toHaveBeenCalled();
  });

  it('should handle correlation IDs', () => {
    logger.setCorrelationId('test-correlation-123');
    logger.info('Message with correlation');
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('[test-correlation-123]'),
      {}
    );

    logger.clearCorrelationId();
    logger.info('Message without correlation');
    
    expect(consoleSpy.info).toHaveBeenLastCalledWith(
      expect.not.stringContaining('[test-correlation-123]'),
      {}
    );
  });

  it('should log performance metrics', () => {
    logger.performance('test-operation', 150, { metadata: 'test' });
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-module Performance: test-operation'),
      expect.objectContaining({
        duration: 150,
        operation: 'test-operation',
        metadata: { metadata: 'test' },
      })
    );
  });

  it('should create child loggers', () => {
    const childLogger = logger.child('child-module', { extra: 'context' });
    childLogger.setCorrelationId('parent-123');
    childLogger.info('Child message');
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-module:child-module [parent-123] Child message'),
      { extra: 'context' }
    );
  });
});

describe('Performance Timer', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = createLogger('test-performance', {
      level: 'info',
      enableConsole: true,
      enableStructured: false,
      enablePerformance: true,
      sensitiveFields: [],
      redactionValue: '[REDACTED]',
    });

    consoleSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should measure and log performance', () => {
    const timer = new PerformanceTimer(logger, 'test-operation');
    
    // Simulate some work
    const start = performance.now();
    while (performance.now() - start < 10) {
      // Wait at least 10ms
    }
    
    timer.end({ result: 'success' });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-performance Performance: test-operation'),
      expect.objectContaining({
        duration: expect.any(Number),
        operation: 'test-operation',
        metadata: { result: 'success' },
      })
    );
  });

  it('should work with async function measurement', async () => {
    const result = await PerformanceTimer.measure(
      logger,
      'async-operation',
      async () => {
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'test-result';
      },
      { type: 'async' }
    );

    expect(result).toBe('test-result');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-performance Performance: async-operation'),
      expect.objectContaining({
        duration: expect.any(Number),
        operation: 'async-operation',
        metadata: { type: 'async' },
      })
    );
  });

  it('should handle errors in async measurement', async () => {
    await expect(
      PerformanceTimer.measure(
        logger,
        'failing-operation',
        async () => {
          throw new Error('Test error');
        }
      )
    ).rejects.toThrow('Test error');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO test-performance Performance: failing-operation'),
      expect.objectContaining({
        duration: expect.any(Number),
        operation: 'failing-operation',
        metadata: { error: true },
      })
    );
  });
});

describe('Structured Output', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = createLogger('test-structured', {
      level: 'info',
      enableConsole: false,
      enableStructured: true,
      enablePerformance: true,
      sensitiveFields: ['secret'],
      redactionValue: '[REDACTED]',
    });

    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should output structured JSON', () => {
    logger.info('Structured message', { data: 'test', secret: 'hidden' });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^\{.*\}$/)
    );

    const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(loggedData).toMatchObject({
      level: 'info',
      message: 'Structured message',
      module: 'test-structured',
      context: {
        data: 'test',
        secret: '[REDACTED]',
      },
      timestamp: expect.any(String),
    });
  });

  it('should output errors to stderr', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    logger.error('Error message', { context: 'test' }, new Error('Test error'));
    
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^\{.*\}$/)
    );

    const loggedData = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(loggedData).toMatchObject({
      level: 'error',
      message: 'Error message',
      module: 'test-structured',
      context: { context: 'test' },
      error: {
        name: 'Error',
        message: 'Test error',
        stack: expect.any(String),
      },
      timestamp: expect.any(String),
    });

    errorSpy.mockRestore();
  });
});
