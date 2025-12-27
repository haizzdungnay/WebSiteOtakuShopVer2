import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/announcements/[id] - Lấy chi tiết tin tức công khai
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: params.id },
    })

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tin tức' },
        { status: 404 }
      )
    }

    // Only return active announcements for public access
    if (!announcement.isActive) {
      return NextResponse.json(
        { success: false, error: 'Tin tức không khả dụng' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy tin tức' },
      { status: 500 }
    )
  }
}
