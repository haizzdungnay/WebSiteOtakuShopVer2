'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Home, Receipt } from 'lucide-react';

interface OrderData {
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    shippingWard?: string;
    shippingDistrict: string;
    shippingCity: string;
    paymentMethod: string;
    createdAt: string;
}

// Component chính sử dụng useSearchParams
function CheckoutSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');

    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderNumber) {
            router.push('/');
            return;
        }

        // Fetch order details
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`/api/orders/by-number/${orderNumber}`);
                if (!response.ok) {
                    throw new Error('Không thể tải thông tin đơn hàng');
                }
                const data = await response.json();
                if (data.success) {
                    setOrderData(data.data);
                } else {
                    throw new Error(data.error || 'Không tìm thấy đơn hàng');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderNumber, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-12">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-8">
                            <div className="text-red-500 mb-4">
                                <Receipt size={48} className="mx-auto" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {error || 'Không tìm thấy đơn hàng'}
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Có vẻ như có lỗi xảy ra khi xử lý đơn hàng của bạn.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/"
                                    className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Về trang chủ
                                </Link>
                                <div>
                                    <Link
                                        href="/tra-cuu"
                                        className="text-accent-red hover:text-red-700 font-medium"
                                    >
                                        Tra cứu đơn hàng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-8">
            <div className="container-custom">
                {/* Success Header */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-8 mb-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Đặt hàng thành công!
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                            </p>
                            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                                <span className="font-bold text-accent-red ml-2">{orderData.orderNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Information */}
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package className="text-accent-red" />
                                Thông tin đơn hàng
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                                    <span className="font-semibold">{orderData.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                                    <span className="font-semibold text-green-600">
                                        {orderData.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                         orderData.status === 'PREPARING' ? 'Đang chuẩn bị' :
                                         orderData.status === 'SHIPPING' ? 'Đang giao hàng' :
                                         orderData.status === 'DELIVERED' ? 'Đã giao' :
                                         orderData.status === 'COMPLETED' ? 'Hoàn thành' :
                                         orderData.status === 'CANCELLED' ? 'Đã hủy' : orderData.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ngày đặt:</span>
                                    <span className="font-semibold">
                                        {new Date(orderData.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                                    <span className="font-bold text-xl text-accent-red">
                                        {orderData.totalAmount.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Home className="text-accent-red" />
                                Thông tin khách hàng
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Họ tên:</span>
                                    <p className="font-semibold">{orderData.customerName}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                                    <p className="font-semibold">{orderData.customerPhone}</p>
                                </div>
                                {orderData.customerEmail && (
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                        <p className="font-semibold">{orderData.customerEmail}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Địa chỉ giao hàng:</span>
                                    <p className="font-semibold">
                                        {orderData.shippingAddress}
                                        {orderData.shippingWard && `, ${orderData.shippingWard}`}
                                        {`, ${orderData.shippingDistrict}, ${orderData.shippingCity}`}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Phương thức thanh toán:</span>
                                    <p className="font-semibold">
                                        {orderData.paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPAY' :
                                         orderData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' :
                                         orderData.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' :
                                         orderData.paymentMethod === 'MOMO' ? 'Ví MoMo' :
                                         orderData.paymentMethod === 'ZALOPAY' ? 'Ví ZaloPay' :
                                         orderData.paymentMethod === 'CREDIT_CARD' ? 'Thẻ tín dụng' :
                                         orderData.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Truck className="text-accent-red" />
                            Các bước tiếp theo
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border border-gray-200 rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package size={24} className="text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Xử lý đơn hàng</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Chúng tôi sẽ kiểm tra và chuẩn bị hàng trong 1-2 ngày làm việc
                                </p>
                            </div>
                            <div className="text-center p-4 border border-gray-200 rounded-lg">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Truck size={24} className="text-yellow-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Giao hàng</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Đơn hàng sẽ được giao đến địa chỉ của bạn trong 3-5 ngày
                                </p>
                            </div>
                            <div className="text-center p-4 border border-gray-200 rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle size={24} className="text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Hoàn thành</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Bạn sẽ nhận được thông báo khi đơn hàng được giao thành công
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6 mt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
                            >
                                Tiếp tục mua sắm
                            </Link>
                            <Link
                                href="/tra-cuu"
                                className="border border-accent-red text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
                            >
                                Tra cứu đơn hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
        </div>
    );
}

// Page component wrap với Suspense
export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
