import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

<<<<<<< Updated upstream
// GET /api/announcements - Danh sách thông báo công khai
=======
// GET /api/announcements - Lấy danh sách tin tức công khai
>>>>>>> Stashed changes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
=======
    const limit = parseInt(searchParams.get('limit') || '12')
>>>>>>> Stashed changes

    const skip = (page - 1) * limit

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
<<<<<<< Updated upstream
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.announcement.count({ where: { isActive: true } })
>>>>>>> Stashed changes
    ])

=======
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

>>>>>>> Stashed changes
    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          total,
<<<<<<< Updated upstream
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('[Public] Get announcements error:', error)
    return NextResponse.json(
<<<<<<< Updated upstream
      { success: false, error: 'Không thể lấy danh sách tin tức' },
=======
      { success: false, error: 'Không thể lấy danh sách thông báo' },
>>>>>>> Stashed changes
=======
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
>>>>>>> Stashed changes
      { status: 500 }
    )
  }
}
