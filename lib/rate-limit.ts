/**
 * Rate limiter with Redis support and in-memory fallback
 * For production, Redis is recommended for distributed rate limiting
 */

import { getRedisClient, isRedisConnected } from './redis'

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory fallback store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes (for memory fallback)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;  // Seconds until rate limit resets
}

/**
 * Check rate limit using Redis (with memory fallback)
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns RateLimitResult
 */
export async function checkRateLimitAsync(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient()

  // Try Redis first
  if (redis && isRedisConnected()) {
    try {
      return await checkRateLimitRedis(identifier, config, redis)
    } catch (error) {
      console.warn('[RateLimit] Redis failed, falling back to memory:', error)
    }
  }

  // Fallback to memory
  return checkRateLimitMemory(identifier, config)
}

/**
 * Check rate limit using Redis
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig,
  redis: ReturnType<typeof getRedisClient>
): Promise<RateLimitResult> {
  if (!redis) {
    return checkRateLimitMemory(identifier, config)
  }

  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowSeconds = Math.ceil(config.windowMs / 1000)

  // Use Redis MULTI for atomic operations
  const pipeline = redis.pipeline()
  pipeline.incr(key)
  pipeline.pttl(key) // Get TTL in milliseconds

  const results = await pipeline.exec()

  if (!results) {
    return checkRateLimitMemory(identifier, config)
  }

  const [incrResult, ttlResult] = results
  const count = (incrResult?.[1] as number) || 1
  const ttl = (ttlResult?.[1] as number) || -1

  // If this is a new key (count === 1 or no TTL), set expiration
  if (count === 1 || ttl === -1 || ttl === -2) {
    await redis.expire(key, windowSeconds)
  }

  const resetTime = ttl > 0 ? now + ttl : now + config.windowMs

  // Check if over limit
  if (count > config.maxRequests) {
    const retryAfter = Math.ceil((resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(1, retryAfter),
    }
  }

  return {
    success: true,
    remaining: Math.max(0, config.maxRequests - count),
    resetTime,
  }
}

/**
 * Check rate limit using in-memory store (fallback)
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns RateLimitResult
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // If no entry or entry expired, create new one
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Synchronous rate limit check (uses memory only)
 * For backwards compatibility with existing code
 * @deprecated Use checkRateLimitAsync for Redis support
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimitMemory(identifier, config)
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check common headers for proxied requests
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim();
  }

  // Cloudflare-specific header
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Strict limit for login/auth endpoints
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
  },
  // Limit for OTP/email sending
  OTP: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000, // 3 requests per 10 minutes
  },
  // Standard API limit
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
  // Limit for search endpoints
  SEARCH: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  },
  // Limit for write operations
  WRITE: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 20 requests per minute
  },
  // Limit for sensitive operations (password reset, etc.)
  SENSITIVE: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000, // 3 requests per 10 minutes
  },
};

/**
 * Create rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() }),
  };
}

/**
 * Reset rate limit for a specific identifier (useful for testing)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  // Clear from memory
  rateLimitStore.delete(identifier)

  // Clear from Redis
  const redis = getRedisClient()
  if (redis && isRedisConnected()) {
    try {
      await redis.del(`ratelimit:${identifier}`)
    } catch (error) {
      console.warn('[RateLimit] Failed to reset in Redis:', error)
    }
  }
}

/**
 * Get current rate limit status without incrementing counter
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<{ count: number; remaining: number; resetTime: number } | null> {
  const redis = getRedisClient()

  if (redis && isRedisConnected()) {
    try {
      const key = `ratelimit:${identifier}`
      const [countStr, ttl] = await Promise.all([
        redis.get(key),
        redis.pttl(key),
      ])

      if (countStr) {
        const count = parseInt(countStr, 10)
        const resetTime = ttl > 0 ? Date.now() + ttl : Date.now() + config.windowMs
        return {
          count,
          remaining: Math.max(0, config.maxRequests - count),
          resetTime,
        }
      }
    } catch (error) {
      console.warn('[RateLimit] Failed to get status from Redis:', error)
    }
  }

  // Fallback to memory
  const entry = rateLimitStore.get(identifier)
  if (entry && Date.now() < entry.resetTime) {
    return {
      count: entry.count,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  return null
}
