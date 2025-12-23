import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import qs from 'qs';

// Validation schema
const createPaymentSchema = z.object({
    orderId: z.string(),
    amount: z.number().positive(),
    orderInfo: z.string().min(1),
    bankCode: z.string().optional()
});

// Helper function to sort object keys
function sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = request.headers.get('x-client-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (realIp) {
        return realIp;
    }
    if (clientIp) {
        return clientIp;
    }

    // Fallback to localhost for development
    return '127.0.0.1';
}

export async function POST(request: NextRequest) {
    try {
        // Validate input
        const body = await request.json();
        const validatedData = createPaymentSchema.parse(body);

        // Get VNPAY config from environment
        const vnpTmnCode = process.env.VNP_TMN_CODE;
        const vnpHashSecret = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_URL;
        const vnpReturnUrl = process.env.VNP_RETURN_URL;

        if (!vnpTmnCode || !vnpHashSecret || !vnpUrl || !vnpReturnUrl) {
            console.error('VNPAY configuration missing');
            return NextResponse.json(
                { success: false, error: 'VNPAY configuration error' },
                { status: 500 }
            );
        }

        // Create VNPAY parameters - Format: yyyyMMddHHmmss
        const now = new Date();
        const createDate = now.getFullYear().toString() +
                          (now.getMonth() + 1).toString().padStart(2, '0') +
                          now.getDate().toString().padStart(2, '0') +
                          now.getHours().toString().padStart(2, '0') +
                          now.getMinutes().toString().padStart(2, '0') +
                          now.getSeconds().toString().padStart(2, '0');

        const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        const expireDate = expireTime.getFullYear().toString() +
                          (expireTime.getMonth() + 1).toString().padStart(2, '0') +
                          expireTime.getDate().toString().padStart(2, '0') +
                          expireTime.getHours().toString().padStart(2, '0') +
                          expireTime.getMinutes().toString().padStart(2, '0') +
                          expireTime.getSeconds().toString().padStart(2, '0');

        const vnpParams: any = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpTmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: validatedData.orderId,
            vnp_OrderInfo: validatedData.orderInfo.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 255), // Sanitize order info
            vnp_OrderType: 'other',
            vnp_Amount: validatedData.amount * 100, // VNPAY expects amount in smallest currency unit
            vnp_ReturnUrl: vnpReturnUrl,
            vnp_IpAddr: getClientIp(request),
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate
        };

        // Add bank code if specified
        if (validatedData.bankCode && validatedData.bankCode !== '') {
            vnpParams.vnp_BankCode = validatedData.bankCode;
        }

        // Sort parameters
        const sortedParams = sortObject(vnpParams);

        // Create query string using URLSearchParams (matches working implementation)
        const querystring = new URLSearchParams();
        Object.entries(sortedParams).forEach(([key, value]) => {
            querystring.append(key, String(value));
        });

        // Create secure hash (SHA-512 like the working implementation)
        const signData = querystring.toString();
        const hmac = crypto.createHmac('sha512', vnpHashSecret);
        const signed = hmac.update(signData, 'utf8').digest('hex');

        // Add secure hash to parameters
        sortedParams.vnp_SecureHash = signed;

        // Create final payment URL (matches working implementation)
        const finalQuerystring = new URLSearchParams();
        Object.entries(sortedParams).forEach(([key, value]) => {
            finalQuerystring.append(key, String(value));
        });

        const paymentUrl = `${vnpUrl}?${finalQuerystring.toString()}`;

        return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
            orderId: validatedData.orderId
        });

    } catch (error) {
        console.error('VNPAY payment creation error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Không thể tạo thanh toán VNPAY' },
            { status: 500 }
        );
    }
}
