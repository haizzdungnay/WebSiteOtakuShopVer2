import { NextRequest, NextResponse } from 'next/server';
import { verifyMoMoIPN, MoMoIPNData } from '@/lib/momo';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const ipnData: MoMoIPNData = await request.json();
    // Convert to JSON-compatible format for Prisma
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadataJson = JSON.parse(JSON.stringify(ipnData)) as Record<string, any>;

    // eslint-disable-next-line no-console
    console.log('MoMo IPN received:', ipnData);

    // Xác thực signature
    if (!verifyMoMoIPN(ipnData)) {
      // eslint-disable-next-line no-console
      console.error('Invalid MoMo IPN signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { orderId, resultCode, transId } = ipnData;

    // Tìm đơn hàng và payment
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      // eslint-disable-next-line no-console
      console.error('Order not found:', orderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Kiểm tra nếu đã xử lý
    if (order.payment?.status === 'COMPLETED') {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Xử lý kết quả thanh toán
    if (resultCode === 0) {
      // Thanh toán thành công
      await prisma.$transaction([
        // Cập nhật order status
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'CONFIRMED',
          },
        }),
        // Cập nhật payment record
        prisma.payment.upsert({
          where: { orderId },
          create: {
            orderId,
            method: 'MOMO',
            amount: ipnData.amount,
            status: 'COMPLETED',
            transactionId: transId.toString(),
            paidAt: new Date(),
            metadata: metadataJson,
          },
          update: {
            status: 'COMPLETED',
            transactionId: transId.toString(),
            paidAt: new Date(),
            metadata: metadataJson,
          },
        }),
      ]);

      // eslint-disable-next-line no-console
      console.log('MoMo payment success for order:', orderId);
    } else {
      // Thanh toán thất bại
      await prisma.payment.upsert({
        where: { orderId },
        create: {
          orderId,
          method: 'MOMO',
          amount: ipnData.amount,
          status: 'FAILED',
          transactionId: transId?.toString() || null,
          metadata: metadataJson,
        },
        update: {
          status: 'FAILED',
          transactionId: transId?.toString() || null,
          metadata: metadataJson,
        },
      });

      // eslint-disable-next-line no-console
      console.log('MoMo payment failed for order:', orderId, 'Result:', resultCode);
    }

    // MoMo yêu cầu trả về 204 No Content khi xử lý thành công
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MoMo IPN processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET để test endpoint
export async function GET() {
  return NextResponse.json({ message: 'MoMo IPN endpoint is active' });
}
