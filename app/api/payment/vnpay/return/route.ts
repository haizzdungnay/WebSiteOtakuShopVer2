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
        // Get all query parameters
        const searchParams = request.nextUrl.searchParams;
        const vnpParams: any = {};

        // Convert search params to object
        for (const [key, value] of searchParams.entries()) {
            vnpParams[key] = value;
        }

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
            console.error('VNP_HASH_SECRET not configured');
            return NextResponse.redirect(new URL('/checkout?error=payment_config_error', request.url));
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
            console.error('VNPAY return: Invalid secure hash');
            return NextResponse.redirect(new URL('/checkout?error=invalid_signature', request.url));
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
            console.error('VNPAY return: Order not found', orderId);
            return NextResponse.redirect(new URL('/checkout?error=order_not_found', request.url));
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
            orderStatus = 'CANCELLED';
        }

        // Update payment record
        await prisma.payment.updateMany({
            where: { orderId: orderId },
            data: {
                status: paymentStatus,
                transactionId: transactionNo || null,
                metadata: {
                    bankCode: bankCode,
                    payDate: payDate,
                    responseCode: responseCode
                },
                paidAt: responseCode === '00' ? new Date() : null
            }
        });

        // Update order status if payment was successful
        if (responseCode === '00') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: orderStatus }
            });
        }

        // Redirect to success or failure page
        if (responseCode === '00') {
            // Success - redirect to order confirmation page
            return NextResponse.redirect(new URL(`/checkout/success?order=${order.orderNumber}`, request.url));
        } else {
            // Failed - redirect back to checkout with error
            const errorMap: { [key: string]: string } = {
                '01': 'transaction_failed',
                '02': 'transaction_failed',
                '04': 'transaction_reversed',
                '05': 'processing',
                '06': 'processing',
                '07': 'suspicious_transaction',
                '09': 'refund_rejected',
                '10': 'wrong_credentials',
                '11': 'timeout',
                '12': 'account_locked',
                '13': 'wrong_otp',
                '24': 'cancelled',
                '51': 'insufficient_funds',
                '65': 'exceeded_limit',
                '75': 'maintenance',
                '79': 'wrong_password',
                '99': 'unknown_error'
            };

            const errorCode = errorMap[responseCode] || 'unknown_error';
            return NextResponse.redirect(new URL(`/checkout?error=${errorCode}&order=${order.orderNumber}`, request.url));
        }

    } catch (error) {
        console.error('VNPAY return processing error:', error);
        return NextResponse.redirect(new URL('/checkout?error=processing_error', request.url));
    }
}
