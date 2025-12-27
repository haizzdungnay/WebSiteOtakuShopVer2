import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { otpCode } = body;

    if (!otpCode || typeof otpCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Mã OTP là bắt buộc' },
        { status: 400 }
      );
    }

    // Check user and OTP
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        emailVerified: true,
        otpCode: true,
        otpExpires: true
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản' },
        { status: 404 }
      );
    }

    if (dbUser.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đã được xác minh' },
        { status: 400 }
      );
    }

    if (!dbUser.otpCode || !dbUser.otpExpires) {
      return NextResponse.json(
        { success: false, error: 'Chưa có mã OTP. Vui lòng yêu cầu gửi lại.' },
        { status: 400 }
      );
    }

    // Check OTP expiration
    if (new Date() > dbUser.otpExpires) {
      return NextResponse.json(
        { success: false, error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (dbUser.otpCode !== otpCode.trim()) {
      return NextResponse.json(
        { success: false, error: 'Mã OTP không chính xác' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: dbUser.id },
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
      message: 'Xác minh tài khoản thành công!'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
