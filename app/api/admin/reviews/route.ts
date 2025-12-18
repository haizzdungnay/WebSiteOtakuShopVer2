import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Schema validate update review (reserved for future PATCH endpoint)
const _updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  isPinned: z.boolean().optional()
})

// GET /api/admin/reviews - List reviews
export async function GET(request: NextRequest) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const isApproved = searchParams.get('isApproved')
    const isPinned = searchParams.get('isPinned')
    const isVerified = searchParams.get('isVerified')
    const rating = searchParams.get('rating')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 3. Build where clause
    const where: any = {}

    // Filter by approval status
    if (isApproved !== null) {
      where.isApproved = isApproved === 'true'
    }

    // Filter by pinned status
    if (isPinned !== null) {
      where.isPinned = isPinned === 'true'
    }

    // Filter by verified status
    if (isVerified !== null) {
      where.isVerified = isVerified === 'true'
    }

    // Filter by rating
    if (rating) {
      where.rating = parseInt(rating)
    }

    // 4. Query reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          images: true,
          isApproved: true,
          isPinned: true,
          isVerified: true,
          helpfulCount: true,
          unhelpfulCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatar: true
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    // 5. Get summary statistics
    const [
      pendingCount,
      approvedCount,
      pinnedCount,
      ratingStats
    ] = await Promise.all([
      prisma.review.count({ where: { ...where, isApproved: false } }),
      prisma.review.count({ where: { ...where, isApproved: true } }),
      prisma.review.count({ where: { ...where, isPinned: true } }),
      prisma.review.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true }
      })
    ])

    const summary = {
      total,
      pending: pendingCount,
      approved: approvedCount,
      pinned: pinnedCount,
      byRating: ratingStats.reduce((acc, stat) => {
        acc[stat.rating] = stat._count.rating
        return acc
      }, {} as Record<number, number>)
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        summary
      }
    })

  } catch (error) {
    console.error('[Admin] Get reviews error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách đánh giá' },
      { status: 500 }
    )
  }
}
