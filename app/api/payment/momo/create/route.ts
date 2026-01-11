import { NextRequest, NextResponse } from 'next/server';
import { createMoMoPayment } from '@/lib/momo';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Kiểm tra nếu đã thanh toán
    if (order.payment?.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }

    // Tạo orderInfo
    const itemNames = order.orderItems
      .map((item) => item.product.name)
      .slice(0, 3)
      .join(', ');
    const orderInfo = `Thanh toán đơn hàng #${order.orderNumber}: ${itemNames}${order.orderItems.length > 3 ? '...' : ''}`;

    // Tạo MoMo payment
    const momoResponse = await createMoMoPayment({
      orderId: order.id,
      orderInfo: orderInfo.substring(0, 256), // MoMo limit 256 chars
      amount: Math.round(Number(order.totalAmount)),
      extraData: Buffer.from(JSON.stringify({ orderId: order.id })).toString('base64'),
    });

    // Tạo hoặc cập nhật payment record
    await prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        method: 'MOMO',
        amount: order.totalAmount,
        status: 'PROCESSING',
      },
      update: {
        method: 'MOMO',
        status: 'PROCESSING',
      },
    });

    return NextResponse.json({
      success: true,
      payUrl: momoResponse.payUrl,
      deeplink: momoResponse.deeplink,
      qrCodeUrl: momoResponse.qrCodeUrl,
      requestId: momoResponse.requestId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MoMo payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment failed' },
      { status: 500 }
    );
  }
}
