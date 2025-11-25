import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  
  newPassword: z.string()
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .max(100, 'Mật khẩu quá dài'),
  
  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu mới')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

// POST /api/auth/change-password - Đổi mật khẩu
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const tokenUser = getUserFromRequest(request)
    if (!tokenUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng đăng nhập'
        },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // 3. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      select: {
        id: true,
        passwordHash: true
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy tài khoản'
        },
        { status: 404 }
      )
    }

    // 4. Verify current password
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mật khẩu hiện tại không đúng'
        },
        { status: 400 }
      )
    }

    // 5. Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      user.passwordHash
    )

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
        },
        { status: 400 }
      )
    }

    // 6. Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10)

    // 7. Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0].message
        },
        { status: 400 }
      )
    }

    console.error('[Auth] Change password error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Không thể đổi mật khẩu. Vui lòng thử lại'
      },
      { status: 500 }
    )
  }
}
