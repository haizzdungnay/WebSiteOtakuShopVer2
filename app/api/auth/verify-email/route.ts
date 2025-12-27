import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Link xác nhận không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email đã được xác nhận trước đó' }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null
      }
    });

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Chào mừng đến OtakuShop!',
      html: getWelcomeEmailTemplate(user.fullName)
    });

    return NextResponse.json({
      success: true,
      message: 'Xác nhận email thành công! Bạn có thể đăng nhập ngay bây giờ.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể xác nhận email. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
