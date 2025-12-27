import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateVerificationToken, getVerificationEmailTemplate } from '@/lib/email';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().email('Email không hợp lệ')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = resendSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi link xác nhận.'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email đã được xác nhận. Bạn có thể đăng nhập.'
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires
      }
    });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Xác nhận email - OtakuShop',
      html: getVerificationEmailTemplate(user.fullName, verificationUrl)
    });

    return NextResponse.json({
      success: true,
      message: 'Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư của bạn.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể gửi email. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
