import crypto from 'crypto';

// MoMo Configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || '',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  ipnUrl: process.env.MOMO_IPN_URL || '',
  redirectUrl: process.env.MOMO_REDIRECT_URL || '',
};

export interface MoMoPaymentRequest {
  orderId: string;
  orderInfo: string;
  amount: number;
  extraData?: string;
  requestType?: 'captureWallet' | 'payWithATM' | 'payWithCC';
}

export interface MoMoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export interface MoMoIPNData {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

/**
 * Tạo signature cho MoMo request
 */
function createSignature(rawData: string): string {
  return crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
}

/**
 * Tạo payment URL cho MoMo
 */
export async function createMoMoPayment(
  request: MoMoPaymentRequest
): Promise<MoMoPaymentResponse> {
  const requestId = `${MOMO_CONFIG.partnerCode}-${Date.now()}`;
  const extraData = request.extraData || '';
  const requestType = request.requestType || 'captureWallet';

  // Tạo raw signature
  const rawSignature = [
    `accessKey=${MOMO_CONFIG.accessKey}`,
    `amount=${request.amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${MOMO_CONFIG.ipnUrl}`,
    `orderId=${request.orderId}`,
    `orderInfo=${request.orderInfo}`,
    `partnerCode=${MOMO_CONFIG.partnerCode}`,
    `redirectUrl=${MOMO_CONFIG.redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join('&');

  const signature = createSignature(rawSignature);

  const requestBody = {
    partnerCode: MOMO_CONFIG.partnerCode,
    partnerName: 'Otaku Shop',
    storeId: MOMO_CONFIG.partnerCode,
    requestId,
    amount: request.amount,
    orderId: request.orderId,
    orderInfo: request.orderInfo,
    redirectUrl: MOMO_CONFIG.redirectUrl,
    ipnUrl: MOMO_CONFIG.ipnUrl,
    lang: 'vi',
    extraData,
    requestType,
    signature,
  };

  const response = await fetch(MOMO_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (data.resultCode !== 0) {
    throw new Error(`MoMo Error: ${data.message} (Code: ${data.resultCode})`);
  }

  return data;
}

/**
 * Xác thực IPN callback từ MoMo
 */
export function verifyMoMoIPN(ipnData: MoMoIPNData): boolean {
  const rawSignature = [
    `accessKey=${MOMO_CONFIG.accessKey}`,
    `amount=${ipnData.amount}`,
    `extraData=${ipnData.extraData}`,
    `message=${ipnData.message}`,
    `orderId=${ipnData.orderId}`,
    `orderInfo=${ipnData.orderInfo}`,
    `orderType=${ipnData.orderType}`,
    `partnerCode=${ipnData.partnerCode}`,
    `payType=${ipnData.payType}`,
    `requestId=${ipnData.requestId}`,
    `responseTime=${ipnData.responseTime}`,
    `resultCode=${ipnData.resultCode}`,
    `transId=${ipnData.transId}`,
  ].join('&');

  const expectedSignature = createSignature(rawSignature);
  return expectedSignature === ipnData.signature;
}

/**
 * Kiểm tra trạng thái thanh toán MoMo
 */
export async function checkMoMoPaymentStatus(
  orderId: string,
  requestId: string
): Promise<{ resultCode: number; message: string }> {
  const rawSignature = [
    `accessKey=${MOMO_CONFIG.accessKey}`,
    `orderId=${orderId}`,
    `partnerCode=${MOMO_CONFIG.partnerCode}`,
    `requestId=${requestId}`,
  ].join('&');

  const signature = createSignature(rawSignature);

  const response = await fetch(
    'https://test-payment.momo.vn/v2/gateway/api/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partnerCode: MOMO_CONFIG.partnerCode,
        requestId,
        orderId,
        signature,
        lang: 'vi',
      }),
    }
  );

  return response.json();
}

/**
 * Hoàn tiền MoMo
 */
export async function refundMoMoPayment(
  orderId: string,
  transId: number,
  amount: number,
  description: string
): Promise<{ resultCode: number; message: string }> {
  const requestId = `${MOMO_CONFIG.partnerCode}-refund-${Date.now()}`;

  const rawSignature = [
    `accessKey=${MOMO_CONFIG.accessKey}`,
    `amount=${amount}`,
    `description=${description}`,
    `orderId=${orderId}`,
    `partnerCode=${MOMO_CONFIG.partnerCode}`,
    `requestId=${requestId}`,
    `transId=${transId}`,
  ].join('&');

  const signature = createSignature(rawSignature);

  const response = await fetch(
    'https://test-payment.momo.vn/v2/gateway/api/refund',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partnerCode: MOMO_CONFIG.partnerCode,
        orderId,
        requestId,
        amount,
        transId,
        lang: 'vi',
        description,
        signature,
      }),
    }
  );

  return response.json();
}

const MoMo = {
  createPayment: createMoMoPayment,
  verifyIPN: verifyMoMoIPN,
  checkStatus: checkMoMoPaymentStatus,
  refund: refundMoMoPayment,
};

export default MoMo;
