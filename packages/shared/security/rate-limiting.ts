/**
 * Enhanced Rate Limiting with Sliding Window Algorithm
 * 
 * Implements enterprise-grade rate limiting using Redis with sliding window
 * algorithm for better accuracy and distributed environments.
 * 
 * Version: 2.1.0
 * Updated: April 2026
 */

import Redis from 'ioredis';

// Rate limiting algorithms
export enum RateLimitAlgorithm {
  FIXED_WINDOW = 'fixed-window',
  SLIDING_WINDOW = 'sliding-window',
  TOKEN_BUCKET = 'token-bucket',
  LEAKY_BUCKET = 'leaky-bucket'
}

export interface RateLimitConfig {
  algorithm: RateLimitAlgorithm;
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  redis?: Redis.Redis; // Redis instance for distributed rate limiting
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
  resetTime?: number;
  totalHits?: number;
}

// Sliding Window Rate Limiter (Redis-based)
export class SlidingWindowRateLimiter {
  private redis: Redis.Redis;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.redis = config.redis || new Redis(process.env.REDIS_URL);
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator?.(identifier) || `rate_limit:${identifier}`;
    
    // Lua script for atomic sliding window operations
    const luaScript = `
      local key = KEYS[1]
      local window_start = tonumber(ARGV[1])
      local now = tonumber(ARGV[2])
      local max_requests = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      
      -- Remove expired entries
      redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
      
      -- Count current requests in window
      local current_requests = redis.call('ZCARD', key)
      
      -- Check if limit exceeded
      if current_requests >= max_requests then
        local oldest_request = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local retry_after = math.ceil((tonumber(oldest_request[2]) + window_ms - now) / 1000)
        return {0, current_requests, retry_after}
      end
      
      -- Add current request
      redis.call('ZADD', key, now, now)
      redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
      
      local remaining = max_requests - current_requests - 1
      return {1, current_requests + 1, remaining}
    `;

    try {
      const result = await this.redis.eval(
        luaScript,
        1,
        key,
        windowStart.toString(),
        now.toString(),
        this.config.maxRequests.toString(),
        this.config.windowMs.toString()
      ) as [number, number, number];

      const [allowed, totalHits, remainingOrRetryAfter] = result;

      return {
        allowed: allowed === 1,
        totalHits,
        remaining: allowed === 1 ? remainingOrRetryAfter : 0,
        retryAfter: allowed === 0 ? remainingOrRetryAfter : undefined,
        resetTime: now + this.config.windowMs
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if Redis fails
      return { allowed: true, totalHits: 0 };
    }
  }
}

// Token Bucket Rate Limiter
export class TokenBucketRateLimiter {
  private redis: Redis.Redis;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.redis = config.redis || new Redis(process.env.REDIS_URL);
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = this.config.keyGenerator?.(identifier) || `token_bucket:${identifier}`;
    const refillRate = this.config.maxRequests / (this.config.windowMs / 1000); // tokens per second
    const bucketSize = this.config.maxRequests;

    const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local bucket_size = tonumber(ARGV[2])
      local refill_rate = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or bucket_size
      local last_refill = tonumber(bucket[2]) or now
      
      -- Calculate tokens to add
      local time_passed = now - last_refill
      local tokens_to_add = math.floor(time_passed * refill_rate / 1000)
      tokens = math.min(bucket_size, tokens + tokens_to_add)
      
      -- Check if request allowed
      if tokens >= 1 then
        tokens = tokens - 1
        -- Update bucket
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
        return {1, tokens}
      else
        local retry_after = math.ceil((1 - tokens) / refill_rate)
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
        return {0, retry_after}
      end
    `;

    try {
      const result = await this.redis.eval(
        luaScript,
        1,
        key,
        now.toString(),
        bucketSize.toString(),
        refillRate.toString(),
        this.config.windowMs.toString()
      ) as [number, number];

      const [allowed, value] = result;

      return {
        allowed: allowed === 1,
        remaining: allowed === 1 ? value : 0,
        retryAfter: allowed === 0 ? value : undefined,
        totalHits: bucketSize - (allowed === 1 ? value : 0)
      };
    } catch (error) {
      console.error('Token bucket rate limiting error:', error);
      return { allowed: true, totalHits: 0 };
    }
  }
}

// In-memory fallback for development
export class InMemoryRateLimiter {
  private store = new Map<string, { requests: number[]; lastReset: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  checkLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator?.(identifier) || `rate_limit:${identifier}`;
    
    let record = this.store.get(key);
    
    if (!record) {
      record = { requests: [], lastReset: now };
      this.store.set(key, record);
    }
    
    // Remove expired requests (sliding window)
    record.requests = record.requests.filter(timestamp => timestamp > windowStart);
    
    if (record.requests.length >= this.config.maxRequests) {
      const oldestRequest = Math.min(...record.requests);
      const retryAfter = Math.ceil((oldestRequest + this.config.windowMs - now) / 1000);
      
      return {
        allowed: false,
        retryAfter,
        remaining: 0,
        totalHits: record.requests.length
      };
    }
    
    // Add current request
    record.requests.push(now);
    record.lastReset = now;
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - record.requests.length,
      totalHits: record.requests.length
    };
  }
}

// Factory function
export function createRateLimiter(config: RateLimitConfig) {
  if (config.redis && process.env.NODE_ENV === 'production') {
    switch (config.algorithm) {
      case RateLimitAlgorithm.SLIDING_WINDOW:
        return new SlidingWindowRateLimiter(config);
      case RateLimitAlgorithm.TOKEN_BUCKET:
        return new TokenBucketRateLimiter(config);
      default:
        return new InMemoryRateLimiter(config);
    }
  }
  
  return new InMemoryRateLimiter(config);
}
