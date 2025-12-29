import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for creating admin
const createAdminSchema = z.object({
  username: z.string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
  email: z.string().email('Email không hợp lệ').toLowerCase(),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không được quá 100 ký tự')
})

// GET /api/admin/accounts - Lấy danh sách admin
export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Get all admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: admins
    })
  } catch (error) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách admin' },
      { status: 500 }
    )
  }
}

// POST /api/admin/accounts - Tạo admin mới
export async function POST(request: NextRequest) {
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
    const validatedData = createAdminSchema.parse(body)

    // Check if username already exists
    const existingUsername = await prisma.admin.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Username đã tồn tại' },
        { status: 400 }
      )
    }

    // Check if email already exists in Admin table
    const existingEmail = await prisma.admin.findUnique({
      where: { email: validatedData.email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email đã được sử dụng bởi admin khác' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        fullName: validatedData.fullName,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true
      }
    })

    // Log audit
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: currentAdmin.userId,
          action: 'CREATE_ADMIN',
          entityType: 'Admin',
          entityId: newAdmin.id,
          newValue: {
            username: newAdmin.username,
            email: newAdmin.email,
            fullName: newAdmin.fullName
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null
        }
      })
    } catch (logError) {
      console.error('[AUDIT] Failed to log admin creation:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Tạo admin thành công',
      data: newAdmin
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create admin error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể tạo admin' },
      { status: 500 }
    )
  }
}

