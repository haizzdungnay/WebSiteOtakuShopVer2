import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Xử lý redirect từ MoMo sau khi thanh toán
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const orderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!orderId) {
    return NextResponse.redirect(`${baseUrl}/checkout?error=missing_order`);
  }

  // Kiểm tra kết quả
  if (resultCode === '0') {
    // Thanh toán thành công - redirect đến trang success
    return NextResponse.redirect(`${baseUrl}/checkout/success?orderId=${orderId}&method=momo`);
  } else {
    // Thanh toán thất bại
    // Lấy order để redirect về checkout
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { orderCode: true },
    });

    const errorMessage = encodeURIComponent(message || 'Payment failed');
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=payment_failed&message=${errorMessage}&orderCode=${order?.orderCode || ''}`
    );
  }
}
