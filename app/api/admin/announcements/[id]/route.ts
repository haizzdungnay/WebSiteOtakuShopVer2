import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const updateAnnouncementSchema = z.object({
  title: z.string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(200, 'Tiêu đề quá dài')
    .optional(),
  summary: z.string()
    .min(10, 'Tóm tắt phải có ít nhất 10 ký tự')
    .max(500, 'Tóm tắt quá dài')
    .optional(),
  content: z.string()
    .max(5000, 'Nội dung quá dài')
    .optional()
    .nullable(),
  isActive: z.boolean()
    .optional()
})

// GET /api/admin/announcements/[id] - Lấy chi tiết thông báo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    const announcement = await prisma.announcement.findUnique({
      where: { id }
    })

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông báo' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('[Admin] Get announcement error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thông tin thông báo' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/announcements/[id] - Cập nhật thông báo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông báo' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateAnnouncementSchema.parse(body)

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.summary && { summary: validatedData.summary }),
        ...(validatedData.content !== undefined && { content: validatedData.content }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông báo thành công',
      data: announcement
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update announcement error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật thông báo' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/announcements/[id] - Xóa thông báo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông báo' },
        { status: 404 }
      )
    }

    await prisma.announcement.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa thông báo thành công'
    })

  } catch (error) {
    console.error('[Admin] Delete announcement error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa thông báo' },
      { status: 500 }
    )
  }
}
