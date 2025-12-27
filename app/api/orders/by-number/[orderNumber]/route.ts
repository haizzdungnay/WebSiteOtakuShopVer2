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
                note: order.note,
                shippingFullName: order.shippingFullName,
                shippingPhone: order.shippingPhone,
                shippingAddress: order.shippingAddress,
                shippingWard: order.shippingWard,
                shippingDistrict: order.shippingDistrict,
                shippingCity: order.shippingCity,
                createdAt: order.createdAt.toISOString(),
                orderItems: order.orderItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: Number(item.price),
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        slug: item.product.slug,
                        images: item.product.images
                    }
                })),
                payment: order.payment ? {
                    method: order.payment.method,
                    status: order.payment.status
                } : undefined,
                shipping: order.shipping ? {
                    carrier: order.shipping.carrier,
                    trackingCode: order.shipping.trackingCode,
                    status: order.shipping.status
                } : undefined
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
