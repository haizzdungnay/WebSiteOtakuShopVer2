import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

<<<<<<< Updated upstream
// GET /api/announcements/[id] - Chi tiết thông báo công khai
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: params.id }
    })

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tin tức' },
        { status: 404 }
      )
    }

    // Only return active announcements
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
    console.error('[Public] Get announcement error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thông tin tin tức' },
      { status: 500 }
    )
  }
=======
// GET /api/announcements/[id] - Lấy chi tiết tin tức công khai

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const announcement = await prisma.announcement.findUnique({
            where: { id },
        })

        if (!announcement || !announcement.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tin tức không tồn tại',
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: announcement,
        })
    } catch (error) {
        console.error('Get announcement error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy tin tức',
            },
            { status: 500 }
        )
    }
>>>>>>> Stashed changes
}
