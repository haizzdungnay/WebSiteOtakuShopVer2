/**
 * Giao Hàng Nhanh (GHN) API Integration
 * API Documentation: https://api.ghn.vn/home/docs/detail
 */

const GHN_CONFIG = {
  token: process.env.GHN_TOKEN || '',
  shopId: parseInt(process.env.GHN_SHOP_ID || '0'),
  // Production: https://online-gateway.ghn.vn
  // Sandbox: https://dev-online-gateway.ghn.vn
  baseUrl: process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn',
};

interface GHNResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface Province {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
}

interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
}

interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

interface ShippingFeeRequest {
  fromDistrictId: number;
  fromWardCode: string;
  toDistrictId: number;
  toWardCode: string;
  weight: number; // gram
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  insuranceValue?: number;
  serviceTypeId?: number; // 2: E-commerce Standard
  coupon?: string;
}

interface ShippingFeeResponse {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
}

interface CreateOrderRequest {
  toName: string;
  toPhone: string;
  toAddress: string;
  toWardCode: string;
  toDistrictId: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceTypeId: number;
  paymentTypeId: number; // 1: Người bán trả phí, 2: Người mua trả phí
  requiredNote: 'CHOTHUHANG' | 'CHOXEMHANGKHONGTHU' | 'KHONGCHOXEMHANG';
  content: string;
  codAmount?: number;
  insuranceValue?: number;
  items: Array<{
    name: string;
    code?: string;
    quantity: number;
    price: number;
    weight: number;
  }>;
  note?: string;
}

interface CreateOrderResponse {
  order_code: string;
  sort_code: string;
  trans_type: string;
  ward_encode: string;
  district_encode: string;
  fee: {
    main_service: number;
    insurance: number;
    station_do: number;
    station_pu: number;
    return: number;
    r2s: number;
    coupon: number;
  };
  total_fee: number;
  expected_delivery_time: string;
}

interface TrackingInfo {
  order_code: string;
  status: string;
  status_id: number;
  log: Array<{
    status: string;
    updated_date: string;
  }>;
}

