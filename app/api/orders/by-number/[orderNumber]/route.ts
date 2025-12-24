import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const orderNumber = params.orderNumber;

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order number is required' },
                { status: 400 }
            );
        }

        // Fetch order with payment and shipping info
        const order = await prisma.order.findUnique({
            where: { orderNumber: orderNumber },
            include: {
                payment: true,
                shipping: true,
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Return order data
        return NextResponse.json({
            success: true,
            data: {
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                totalAmount: Number(order.totalAmount),
                status: order.status,
                shippingAddress: order.shippingAddress,
                shippingWard: order.shippingWard,
                shippingDistrict: order.shippingDistrict,
                shippingCity: order.shippingCity,
                paymentMethod: order.payment?.method || 'COD',
                paymentStatus: order.payment?.status || 'PENDING',
                createdAt: order.createdAt.toISOString(),
                orderItems: order.orderItems.map(item => ({
                    productId: item.productId,
                    productName: item.product.name,
                    productSlug: item.product.slug,
                    productImage: item.product.images[0] || null,
                    quantity: item.quantity,
                    price: Number(item.price),
                    total: Number(item.price) * item.quantity
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
