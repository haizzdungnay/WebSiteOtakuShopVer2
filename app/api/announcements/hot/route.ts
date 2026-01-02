import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/announcements/hot - Lấy danh sách tin tức hot
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const hotNews = await prisma.announcement.findMany({
      where: {
        isActive: true,
        isHot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 10), // Maximum 10 hot news
      select: {
        id: true,
        title: true,
        summary: true,
        imageUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: hotNews,
    })
  } catch (error) {
    console.error('Error fetching hot news:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách tin tức hot' },
      { status: 500 }
    )
  }
}
