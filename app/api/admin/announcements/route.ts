import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const createAnnouncementSchema = z.object({
  title: z.string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(200, 'Tiêu đề quá dài'),
  summary: z.string()
    .min(10, 'Tóm tắt phải có ít nhất 10 ký tự')
    .max(500, 'Tóm tắt quá dài'),
  content: z.string()
    .max(5000, 'Nội dung quá dài')
    .optional()
    .nullable(),
  imageUrl: z.string()
    .url('URL hình ảnh không hợp lệ')
    .optional()
    .nullable(),
  isActive: z.boolean()
    .optional()
    .default(true),
  isHot: z.boolean()
    .optional()
    .default(false)
})

// GET /api/admin/announcements - Danh sách thông báo
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isActive = searchParams.get('isActive')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.announcement.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get announcements error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách thông báo' },
      { status: 500 }
    )
  }
}

// POST /api/admin/announcements - Tạo thông báo mới
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createAnnouncementSchema.parse(body)

    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        summary: validatedData.summary,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        isActive: validatedData.isActive,
        isHot: validatedData.isHot
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tạo thông báo thành công',
      data: announcement
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Create announcement error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể tạo thông báo' },
      { status: 500 }
    )
  }
}
