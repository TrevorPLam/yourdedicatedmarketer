/**
 * Enhanced IP Extraction Utility
 * 
 * Implements IPv6-aware IP extraction with proper handling of
 * various proxy configurations and IPv6 address aggregation.
 * 
 * Version: 2.1.0
 * Updated: April 2026
 */

export interface IPExtractionResult {
  ip: string;
  version: 'ipv4' | 'ipv6';
  isPrivate: boolean;
  isLoopback: boolean;
  trusted: boolean;
  originalHeader?: string;
}

export class IPExtractor {
  private trustedProxies: string[];
  private privateIPRanges: {
    ipv4: string[];
    ipv6: string[];
  };

  constructor(trustedProxies: string[] = []) {
    this.trustedProxies = trustedProxies;
    this.privateIPRanges = {
      ipv4: [
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '224.0.0.0/4'
      ],
      ipv6: [
        '::1/128',
        'fc00::/7',
        'fe80::/10',
        'ff00::/8',
        '2001:db8::/32',
        '2001:10::/32',
        '2001:20::/28'
      ]
    };
  }

  /**
   * Extract client IP from request headers with IPv6 support
   */
  extractClientIP(request: Request | any): IPExtractionResult {
    const headers = this.getHeaders(request);
    
    // Try headers in order of preference
    const ipHeaders = [
      'cf-connecting-ip', // Cloudflare
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'x-original-forwarded-for',
      'forwarded',
      'x-cluster-client-ip',
      'true-client-ip'
    ];

    for (const headerName of ipHeaders) {
      const headerValue = headers.get(headerName);
      if (headerValue) {
        const result = this.parseIPHeader(headerValue, headerName);
        if (result) {
          return result;
        }
      }
    }

    // Fallback to direct connection IP
    const directIP = request.ip || request.connection?.remoteAddress || request.socket?.remoteAddress;
    if (directIP) {
      return this.analyzeIP(directIP.trim(), 'direct');
    }

    // Ultimate fallback
    return this.analyzeIP('127.0.0.1', 'fallback');
  }

  /**
   * Parse IP header value (handles comma-separated lists and IPv6)
   */
  private parseIPHeader(headerValue: string, headerName: string): IPExtractionResult | null {
    try {
      // Handle comma-separated IPs (x-forwarded-for)
      const ips = headerValue.split(',').map(ip => ip.trim());
      
      // Get the first non-private IP if we're behind trusted proxies
      for (const ip of ips) {
        const analysis = this.analyzeIP(ip, headerName);
        
        // If this is not a trusted proxy, use it as the client IP
        if (!this.isTrustedProxy(ip) && !analysis.isPrivate) {
          return analysis;
        }
      }

      // If all IPs are private/trusted, use the first one
      if (ips.length > 0) {
        return this.analyzeIP(ips[0], headerName);
      }

      return null;
    } catch (error) {
      console.error(`Error parsing IP header ${headerName}:`, error);
      return null;
    }
  }

  /**
   * Analyze an IP address and determine its properties
   */
  private analyzeIP(ip: string, source: string): IPExtractionResult {
    const trimmedIP = ip.trim();
    
    // Handle IPv6 addresses
    if (this.isIPv6(trimmedIP)) {
      return {
        ip: this.normalizeIPv6(trimmedIP),
        version: 'ipv6',
        isPrivate: this.isPrivateIPv6(trimmedIP),
        isLoopback: trimmedIP === '::1' || trimmedIP.startsWith('127.'),
        trusted: this.isTrustedProxy(trimmedIP),
        originalHeader: source
      };
    }

    // Handle IPv4 addresses
    return {
      ip: trimmedIP,
      version: 'ipv4',
      isPrivate: this.isPrivateIPv4(trimmedIP),
      isLoopback: trimmedIP === '127.0.0.1' || trimmedIP.startsWith('127.'),
      trusted: this.isTrustedProxy(trimmedIP),
      originalHeader: source
    };
  }

  /**
   * Check if IP is IPv6
   */
  private isIPv6(ip: string): boolean {
    return ip.includes(':') && !ip.includes('.');
  }

  /**
   * Normalize IPv6 address (remove leading zeros, etc.)
   */
  private normalizeIPv6(ip: string): string {
    try {
      // Basic IPv6 normalization
      const normalized = ip.toLowerCase();
      
      // Remove leading zeros from each block
      return normalized.split(':').map(block => {
        // Handle empty blocks (compression)
        if (block === '') return '';
        
        // Remove leading zeros
        return block.replace(/^0+/, '') || '0';
      }).join(':');
    } catch (error) {
      return ip;
    }
  }

