import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for updating admin
const updateAdminSchema = z.object({
  username: z.string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới')
    .optional(),
  email: z.string().email('Email không hợp lệ').toLowerCase().optional(),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không được quá 100 ký tự').optional(),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số')
    .optional(),
  isActive: z.boolean().optional()
})

// GET /api/admin/accounts/[id] - Lấy thông tin admin theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy admin' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: admin
    })
  } catch (error) {
    console.error('Get admin error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thông tin admin' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/accounts/[id] - Cập nhật admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy admin' },
        { status: 404 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = updateAdminSchema.parse(body)

    // Check username uniqueness if updating
    if (validatedData.username && validatedData.username !== admin.username) {
      const existingUsername = await prisma.admin.findUnique({
        where: { username: validatedData.username }
      })
      if (existingUsername) {
        return NextResponse.json(
          { success: false, error: 'Username đã tồn tại' },
          { status: 400 }
        )
      }
    }

    // Check email uniqueness if updating
    if (validatedData.email && validatedData.email !== admin.email) {
      const existingEmail = await prisma.admin.findUnique({
        where: { email: validatedData.email }
      })
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'Email đã được sử dụng' },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (validatedData.username) updateData.username = validatedData.username
    if (validatedData.email) updateData.email = validatedData.email
    if (validatedData.fullName) updateData.fullName = validatedData.fullName
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive
    if (validatedData.password) {
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 12)
    }

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        updatedAt: true
      }
    })

    // Log audit
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: currentAdmin.userId,
          action: 'UPDATE_ADMIN',
          entityType: 'Admin',
          entityId: id,
          oldValue: {
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            isActive: admin.isActive
          },
          newValue: {
            ...updateData,
            passwordHash: validatedData.password ? '[CHANGED]' : undefined
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null
        }
      })
    } catch (logError) {
      console.error('[AUDIT] Failed to log admin update:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật admin thành công',
      data: updatedAdmin
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update admin error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật admin' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/accounts/[id] - Xóa admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Prevent self-deletion
    if (currentAdmin.userId === id) {
      return NextResponse.json(
        { success: false, error: 'Không thể xóa chính mình' },
        { status: 400 }
      )
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy admin' },
        { status: 404 }
      )
    }

    // Delete admin (will cascade to audit logs)
    await prisma.admin.delete({
      where: { id }
    })

    // Log audit (create new log for deletion action)
    try {
      // Since we deleted the admin, we need to link to current admin
      await prisma.adminAuditLog.create({
        data: {
          adminId: currentAdmin.userId,
          action: 'DELETE_ADMIN',
          entityType: 'Admin',
          entityId: id,
          oldValue: {
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName
          },
          newValue: undefined,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null
        }
      })
    } catch (logError) {
      console.error('[AUDIT] Failed to log admin deletion:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa admin thành công'
    })

  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa admin' },
      { status: 500 }
    )
  }
}

