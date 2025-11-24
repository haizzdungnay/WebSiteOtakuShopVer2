import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, decodeToken } from '@/lib/jwt'

// Debug endpoint to check token - REMOVE IN PRODUCTION
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({
        error: 'No token found',
        hasCookie: false
      })
    }

    // Try to decode without verification first
    const decoded = decodeToken(token)

    // Try to verify
    let verified = null
    let verifyError = null
    try {
      verified = verifyToken(token)
    } catch (error) {
      verifyError = error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json({
      hasCookie: true,
      tokenLength: token.length,
      decoded,
      verified,
      verifyError,
      cookieInfo: {
        name: 'token',
        value: token.substring(0, 20) + '...',
        path: request.cookies.get('token')
      }
    })
  } catch (error) {
    console.error('Token debug error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
