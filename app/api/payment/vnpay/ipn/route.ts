import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';
import { prisma } from '@/lib/prisma';

// Helper function to sort object keys
function sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

export async function GET(request: NextRequest) {
    try {
        console.log('VNPAY IPN: Processing IPN request');

        // Get all query parameters
        const searchParams = request.nextUrl.searchParams;
        const vnpParams: any = {};

        // Convert search params to object
        for (const [key, value] of searchParams.entries()) {
            vnpParams[key] = value;
        }

        console.log('VNPAY IPN: Parameters received:', vnpParams);

        // Get secure hash from VNPAY
        const secureHash = vnpParams['vnp_SecureHash'];

        // Remove hash from params for verification
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        // Sort parameters
        const sortedParams = sortObject(vnpParams);

        // Get VNPAY config
        const vnpHashSecret = process.env.VNP_HASH_SECRET;
        if (!vnpHashSecret) {
            console.error('VNP_IPN: VNP_HASH_SECRET not configured');
            return NextResponse.json({ RspCode: '99', Message: 'Internal server error' }, { status: 200 });
        }

        // Create query string for verification (matches working implementation)
        const querystring = new URLSearchParams();
        Object.entries(sortedParams).forEach(([key, value]) => {
            querystring.append(key, String(value));
        });

        // Verify secure hash (SHA-512 like working implementation)
        const signData = querystring.toString();
        const hmac = crypto.createHmac('sha512', vnpHashSecret);
        const signed = hmac.update(signData, 'utf8').digest('hex');

        if (secureHash !== signed) {
            console.error('VNPAY IPN: Invalid secure hash');
            return NextResponse.json({ RspCode: '97', Message: 'Fail checksum' }, { status: 200 });
        }

        // Extract payment information
        const orderId = vnpParams['vnp_TxnRef'];
        const responseCode = vnpParams['vnp_ResponseCode'];
        const transactionNo = vnpParams['vnp_TransactionNo'];
        const amount = parseInt(vnpParams['vnp_Amount']) / 100; // Convert back from smallest currency unit
        const bankCode = vnpParams['vnp_BankCode'];
        const payDate = vnpParams['vnp_PayDate'];

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                payment: true
            }
        });

        if (!order) {
            console.error('VNPAY IPN: Order not found', orderId);
            return NextResponse.json({ RspCode: '01', Message: 'Order not found' }, { status: 200 });
        }

        // Check if payment exists
        if (!order.payment) {
            console.error('VNPAY IPN: Payment record not found', orderId);
            return NextResponse.json({ RspCode: '01', Message: 'Payment record not found' }, { status: 200 });
        }

        // Check if payment was already processed
        if (order.payment.status === 'COMPLETED' && responseCode === '00') {
            return NextResponse.json({ RspCode: '02', Message: 'Payment already processed' }, { status: 200 });
        }

        // Update payment status based on response code
        let paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED' = 'FAILED';
        let orderStatus = order.status;

        if (responseCode === '00') {
            // Payment successful
            paymentStatus = 'COMPLETED';
            orderStatus = 'CONFIRMED';
        } else {
            // Payment failed
            paymentStatus = 'FAILED';
            if (order.status === 'PENDING') {
                orderStatus = 'CANCELLED';
            }
        }

        // Update payment record
        await prisma.payment.update({
            where: { id: order.payment.id },
            data: {
                status: paymentStatus,
                transactionId: transactionNo || null,
                metadata: {
                    ...(order.payment.metadata as object || {}),
                    bankCode: bankCode,
                    payDate: payDate,
                    responseCode: responseCode,
                    ipnProcessedAt: new Date().toISOString()
                },
                paidAt: responseCode === '00' ? new Date() : order.payment.paidAt
            }
        });

        // Update order status if payment was successful
        if (responseCode === '00') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: orderStatus }
            });
        }

        console.log(`VNPAY IPN processed: Order ${orderId}, Response: ${responseCode}, Status: ${paymentStatus}`);

        // Return success response to VNPAY
        return NextResponse.json({ RspCode: '00', Message: 'success' }, { status: 200 });

    } catch (error) {
        console.error('VNPAY IPN processing error:', error);
        return NextResponse.json({ RspCode: '99', Message: 'Internal server error' }, { status: 200 });
    }
}
