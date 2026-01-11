import { NextRequest, NextResponse } from 'next/server';
import { trackOrder } from '@/lib/ghn';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderCode = searchParams.get('orderCode');

    if (!orderCode) {
      return NextResponse.json(
        { error: 'Order code is required' },
        { status: 400 }
      );
    }

    const trackingInfo = await trackOrder(orderCode);

    // Map status to Vietnamese
    const statusMap: Record<string, string> = {
      ready_to_pick: 'Chờ lấy hàng',
      picking: 'Đang lấy hàng',
      cancel: 'Đã hủy',
      money_collect_picking: 'Đang thu tiền người gửi',
      picked: 'Đã lấy hàng',
      storing: 'Đang lưu kho',
      transporting: 'Đang vận chuyển',
      sorting: 'Đang phân loại',
      delivering: 'Đang giao hàng',
      money_collect_delivering: 'Đang thu tiền người nhận',
      delivered: 'Giao hàng thành công',
      delivery_fail: 'Giao hàng thất bại',
      waiting_to_return: 'Chờ hoàn hàng',
      return: 'Đang hoàn hàng',
      return_transporting: 'Đang vận chuyển hoàn',
      return_sorting: 'Đang phân loại hoàn',
      returning: 'Đang hoàn hàng về',
      return_fail: 'Hoàn hàng thất bại',
      returned: 'Đã hoàn hàng',
      exception: 'Ngoại lệ',
      damage: 'Hàng bị hư hỏng',
      lost: 'Hàng bị thất lạc',
    };

    return NextResponse.json({
      success: true,
      data: {
        orderCode: trackingInfo.order_code,
        status: trackingInfo.status,
        statusVi: statusMap[trackingInfo.status] || trackingInfo.status,
        statusId: trackingInfo.status_id,
        logs: trackingInfo.log.map((log) => ({
          status: log.status,
          statusVi: statusMap[log.status] || log.status,
          updatedAt: log.updated_date,
        })),
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track order' },
      { status: 500 }
    );
  }
}
