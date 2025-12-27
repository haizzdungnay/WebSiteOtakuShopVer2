import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/admin-auth';

// POST /api/admin/users/[id]/verify - Admin manually verify user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đã được xác minh' },
        { status: 400 }
      );
    }

    // Verify user
    await prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        otpCode: null,
        otpExpires: null,
        verificationToken: null,
        verificationExpires: null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Đã xác minh tài khoản ${user.email}`
    });

  } catch (error) {
    console.error('[Admin] Verify user error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
