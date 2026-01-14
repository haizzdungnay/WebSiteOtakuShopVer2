/**
 * Redis client singleton for caching and rate limiting
 * Supports graceful fallback when Redis is unavailable
 */

import Redis from 'ioredis'

// Redis connection configuration
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    // Exponential backoff with max 30 seconds
    const delay = Math.min(times * 100, 30000)
    return delay
  },
  // Connection options
  connectTimeout: 10000,
  commandTimeout: 5000,
  enableReadyCheck: true,
  // Reconnection
  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      return true // Reconnect on READONLY errors
    }
    return false
  },
}

// Singleton instance
let redis: Redis | null = null
let isConnected = false
let connectionError: Error | null = null

/**
 * Get Redis client instance
 * Returns null if Redis is not available
 */
export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_HOST && !process.env.REDIS_URL) {
    // Redis not configured, return null for graceful fallback
    return null
  }

  if (redis) {
    return isConnected ? redis : null
  }

  try {
    // Use REDIS_URL if available, otherwise use individual config
    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: REDIS_CONFIG.maxRetriesPerRequest,
        retryStrategy: REDIS_CONFIG.retryStrategy,
      })
    } else {
      redis = new Redis(REDIS_CONFIG)
    }

    // Event handlers
    redis.on('connect', () => {
      console.log('[Redis] Connected successfully')
      isConnected = true
      connectionError = null
    })

    redis.on('ready', () => {
      console.log('[Redis] Ready to accept commands')
      isConnected = true
    })

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
      connectionError = err
      isConnected = false
    })

    redis.on('close', () => {
      console.log('[Redis] Connection closed')
      isConnected = false
    })

    redis.on('reconnecting', () => {
      console.log('[Redis] Reconnecting...')
    })

    return redis
  } catch (error) {
    console.error('[Redis] Failed to create client:', error)
    connectionError = error as Error
    return null
  }
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisConnected(): boolean {
  return isConnected && redis !== null
}

/**
 * Get the last connection error (if any)
 */
export function getRedisError(): Error | null {
  return connectionError
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
    isConnected = false
    console.log('[Redis] Connection closed gracefully')
  }
}

/**
 * Ping Redis to check connection
 */
export async function pingRedis(): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    const result = await client.ping()
    return result === 'PONG'
  } catch {
    return false
  }
}

// Export default client getter
export default getRedisClient
