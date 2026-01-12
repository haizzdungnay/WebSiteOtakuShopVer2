/**
 * API Rate Limiting Middleware
 * Applies rate limiting specifically to API routes
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// TYPES
// ============================================

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}

// ============================================
// IN-MEMORY STORE
// ============================================

const apiRateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of apiRateLimitStore.entries()) {
            if (now > entry.resetTime) {
                apiRateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

// ============================================
// RATE LIMIT CONFIGURATIONS
// ============================================

export const API_RATE_LIMITS = {
    // Global API rate limit
    GLOBAL: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 100 requests per minute
    },

    // Strict limit for auth endpoints
    AUTH: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
    },

    // Limit for search/read endpoints
    READ: {
        maxRequests: 60,
        windowMs: 60 * 1000, // 60 requests per minute
    },

    // Limit for write operations (POST, PUT, DELETE)
    WRITE: {
        maxRequests: 20,
        windowMs: 60 * 1000, // 20 requests per minute
    },

    // Very strict limit for sensitive operations
    SENSITIVE: {
        maxRequests: 3,
        windowMs: 10 * 60 * 1000, // 3 requests per 10 minutes
    },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get client IP from request
 */
export function getClientIPFromRequest(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
    if (vercelForwardedFor) {
        return vercelForwardedFor.split(',')[0].trim();
    }

    return 'unknown';
}

/**
 * Check rate limit
 */
function checkApiRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = apiRateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        apiRateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs,
        };
    }

    entry.count++;

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
 * Get rate limit headers
 */
function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    if (result.retryAfter) {
        headers['Retry-After'] = result.retryAfter.toString();
    }

    return headers;
}

/**
 * Determine rate limit config based on path and method
 */
function getRateLimitConfig(pathname: string, method: string): RateLimitConfig {
    // Auth endpoints - strict limit
    if (pathname.startsWith('/api/auth/')) {
        // Extra strict for sensitive auth endpoints
        if (
            pathname.includes('/login') ||
            pathname.includes('/register') ||
            pathname.includes('/forgot-password') ||
            pathname.includes('/reset-password') ||
            pathname.includes('/send-otp')
        ) {
            return API_RATE_LIMITS.AUTH;
        }
        return API_RATE_LIMITS.WRITE;
    }

    // Admin endpoints - moderate limit
    if (pathname.startsWith('/api/admin/')) {
        return method === 'GET' ? API_RATE_LIMITS.READ : API_RATE_LIMITS.WRITE;
    }

    // Payment endpoints - sensitive
    if (pathname.startsWith('/api/payment/')) {
        return API_RATE_LIMITS.SENSITIVE;
    }

    // Write operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return API_RATE_LIMITS.WRITE;
    }

    // Read operations
    if (method === 'GET') {
        return API_RATE_LIMITS.READ;
    }

    // Default to global limit
    return API_RATE_LIMITS.GLOBAL;
}

// ============================================
// MAIN MIDDLEWARE FUNCTION
// ============================================

/**
 * Apply rate limiting to API requests
 * Returns NextResponse if rate limited, null otherwise
 */
export function applyApiRateLimit(request: NextRequest): NextResponse | null {
    const { pathname } = request.nextUrl;
    const method = request.method;

    // Only apply to API routes
    if (!pathname.startsWith('/api/')) {
        return null;
    }

    // Skip rate limiting for health check
    if (pathname === '/api/health') {
        return null;
    }

    const clientIP = getClientIPFromRequest(request);
    const config = getRateLimitConfig(pathname, method);

    // Create identifier based on IP and endpoint category
    let category = 'api';
    if (pathname.startsWith('/api/auth/')) {
        category = 'auth';
    } else if (pathname.startsWith('/api/admin/')) {
        category = 'admin';
    } else if (pathname.startsWith('/api/payment/')) {
        category = 'payment';
    }

    const identifier = `${category}:${clientIP}`;
    const result = checkApiRateLimit(identifier, config);

    if (!result.success) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'RATE_LIMITED',
                    message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${result.retryAfter} giây.`,
                    details: { retryAfter: result.retryAfter },
                },
            },
            {
                status: 429,
                headers: getRateLimitHeaders(result),
            }
        );
    }

    return null;
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeadersToResponse(
    response: NextResponse,
    request: NextRequest
): NextResponse {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith('/api/')) {
        return response;
    }

    const clientIP = getClientIPFromRequest(request);
    const config = getRateLimitConfig(pathname, request.method);

    let category = 'api';
    if (pathname.startsWith('/api/auth/')) {
        category = 'auth';
    } else if (pathname.startsWith('/api/admin/')) {
        category = 'admin';
    } else if (pathname.startsWith('/api/payment/')) {
        category = 'payment';
    }

    const identifier = `${category}:${clientIP}`;
    const entry = apiRateLimitStore.get(identifier);

    if (entry) {
        response.headers.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count).toString());
        response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    }

    return response;
}
