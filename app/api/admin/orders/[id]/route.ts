import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/orders/[id] - Order detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // 2. Get order detail with all relations
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            avatar: true,
            createdAt: true
          }
        },
        address: true,
        coupon: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
            minOrder: true,
            maxDiscount: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                isActive: true
              }
            }
          },
          orderBy: { id: 'asc' }
        },
        payment: true,
        shipping: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      )
    }

    // 3. Calculate order statistics
    const itemsCount = order.orderItems.length
    const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    
    // Calculate subtotal before discount
    const subtotal = order.orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity, 
      0
    )

    // Calculate discount amount
    let discountAmount = 0
    if (order.coupon) {
      if (order.coupon.type === 'PERCENTAGE') {
        discountAmount = (subtotal * Number(order.coupon.value)) / 100
        if (order.coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, Number(order.coupon.maxDiscount))
        }
      } else {
        discountAmount = Number(order.coupon.value)
      }
    }

    const shippingFee = order.shipping ? Number(order.shipping.fee) : 0

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        statistics: {
          itemsCount,
          totalQuantity,
          subtotal,
          discountAmount,
          shippingFee,
          finalAmount: Number(order.totalAmount)
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get order detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy chi tiết đơn hàng' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const body = await request.json()
    const { status, trackingCode, carrier, shippingNote } = body

    // 2. Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      )
    }

    // 3. Get current order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { shipping: true, payment: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      )
    }

    // 4. Update order and related data
    const updateData: any = {}
    if (status) {
      updateData.status = status
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const updated = await tx.order.update({
        where: { id },
        data: updateData
      })

      // Update shipping if provided
      if (order.shipping && (trackingCode || carrier || shippingNote)) {
        await tx.shipping.update({
          where: { id: order.shipping.id },
          data: {
            ...(trackingCode && { trackingCode }),
            ...(carrier && { carrier }),
            ...(shippingNote && { note: shippingNote }),
            ...(status === 'SHIPPING' && { status: 'IN_TRANSIT' }),
            ...(status === 'DELIVERED' && { status: 'DELIVERED' })
          }
        })
      }

      // Update payment status if order is cancelled
      if (status === 'CANCELLED' && order.payment && order.payment.status !== 'COMPLETED') {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: 'CANCELLED' }
        })
      }

      // Mark payment as completed when delivered (for COD)
      if (status === 'DELIVERED' && order.payment && order.payment.method === 'COD') {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: 'COMPLETED' }
        })
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Cập nhật đơn hàng thành công'
    })

  } catch (error) {
    console.error('[Admin] Update order error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật đơn hàng' },
      { status: 500 }
    )
  }
}
