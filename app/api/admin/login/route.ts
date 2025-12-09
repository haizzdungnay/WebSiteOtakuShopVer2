import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Fallback admin credentials from env
const ENV_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@otakushop.local'
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow!'
const ENV_ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || 'Quản trị viên'

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

      const token = jwt.sign(
        {
          userId: admin.id,
          email: admin.email,
          role: 'admin',
          isAdmin: true
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        success: true,
        message: 'Đăng nhập quản trị thành công',
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.fullName,
          fullName: admin.fullName,
          role: 'admin'
        },
        token
      })
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

      const token = jwt.sign(
        {
          userId: userAdmin.id,
          email: userAdmin.email,
          role: 'admin',
          isAdmin: true
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        success: true,
        message: 'Đăng nhập quản trị thành công',
        user: {
          id: userAdmin.id,
          email: userAdmin.email,
          username: userAdmin.fullName,
          fullName: userAdmin.fullName,
          role: 'admin'
        },
        token
      })
    }

    // Fallback: Check environment variables for admin (for development/initial setup)
    const emailMatch = email === ENV_ADMIN_USERNAME.toLowerCase()
    const passwordMatch = password === ENV_ADMIN_PASSWORD

    if (emailMatch && passwordMatch) {
      const token = jwt.sign(
        {
          userId: 'env-admin',
          email: ENV_ADMIN_USERNAME,
          role: 'admin',
          isAdmin: true
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        success: true,
        message: 'Đăng nhập quản trị thành công',
        user: {
          id: 'env-admin',
          email: ENV_ADMIN_USERNAME,
          username: ENV_ADMIN_DISPLAY_NAME,
          fullName: ENV_ADMIN_DISPLAY_NAME,
          role: 'admin'
        },
        token
      })
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
