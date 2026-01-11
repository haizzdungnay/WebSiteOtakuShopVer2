import { NextRequest, NextResponse } from 'next/server';
import { calculateShippingFee, getAvailableServices } from '@/lib/ghn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      toDistrictId,
      toWardCode,
      weight = 500, // Default 500g
      length = 20,
      width = 20,
      height = 10,
      insuranceValue = 0,
    } = body;

    if (!toDistrictId || !toWardCode) {
      return NextResponse.json(
        { error: 'District ID and Ward Code are required' },
        { status: 400 }
      );
    }

    // Shop location (from env or default to District 1, HCM)
    const fromDistrictId = parseInt(process.env.GHN_SHOP_DISTRICT_ID || '1454');
    const fromWardCode = process.env.GHN_SHOP_WARD_CODE || '21012';

    // Lấy các dịch vụ khả dụng
    const services = await getAvailableServices(fromDistrictId, toDistrictId);

    // Tính phí cho từng dịch vụ
    const shippingOptions = await Promise.all(
      services.map(async (service) => {
        try {
          const fee = await calculateShippingFee({
            fromDistrictId,
            fromWardCode,
            toDistrictId,
            toWardCode,
            weight,
            length,
            width,
            height,
            insuranceValue,
            serviceTypeId: service.service_type_id,
          });

          return {
            serviceId: service.service_id,
            serviceName: service.short_name,
            serviceTypeId: service.service_type_id,
            fee: fee.total,
            serviceFee: fee.service_fee,
            insuranceFee: fee.insurance_fee,
          };
        } catch (error) {
          console.error(`Error calculating fee for service ${service.service_id}:`, error);
          return null;
        }
      })
    );

    // Lọc các options thành công
    const validOptions = shippingOptions.filter((opt) => opt !== null);

    if (validOptions.length === 0) {
      return NextResponse.json(
        { error: 'No shipping options available for this location' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: validOptions,
    });
  } catch (error) {
    console.error('Shipping fee calculation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}
