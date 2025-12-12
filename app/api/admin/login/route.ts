import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const ACCESS_TOKEN_TTL = '1h'
const REFRESH_TOKEN_TTL = '7d'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').toLowerCase(),
  password: z.string().min(1, 'Mật khẩu là bắt buộc')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // First, try to find admin in database (Admin model)
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (admin) {
      // Verify password from database
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)

      if (!isPasswordValid || !admin.isActive) {
        return NextResponse.json(
          { error: 'Thông tin quản trị không chính xác' },
          { status: 401 }
        )
      }

      const tokenPayload = {
        userId: admin.id,
        email: admin.email,
        role: 'admin',
        isAdmin: true
      }

      const token = jwt.sign(
        { ...tokenPayload, tokenType: 'access' },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_TTL }
      )

      const refreshToken = jwt.sign(
        { ...tokenPayload, tokenType: 'refresh' },
        process.env.JWT_SECRET!,
        { expiresIn: REFRESH_TOKEN_TTL }
      )

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập quản trị thành công',
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.fullName,
          fullName: admin.fullName,
          role: 'admin'
        },
      })

      response.cookies.set('token', token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 })
      response.cookies.set('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 })

      return response
    }

    // Also check if user has ADMIN role
    const userAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (userAdmin && userAdmin.role === 'ADMIN') {
      const isPasswordValid = await bcrypt.compare(password, userAdmin.passwordHash)

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Thông tin quản trị không chính xác' },
          { status: 401 }
        )
      }

      const tokenPayload = {
        userId: userAdmin.id,
        email: userAdmin.email,
        role: 'admin',
        isAdmin: true
      }

      const token = jwt.sign(
        { ...tokenPayload, tokenType: 'access' },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_TTL }
      )

      const refreshToken = jwt.sign(
        { ...tokenPayload, tokenType: 'refresh' },
        process.env.JWT_SECRET!,
        { expiresIn: REFRESH_TOKEN_TTL }
      )

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập quản trị thành công',
        user: {
          id: userAdmin.id,
          email: userAdmin.email,
          username: userAdmin.fullName,
          fullName: userAdmin.fullName,
          role: 'admin'
        },
      })

      response.cookies.set('token', token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 })
      response.cookies.set('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 })

      return response
    }

    return NextResponse.json(
      { error: 'Thông tin quản trị không chính xác' },
      { status: 401 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Không thể đăng nhập quản trị' },
      { status: 500 }
    )
  }
}
