import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/announcements - Lấy danh sách tin tức công khai
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const skip = (page - 1) * limit

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: {
          isActive: true, // Chỉ lấy các tin tức công khai
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.announcement.count({
        where: {
          isActive: true,
        },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách tin tức' },
      { status: 500 }
    )
  }
}
