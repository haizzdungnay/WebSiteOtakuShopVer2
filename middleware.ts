import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for admin routes
  if (pathname.startsWith('/admin')) {
    console.log('[Middleware] Admin route accessed:', pathname)

    const token = request.cookies.get('token')?.value
    const allCookies = request.cookies.getAll()
    console.log('[Middleware] Cookies found:', allCookies.map(c => c.name))

    // If no token, redirect to login
    if (!token) {
      console.log('[Middleware] ❌ No token found, redirecting to login')
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    console.log('[Middleware] Token found, length:', token.length)

    try {
      // Verify token and check role
      const payload = verifyToken(token)
      console.log('[Middleware] ✅ Token verified successfully')
      console.log('[Middleware] User payload:', {
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role
      })

      // If not admin role, redirect to home with error
      if (payload.role !== 'admin') {
        console.log('[Middleware] ❌ User role is not admin:', payload.role)
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }

      console.log('[Middleware] ✅ Admin access granted for:', payload.username)
    } catch (error) {
      // Invalid token, redirect to login
      console.error('[Middleware] ❌ Token verification failed:', error)
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(url)
      response.cookies.delete('token')
      return response
    }
  }

  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
