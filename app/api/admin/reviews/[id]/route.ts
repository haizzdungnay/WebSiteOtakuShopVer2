import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Schema validate update review
const updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  isPinned: z.boolean().optional()
})

// PUT /api/admin/reviews/[id] - Update review (approve/pin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 2. Check review exists
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        rating: true,
        isApproved: true,
        isPinned: true
      }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đánh giá' },
        { status: 404 }
      )
    }

    // 3. Validate input
    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    // 4. Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(validatedData.isApproved !== undefined && { isApproved: validatedData.isApproved }),
        ...(validatedData.isPinned !== undefined && { isPinned: validatedData.isPinned })
      },
      include: {
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
            slug: true
          }
        }
      }
    })

    // 5. Recalculate product rating if approval status changed
    if (validatedData.isApproved !== undefined) {
      const approvedReviews = await prisma.review.findMany({
        where: {
          productId: review.productId,
          isApproved: true
        },
        select: {
          rating: true
        }
      })

      const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = approvedReviews.length > 0 
        ? totalRating / approvedReviews.length 
        : 0

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          reviewCount: approvedReviews.length,
          averageRating: Math.round(avgRating * 10) / 10 // Round to 1 decimal
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật đánh giá thành công',
      data: updatedReview
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update review error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật đánh giá' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 2. Get review before delete (need productId for recalculation)
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        isApproved: true
      }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đánh giá' },
        { status: 404 }
      )
    }

    // 3. Delete review (cascade delete votes)
    await prisma.review.delete({
      where: { id }
    })

    // 4. Recalculate product rating if review was approved
    if (review.isApproved) {
      const approvedReviews = await prisma.review.findMany({
        where: {
          productId: review.productId,
          isApproved: true
        },
        select: {
          rating: true
        }
      })

      const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = approvedReviews.length > 0 
        ? totalRating / approvedReviews.length 
        : 0

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          reviewCount: approvedReviews.length,
          averageRating: Math.round(avgRating * 10) / 10
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa đánh giá thành công'
    })

  } catch (error) {
    console.error('[Admin] Delete review error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa đánh giá' },
      { status: 500 }
    )
  }
}
