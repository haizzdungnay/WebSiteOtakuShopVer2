import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { sendEmail, getOtpEmailTemplate } from '@/lib/email';
import { checkRateLimit, getClientIP, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limit';

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`otp:${clientIP}`, RATE_LIMITS.OTP);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Quá nhiều lần gửi OTP. Vui lòng thử lại sau ${rateLimitResult.retryAfter} giây.`
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Get user from token
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    // Check if user exists and is not already verified
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
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

    // Check if there's a recent OTP (rate limiting - 1 minute)
    if (dbUser.otpExpires && new Date() < dbUser.otpExpires) {
      const remainingTime = Math.ceil((dbUser.otpExpires.getTime() - Date.now()) / 1000);
      if (remainingTime > 540) { // 10 minutes - 1 minute = 9 minutes, only block if sent less than 1 minute ago
        return NextResponse.json(
          { success: false, error: `Vui lòng đợi ${60 - (600 - remainingTime)} giây trước khi gửi lại OTP` },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        otpCode,
        otpExpires
      }
    });

    // Send OTP email
    const emailSent = await sendEmail({
      to: dbUser.email,
      subject: 'Mã xác nhận OTP - DN Figure',
      html: getOtpEmailTemplate(dbUser.fullName, otpCode)
    });

    if (!emailSent) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Không thể gửi email. Vui lòng kiểm tra cấu hình EMAIL_USER và EMAIL_PASS trong .env',
          otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined // Show OTP in dev mode
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
