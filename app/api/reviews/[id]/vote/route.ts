import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isHelpful } = body;

    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'isHelpful is required' },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Không tìm thấy đánh giá' },
        { status: 404 }
      );
    }

    // Cannot vote on own review
    if (review.userId === user.userId) {
      return NextResponse.json(
        { error: 'Không thể vote cho đánh giá của chính mình' },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.userId
        }
      }
    });

    if (existingVote) {
      // Update existing vote
      if (existingVote.isHelpful === isHelpful) {
        // Remove vote if same
        await prisma.$transaction([
          prisma.reviewVote.delete({
            where: {
              reviewId_userId: {
                reviewId,
                userId: user.userId
              }
            }
          }),
          prisma.review.update({
            where: { id: reviewId },
            data: {
              helpfulCount: isHelpful
                ? { decrement: 1 }
                : undefined,
              unhelpfulCount: !isHelpful
                ? { decrement: 1 }
                : undefined
            }
          })
        ]);

        return NextResponse.json({
          success: true,
          message: 'Vote removed'
        });
      } else {
        // Change vote
        await prisma.$transaction([
          prisma.reviewVote.update({
            where: {
              reviewId_userId: {
                reviewId,
                userId: user.userId
              }
            },
            data: { isHelpful }
          }),
          prisma.review.update({
            where: { id: reviewId },
            data: {
              helpfulCount: isHelpful
                ? { increment: 1 }
                : { decrement: 1 },
              unhelpfulCount: !isHelpful
                ? { increment: 1 }
                : { decrement: 1 }
            }
          })
        ]);

        return NextResponse.json({
          success: true,
          message: 'Vote updated'
        });
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.reviewVote.create({
          data: {
            reviewId,
            userId: user.userId,
            isHelpful
          }
        }),
        prisma.review.update({
          where: { id: reviewId },
          data: {
            helpfulCount: isHelpful
              ? { increment: 1 }
              : undefined,
            unhelpfulCount: !isHelpful
              ? { increment: 1 }
              : undefined
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Vote added'
      });
    }

  } catch (error) {
    console.error('Vote review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
