import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Quy tắc chuyển trạng thái đơn hàng

const STATUS_FLOW = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
}

// Map OrderStatus -> PaymentStatus
const PAYMENT_STATUS_MAP = {
  PENDING: 'PENDING',
  CONFIRMED: 'PROCESSING',
  PREPARING: 'PROCESSING',
  SHIPPING: 'PROCESSING',
  DELIVERED: 'COMPLETED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

// Map OrderStatus -> ShippingStatus
const SHIPPING_STATUS_MAP = {
  PENDING: 'PREPARING',
  CONFIRMED: 'PREPARING',
  PREPARING: 'PREPARING',
  SHIPPING: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'DELIVERED',
  CANCELLED: 'FAILED'
}

// Schema validation

const updateStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED', 
    'PREPARING',
    'SHIPPING',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
  ]),
  
  // Thông tin vận chuyển (bắt buộc khi chuyển sang SHIPPING)
  trackingCode: z.string().max(100).optional().nullable(),
  carrier: z.string().max(50).optional().nullable(),
  
  // Ghi chú của admin
  adminNote: z.string().max(1000).optional().nullable()
})

// PUT /api/admin/orders/[id]/status

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Kiểm tra quyền admin
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập. Yêu cầu quyền admin.' },
        { status: 403 }
      )
    }

    // Get params (Next.js 16+ requires await)
    const { id } = await params

    // 2. Validate dữ liệu đầu vào
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // 3. Lấy thông tin đơn hàng hiện tại
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        userId: true,
        note: true,
        payment: {
          select: { 
            id: true, 
            status: true,
            paidAt: true
          }
        },
        shipping: {
          select: { 
            id: true, 
            status: true,
            shippedAt: true,
            deliveredAt: true,
            notes: true
          }
        },
        orderItems: {
          select: {
            productId: true,
            quantity: true
          }
        },
        couponId: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      )
    }

    // 4. Kiểm tra quy tắc chuyển trạng thái
    const allowedStatuses = STATUS_FLOW[order.status as keyof typeof STATUS_FLOW] as string[]
    
    if (!allowedStatuses.includes(validatedData.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Không thể chuyển từ trạng thái "${order.status}" sang "${validatedData.status}"`,
          allowedStatuses: allowedStatuses
        },
        { status: 400 }
      )
    }

    // 5. Kiểm tra các trường bắt buộc
    if (validatedData.status === 'SHIPPING') {
      if (!validatedData.trackingCode || !validatedData.carrier) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Vui lòng nhập mã vận đơn và đơn vị vận chuyển khi chuyển sang trạng thái giao hàng' 
          },
          { status: 400 }
        )
      }
    }

    // 6. Cập nhật đơn hàng trong transaction
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái đơn hàng và ghi chú
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: validatedData.status,
          note: validatedData.adminNote 
            ? (order.note ? `${order.note}\n\n[Admin] ${validatedData.adminNote}` : `[Admin] ${validatedData.adminNote}`)
            : undefined
        }
      })

      // Cập nhật trạng thái thanh toán nếu có
      if (order.payment) {
        const newPaymentStatus = PAYMENT_STATUS_MAP[validatedData.status as keyof typeof PAYMENT_STATUS_MAP] as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REFUNDED'
        
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: newPaymentStatus,
            // Đánh dấu đã thanh toán khi giao hàng thành công (COD) và chưa thanh toán
            paidAt: newPaymentStatus === 'COMPLETED' && !order.payment.paidAt
              ? new Date()
              : undefined
          }
        })
      }

      // Cập nhật trạng thái vận chuyển nếu có
      if (order.shipping) {
        const newShippingStatus = SHIPPING_STATUS_MAP[validatedData.status as keyof typeof SHIPPING_STATUS_MAP] as 'PREPARING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED'
        
        await tx.shipping.update({
          where: { id: order.shipping.id },
          data: {
            status: newShippingStatus,
            trackingCode: validatedData.trackingCode || undefined,
            carrier: validatedData.carrier || undefined,
            // Đặt shippedAt khi chuyển sang trạng thái SHIPPING
            shippedAt: validatedData.status === 'SHIPPING' && !order.shipping.shippedAt
              ? new Date()
              : undefined,
            // Đặt deliveredAt khi chuyển sang trạng thái DELIVERED
            deliveredAt: validatedData.status === 'DELIVERED' && !order.shipping.deliveredAt
              ? new Date()
              : undefined,
            // Thêm ghi chú admin vào ghi chú vận chuyển
            notes: validatedData.adminNote
              ? (order.shipping.notes ? `${order.shipping.notes}\n\n[Admin] ${validatedData.adminNote}` : `[Admin] ${validatedData.adminNote}`)
              : undefined
          }
        })
      }

      // If cancelled, restore product stock and coupon usage
      if (validatedData.status === 'CANCELLED') {
        // Restore product stock
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { increment: item.quantity }
            }
          })
        }

        // Return coupon usage if used
        if (order.couponId) {
          await tx.coupon.update({
            where: { id: order.couponId },
            data: {
              usedCount: { decrement: 1 }
            }
          })
        }
      }

      return updatedOrder
    })

    // 7. Log admin activity for audit trail
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: admin.userId,
          action: 'UPDATE_ORDER_STATUS',
          entityType: 'Order',
          entityId: id,
          oldValue: { status: order.status },
          newValue: {
            status: result.status,
            trackingCode: validatedData.trackingCode,
            carrier: validatedData.carrier,
            adminNote: validatedData.adminNote
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          userAgent: request.headers.get('user-agent') || null
        }
      })
    } catch (logError) {
      // Don't fail the request if audit logging fails
      console.error('[AUDIT] Failed to log admin action:', logError)
    }

    // 8. Trả về kết quả thành công
    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng thành công`,
      data: {
        orderId: result.id,
        orderNumber: result.orderNumber,
        oldStatus: order.status,
        newStatus: result.status,
        updatedAt: result.updatedAt
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[ADMIN] Update order status error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.' 
      },
      { status: 500 }
    )
  }
}
