import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

const ACCESS_TOKEN_TTL = '1h'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 })
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwt.JwtPayload

    if (payload.tokenType !== 'refresh') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tokenType: 'access',
      },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_TTL }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', newAccessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 })

    return response
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Không thể làm mới phiên đăng nhập' }, { status: 401 })
  }
}
