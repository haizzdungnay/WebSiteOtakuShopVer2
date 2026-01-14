/**
 * Cache utilities using Redis with in-memory fallback
 * Provides a unified caching API that gracefully degrades when Redis is unavailable
 */

import { getRedisClient, isRedisConnected } from './redis'

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiry: number }>()

// Clean up expired memory cache entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiry > 0 && now > entry.expiry) {
      memoryCache.delete(key)
    }
  }
}, 5 * 60 * 1000)

// Cache key prefixes
export const CACHE_KEYS = {
  CATEGORIES: 'cache:categories',
  PRODUCTS: 'cache:products',
  SEARCH: 'cache:search',
  DASHBOARD: 'cache:dashboard',
  USER: 'cache:user',
} as const

// Default TTL values in seconds
export const CACHE_TTL = {
  CATEGORIES: 3600,      // 1 hour
  PRODUCTS: 300,         // 5 minutes
  SEARCH: 1800,          // 30 minutes
  DASHBOARD: 300,        // 5 minutes
  USER: 60,              // 1 minute
  SHORT: 60,             // 1 minute
  MEDIUM: 300,           // 5 minutes
  LONG: 3600,            // 1 hour
  DAY: 86400,            // 24 hours
} as const

/**
 * Set a value in cache
 * @param key - Cache key
 * @param value - Value to cache (will be JSON stringified)
 * @param ttlSeconds - Time to live in seconds (default: 5 minutes)
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  const serialized = JSON.stringify(value)

  try {
    const redis = getRedisClient()
    if (redis && isRedisConnected()) {
      await redis.setex(key, ttlSeconds, serialized)
      return true
    }
  } catch (error) {
    console.warn('[Cache] Redis set failed, using memory fallback:', error)
  }

  // Fallback to memory cache
  memoryCache.set(key, {
    value: serialized,
    expiry: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0,
  })
  return true
}

/**
 * Get a value from cache
 * @param key - Cache key
 * @returns Parsed value or null if not found/expired
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient()
    if (redis && isRedisConnected()) {
      const value = await redis.get(key)
      if (value) {
        return JSON.parse(value) as T
      }
      return null
    }
  } catch (error) {
    console.warn('[Cache] Redis get failed, using memory fallback:', error)
  }

  // Fallback to memory cache
  const entry = memoryCache.get(key)
  if (entry) {
    if (entry.expiry === 0 || Date.now() < entry.expiry) {
      return JSON.parse(entry.value) as T
    }
    memoryCache.delete(key)
  }
  return null
}

/**
 * Delete a value from cache
 * @param key - Cache key
 */
export async function cacheDel(key: string): Promise<boolean> {
  try {
    const redis = getRedisClient()
    if (redis && isRedisConnected()) {
      await redis.del(key)
    }
  } catch (error) {
    console.warn('[Cache] Redis del failed:', error)
  }

  memoryCache.delete(key)
  return true
}

/**
 * Delete multiple keys matching a pattern
 * @param pattern - Key pattern (e.g., "cache:products:*")
 */
export async function cacheDelPattern(pattern: string): Promise<number> {
  let deletedCount = 0

  try {
    const redis = getRedisClient()
    if (redis && isRedisConnected()) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        deletedCount = await redis.del(...keys)
      }
    }
  } catch (error) {
    console.warn('[Cache] Redis pattern del failed:', error)
  }

  // Also clear from memory cache
  const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
  for (const key of memoryCache.keys()) {
    if (regexPattern.test(key)) {
      memoryCache.delete(key)
      deletedCount++
    }
  }

  return deletedCount
}

/**
 * Get or set cache with a factory function
 * If the key doesn't exist, calls the factory and caches the result
 * @param key - Cache key
 * @param factory - Function to generate value if not cached
 * @param ttlSeconds - Time to live in seconds
 */
export async function cacheGetOrSet<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    return cached
  }

  // Generate value using factory
  const value = await factory()

  // Cache the result
  await cacheSet(key, value, ttlSeconds)

  return value
}

/**
 * Invalidate all caches for a specific entity type
 * @param type - Cache type key from CACHE_KEYS
 */
export async function invalidateCache(type: keyof typeof CACHE_KEYS): Promise<void> {
  const pattern = `${CACHE_KEYS[type]}:*`
  await cacheDelPattern(pattern)
  await cacheDel(CACHE_KEYS[type])
}

/**
 * Check cache health
 */
export async function getCacheHealth(): Promise<{
  redis: boolean
  memory: { size: number }
}> {
  const redis = getRedisClient()
  let redisHealth = false

  if (redis && isRedisConnected()) {
    try {
      await redis.ping()
      redisHealth = true
    } catch {
      redisHealth = false
    }
  }

  return {
    redis: redisHealth,
    memory: {
      size: memoryCache.size,
    },
  }
}

/**
 * Create a cache key with hash from object
 * Useful for caching paginated/filtered queries
 */
export function createCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join('|')

  // Simple hash function
  let hash = 0
  for (let i = 0; i < sortedParams.length; i++) {
    const char = sortedParams.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return `${prefix}:${Math.abs(hash).toString(36)}`
}
