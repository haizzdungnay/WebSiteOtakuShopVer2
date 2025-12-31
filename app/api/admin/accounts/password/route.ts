import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for changing password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: z.string()
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu mới phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu mới phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu mới phải có ít nhất 1 số'),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  path: ['newPassword']
})

// PUT /api/admin/accounts/password - Đổi mật khẩu admin hiện tại
export async function PUT(request: NextRequest) {
  try {
    // Verify admin
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Find admin in database
    const admin = await prisma.admin.findUnique({
      where: { id: currentAdmin.userId }
    })

    // If not in admin table, check users table
    if (!admin) {
      const userAdmin = await prisma.user.findUnique({
        where: { id: currentAdmin.userId }
      })

      if (!userAdmin || userAdmin.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Không tìm thấy tài khoản admin' },
          { status: 404 }
        )
      }

      // Verify current password for user
      const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, userAdmin.passwordHash)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Mật khẩu hiện tại không đúng' },
          { status: 400 }
        )
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12)

      // Update password for user
      await prisma.user.update({
        where: { id: userAdmin.id },
        data: { passwordHash: newPasswordHash }
      })

      return NextResponse.json({
        success: true,
        message: 'Đổi mật khẩu thành công'
      })
    }

    // Verify current password for admin
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, admin.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu hiện tại không đúng' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newPasswordHash }
    })

    // Log audit
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: currentAdmin.userId,
          action: 'CHANGE_PASSWORD',
          entityType: 'Admin',
          entityId: admin.id,
          oldValue: undefined, // Don't log passwords
          newValue: { changedAt: new Date().toISOString() },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null
        }
      })
    } catch (logError) {
      console.error('[AUDIT] Failed to log password change:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Change admin password error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể đổi mật khẩu' },
      { status: 500 }
    )
  }
}

