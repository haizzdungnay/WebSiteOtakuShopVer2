import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/jwt-edge'
import { applyApiRateLimit, addRateLimitHeadersToResponse } from '@/lib/api-rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================
  // API Rate Limiting
  // ============================================
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = applyApiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
  }

  // ============================================
  // Admin Route Protection
  // ============================================
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value

    // If no token, redirect to login
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify token and check role
      const payload = await verifyTokenEdge(token)

      // If not admin or staff role, redirect to home
      const role = payload.role?.toLowerCase()
      if (role !== 'admin' && role !== 'staff') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    } catch (_error) {
      // Invalid token, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(url)
      response.cookies.delete('token')
      return response
    }
  }

  // ============================================
  // Create Response with Security Headers
  // ============================================
  let response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // CSP relaxed for development - Next.js requires 'unsafe-eval' for hot reload
  // In production, consider tightening these policies
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data: https: http: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' ws: wss: http: https:",
      "font-src 'self' data: https:",
      "frame-ancestors 'self'",
    ].join('; ')
  )

  // Add rate limit headers for API routes
  if (pathname.startsWith('/api/')) {
    response = addRateLimitHeadersToResponse(response, request)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
