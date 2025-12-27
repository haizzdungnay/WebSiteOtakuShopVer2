import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ canReview: false, hasReviewed: false });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.userId,
        productId
      }
    });

    if (existingReview) {
      return NextResponse.json({ canReview: false, hasReviewed: true });
    }

    // Check if user has purchased and received this product (order status: COMPLETED or DELIVERED)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.userId,
          status: {
            in: ['COMPLETED', 'DELIVERED']
          }
        }
      },
      include: {
        order: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({
      canReview: !!hasPurchased,
      hasReviewed: false,
      orderId: hasPurchased?.order?.id || null
    });

  } catch (error) {
    console.error('Check can review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
