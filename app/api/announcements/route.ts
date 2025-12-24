import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/announcements - Danh sách thông báo công khai
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const isActive = searchParams.get('isActive') !== 'false' // default true

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      isActive: isActive
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
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
    console.error('[Public] Get announcements error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách tin tức' },
      { status: 500 }
    )
  }
}
