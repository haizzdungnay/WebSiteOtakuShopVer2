import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// ==========================================
// Status Transition Rules
// ==========================================

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

// ==========================================
// Validation Schema
// ==========================================

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
  
  // Shipping info (required for SHIPPING status)
  trackingCode: z.string().max(100).optional().nullable(),
  carrier: z.string().max(50).optional().nullable(),
  
  // Admin note
  adminNote: z.string().max(1000).optional().nullable()
})

// ==========================================
// PUT /api/admin/orders/[id]/status
// ==========================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // 3. Get current order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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

    // 4. Validate status transition
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

    // 5. Validate required fields
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

    // 6. Update order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update order status and note
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: validatedData.status,
          note: validatedData.adminNote 
            ? (order.note ? `${order.note}\n\n[Admin] ${validatedData.adminNote}` : `[Admin] ${validatedData.adminNote}`)
            : undefined
        }
      })

      // Update payment status if payment exists
      if (order.payment) {
        const newPaymentStatus = PAYMENT_STATUS_MAP[validatedData.status as keyof typeof PAYMENT_STATUS_MAP] as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REFUNDED'
        
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: newPaymentStatus,
            // Set paidAt when order is delivered (COD) and not yet paid
            paidAt: newPaymentStatus === 'COMPLETED' && !order.payment.paidAt
              ? new Date()
              : undefined
          }
        })
      }

      // Update shipping status if shipping exists
      if (order.shipping) {
        const newShippingStatus = SHIPPING_STATUS_MAP[validatedData.status as keyof typeof SHIPPING_STATUS_MAP] as 'PREPARING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED'
        
        await tx.shipping.update({
          where: { id: order.shipping.id },
          data: {
            status: newShippingStatus,
            trackingCode: validatedData.trackingCode || undefined,
            carrier: validatedData.carrier || undefined,
            // Set shippedAt when status changes to SHIPPING
            shippedAt: validatedData.status === 'SHIPPING' && !order.shipping.shippedAt
              ? new Date()
              : undefined,
            // Set deliveredAt when status changes to DELIVERED
            deliveredAt: validatedData.status === 'DELIVERED' && !order.shipping.deliveredAt
              ? new Date()
              : undefined,
            // Append admin note to shipping notes
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

    // 7. Log admin activity
    console.log(`[ADMIN] ${admin.email} updated order ${order.orderNumber} status: ${order.status} → ${validatedData.status}`)

    // 8. Return success response
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