  /**
   * Check if IPv4 address is private
   */
  private isPrivateIPv4(ip: string): boolean {
    try {
      const parts = ip.split('.').map(Number);
      
      if (parts.length !== 4 || parts.some(isNaN)) {
        return false;
      }

      const [a, b] = parts;

      // 10.0.0.0/8
      if (a === 10) return true;
      
      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31) return true;
      
      // 192.168.0.0/16
      if (a === 192 && b === 168) return true;
      
      // 127.0.0.0/8 (loopback)
      if (a === 127) return true;
      
      // 169.254.0.0/16 (link-local)
      if (a === 169 && b === 254) return true;
      
      // 224.0.0.0/4 (multicast)
      if (a >= 224 && a <= 239) return true;

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if IPv6 address is private
   */
  private isPrivateIPv6(ip: string): boolean {
    try {
      const normalized = this.normalizeIPv6(ip);
      
      // ::1/128 (loopback)
      if (normalized === '::1') return true;
      
      // fc00::/7 (unique local)
      if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
      
      // fe80::/10 (link-local)
      if (normalized.startsWith('fe80')) return true;
      
      // ff00::/8 (multicast)
      if (normalized.startsWith('ff')) return true;
      
      // Documentation prefixes
      if (normalized.startsWith('2001:db8')) return true;
      if (normalized.startsWith('2001:10')) return true;
      if (normalized.startsWith('2001:20')) return true;

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if IP is a trusted proxy
   */
  private isTrustedProxy(ip: string): boolean {
    return this.trustedProxies.includes(ip) || this.isPrivateIP(ip);
  }

  /**
   * Check if IP is private (both IPv4 and IPv6)
   */
  private isPrivateIP(ip: string): boolean {
    if (this.isIPv6(ip)) {
      return this.isPrivateIPv6(ip);
    }
    return this.isPrivateIPv4(ip);
  }

  /**
   * Get headers from request (works with both Request and Express-like objects)
   */
  private getHeaders(request: Request | any): Headers | Map<string, string> {
    // Handle Request object (Next.js proxy.ts)
    if (request.headers && typeof request.headers.get === 'function') {
      return request.headers;
    }

    // Handle Express-like request object
    if (request.headers) {
      const headers = new Map();
      Object.entries(request.headers).forEach(([key, value]) => {
        headers.set(key.toLowerCase(), Array.isArray(value) ? value[0] : value);
      });
      return headers;
    }

    return new Map();
  }

  /**
   * Generate rate limiting key with IPv6 awareness
   */
  generateRateLimitKey(ip: string, endpoint?: string): string {
    const analysis = this.analyzeIP(ip, 'rate-limit');
    
    // For IPv6, consider subnet aggregation to avoid too many keys
    let effectiveIP = analysis.ip;
    
    if (analysis.version === 'ipv6' && !analysis.isPrivate) {
      // Use /64 subnet for public IPv6 addresses
      effectiveIP = this.aggregateIPv6Subnet(analysis.ip, 64);
    }
    
    const baseKey = `rate_limit:${effectiveIP}`;
    return endpoint ? `${baseKey}:${endpoint}` : baseKey;
  }

  /**
   * Aggregate IPv6 address to specified prefix length
   */
  private aggregateIPv6Subnet(ip: string, prefixLength: number): string {
    try {
      const normalized = this.normalizeIPv6(ip);
      const parts = normalized.split(':');
      
      // Calculate how many full blocks to keep
      const bitsPerBlock = 16;
      const blocksToKeep = Math.floor(prefixLength / bitsPerBlock);
      const remainingBits = prefixLength % bitsPerBlock;
      
      let aggregated = parts.slice(0, blocksToKeep).join(':');
      
      if (blocksToKeep < 8) {
        aggregated += '::';
      }
      
      return aggregated;
    } catch (error) {
      return ip;
    }
  }

  /**
   * Validate IP address format
   */
  static isValidIP(ip: string): boolean {
    // IPv4 regex
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 regex (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})$|^:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
}

// Default instance
export const ipExtractor = new IPExtractor([
  '127.0.0.1',
  '::1',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16'
]);

// Convenience function
export function getClientIP(request: Request | any): IPExtractionResult {
  return ipExtractor.extractClientIP(request);
}