async function ghnRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${GHN_CONFIG.baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Token': GHN_CONFIG.token,
      'ShopId': GHN_CONFIG.shopId.toString(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data: GHNResponse<T> = await response.json();

  if (data.code !== 200) {
    throw new Error(`GHN Error: ${data.message} (Code: ${data.code})`);
  }

  return data.data;
}

/**
 * Lấy danh sách tỉnh/thành phố
 */
export async function getProvinces(): Promise<Province[]> {
  return ghnRequest<Province[]>('/shiip/public-api/master-data/province', 'GET');
}

/**
 * Lấy danh sách quận/huyện theo tỉnh
 */
export async function getDistricts(provinceId: number): Promise<District[]> {
  return ghnRequest<District[]>('/shiip/public-api/master-data/district', 'POST', {
    province_id: provinceId,
  });
}

/**
 * Lấy danh sách phường/xã theo quận
 */
export async function getWards(districtId: number): Promise<Ward[]> {
  return ghnRequest<Ward[]>('/shiip/public-api/master-data/ward', 'POST', {
    district_id: districtId,
  });
}

/**
 * Tính phí vận chuyển
 */
export async function calculateShippingFee(
  request: ShippingFeeRequest
): Promise<ShippingFeeResponse> {
  return ghnRequest<ShippingFeeResponse>(
    '/shiip/public-api/v2/shipping-order/fee',
    'POST',
    {
      from_district_id: request.fromDistrictId,
      from_ward_code: request.fromWardCode,
      to_district_id: request.toDistrictId,
      to_ward_code: request.toWardCode,
      weight: request.weight,
      length: request.length || 20,
      width: request.width || 20,
      height: request.height || 20,
      insurance_value: request.insuranceValue || 0,
      service_type_id: request.serviceTypeId || 2,
      coupon: request.coupon,
    }
  );
}

/**
 * Lấy danh sách dịch vụ vận chuyển
 */
export async function getAvailableServices(
  fromDistrictId: number,
  toDistrictId: number
): Promise<Array<{ service_id: number; short_name: string; service_type_id: number }>> {
  return ghnRequest<Array<{ service_id: number; short_name: string; service_type_id: number }>>(
    '/shiip/public-api/v2/shipping-order/available-services',
    'POST',
    {
      shop_id: GHN_CONFIG.shopId,
      from_district: fromDistrictId,
      to_district: toDistrictId,
    }
  );
}

/**
 * Tạo đơn vận chuyển
 */
export async function createShippingOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResponse> {
  // Shop address from config or default
  const shopDistrictId = parseInt(process.env.GHN_SHOP_DISTRICT_ID || '1454'); // Quận 1
  const shopWardCode = process.env.GHN_SHOP_WARD_CODE || '21012';

  return ghnRequest<CreateOrderResponse>(
    '/shiip/public-api/v2/shipping-order/create',
    'POST',
    {
      payment_type_id: request.paymentTypeId,
      note: request.note || '',
      required_note: request.requiredNote,
      from_name: process.env.GHN_SHOP_NAME || 'Otaku Shop',
      from_phone: process.env.GHN_SHOP_PHONE || '0123456789',
      from_address: process.env.GHN_SHOP_ADDRESS || '123 Đường ABC',
      from_ward_code: shopWardCode,
      from_district_id: shopDistrictId,
      to_name: request.toName,
      to_phone: request.toPhone,
      to_address: request.toAddress,
      to_ward_code: request.toWardCode,
      to_district_id: request.toDistrictId,
      cod_amount: request.codAmount || 0,
      content: request.content,
      weight: request.weight,
      length: request.length,
      width: request.width,
      height: request.height,
      insurance_value: request.insuranceValue || 0,
      service_type_id: request.serviceTypeId,
      items: request.items,
    }
  );
}

/**
 * Theo dõi đơn vận chuyển
 */
export async function trackOrder(orderCode: string): Promise<TrackingInfo> {
  return ghnRequest<TrackingInfo>(
    '/shiip/public-api/v2/shipping-order/detail',
    'POST',
    {
      order_code: orderCode,
    }
  );
}

/**
 * Hủy đơn vận chuyển
 */
export async function cancelOrder(orderCodes: string[]): Promise<void> {
  await ghnRequest<void>(
    '/shiip/public-api/v2/switch-status/cancel',
    'POST',
    {
      order_codes: orderCodes,
    }
  );
}

/**
 * Tính thời gian giao hàng dự kiến
 */
export async function getLeadTime(
  fromDistrictId: number,
  fromWardCode: string,
  toDistrictId: number,
  toWardCode: string,
  serviceId: number
): Promise<{ leadtime: number; leadtime_order: { from_estimate_date: string; to_estimate_date: string } }> {
  return ghnRequest<{ leadtime: number; leadtime_order: { from_estimate_date: string; to_estimate_date: string } }>(
    '/shiip/public-api/v2/shipping-order/leadtime',
    'POST',
    {
      from_district_id: fromDistrictId,
      from_ward_code: fromWardCode,
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      service_id: serviceId,
    }
  );
}

// Service type mapping
export const GHN_SERVICE_TYPES = {
  STANDARD: 2, // Giao hàng tiêu chuẩn
  EXPRESS: 1, // Giao hàng nhanh
};

// Payment type mapping
export const GHN_PAYMENT_TYPES = {
  SELLER_PAY: 1, // Người bán trả phí ship
  BUYER_PAY: 2, // Người mua trả phí ship (COD)
};

const GHN = {
  getProvinces,
  getDistricts,
  getWards,
  calculateShippingFee,
  getAvailableServices,
  createShippingOrder,
  trackOrder,
  cancelOrder,
  getLeadTime,
  SERVICE_TYPES: GHN_SERVICE_TYPES,
  PAYMENT_TYPES: GHN_PAYMENT_TYPES,
};

export default GHN;
