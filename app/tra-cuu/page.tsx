'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, ShoppingBag, MapPin, Search, Calendar, TruckIcon, CheckCircle2, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  note?: string;
  createdAt: string;
  shippingFullName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingCity?: string;
  orderItems: OrderItem[];
  payment?: {
    method: string;
    status: string;
  };
  shipping?: {
    carrier: string;
    trackingCode?: string;
    status: string;
  };
}

function OrderTrackingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('order');
  
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState(orderNumberParam || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch order by order number
  useEffect(() => {
    if (orderNumberParam) {
      setActiveTab('orders');
      fetchOrderByNumber(orderNumberParam);
    }
  }, [orderNumberParam]);

  const fetchOrderByNumber = async (orderNumber: string) => {
    if (!orderNumber.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/by-number/${orderNumber}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrders([data.data]);
          setSelectedOrder(data.data);
          setShowOrderModal(true);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchOrderByNumber(searchQuery.trim());
    }
  };

  const sidebarItems = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { id: 'orders', icon: Package, label: 'Tra cứu đơn hàng' },
    { id: 'preorders', icon: ShoppingBag, label: 'Đơn đặt trước & mua hộ' },
    { id: 'addresses', icon: MapPin, label: 'Địa chỉ giao hàng' },
  ];

  const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    PREPARING: { label: 'Đang chuẩn bị', color: 'bg-orange-100 text-orange-800' },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
    DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Hoàn thành', color: 'bg-green-700 text-white' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
  };

  const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-800' }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Tra cứu đơn hàng</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tra cứu đơn hàng</h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tình trạng đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* User Info */}
              {user && (
                <div className="p-6 bg-gradient-to-br from-primary to-primary-light border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.username || 'User'} 
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <nav className="p-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-accent-red text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' || activeTab === 'preorders' ? (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Search & Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Nhập mã đơn hàng (VD: OTK-20251227-93500)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                      />
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="px-6 py-2 bg-accent-red text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Đang tìm...
                        </>
                      ) : (
                        <>
                          <Search size={20} />
                          Tra cứu
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                {loading ? (
                  <div className="p-12 text-center">
                    <Loader2 size={48} className="text-accent-red animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tìm kiếm đơn hàng...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'Không tìm thấy đơn hàng' : 'Nhập mã đơn hàng để tra cứu'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery 
                        ? 'Vui lòng kiểm tra lại mã đơn hàng và thử lại'
                        : 'Nhập mã đơn hàng (VD: OTK-20251227-93500) để tra cứu trạng thái đơn hàng của bạn'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => {
                      const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
                      const paymentInfo = order.payment ? PAYMENT_STATUS_MAP[order.payment.status] || { label: order.payment.status, color: 'bg-gray-100 text-gray-800' } : null;
                      
                      return (
                        <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                          {/* Order Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div>
                                <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <Calendar size={14} />
                                  <span>{formatDate(order.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-accent-red">
                                {formatPrice(Number(order.totalAmount))}
                              </div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Khách hàng:</span> {order.customerName}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">SĐT:</span> {order.customerPhone}
                            </p>
                            {order.customerEmail && (
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Email:</span> {order.customerEmail}
                              </p>
                            )}
                          </div>

                          {/* Products */}
                          <div className="mb-4 space-y-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 text-sm">
                                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                  {item.product.images?.[0] && (
                                    <Image
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="text-gray-700 flex-1">
                                  {item.product.name} x{item.quantity}
                                </span>
                                <span className="text-gray-900 font-semibold">
                                  {formatPrice(Number(item.price) * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Status Badges */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <TruckIcon size={16} className="text-gray-400" />
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            {paymentInfo && (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-gray-400" />
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentInfo.color}`}>
                                  {paymentInfo.label}
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                              className="ml-auto text-accent-red font-semibold text-sm hover:underline"
                            >
                              Xem chi tiết →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Other tabs placeholder
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tính năng đang phát triển
                </h3>
                <p className="text-gray-600">
                  Chức năng này sẽ sớm được cập nhật
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500">#{selectedOrder.orderNumber}</p>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedOrder.customerName}</h3>
                  <p className="text-sm text-slate-500">{selectedOrder.customerPhone}</p>
                  {selectedOrder.customerEmail && <p className="text-sm text-slate-500">{selectedOrder.customerEmail}</p>}
                </div>
                <button onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }} className="p-2 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Thông tin đơn hàng</p>
                  <p className="text-sm text-slate-600">
                    Trạng thái: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_MAP[selectedOrder.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {ORDER_STATUS_MAP[selectedOrder.status]?.label || selectedOrder.status}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Tổng tiền: <span className="font-semibold">{formatPrice(Number(selectedOrder.totalAmount))}</span></p>
                  <p className="text-sm text-slate-600 mt-1">Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Địa chỉ giao hàng</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingFullName || selectedOrder.customerName}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingPhone || selectedOrder.customerPhone}</p>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.shippingAddress}
                    {selectedOrder.shippingWard && `, ${selectedOrder.shippingWard}`}
                    {selectedOrder.shippingDistrict && `, ${selectedOrder.shippingDistrict}`}
                    {selectedOrder.shippingCity && `, ${selectedOrder.shippingCity}`}
                  </p>
                </div>
              </div>

              {selectedOrder.note && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">📝 Ghi chú của khách hàng</p>
                  <p className="text-sm text-yellow-700">{selectedOrder.note}</p>
                </div>
              )}

              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-2">Sản phẩm</p>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between text-sm items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                          {item.product.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span>{item.product.name} x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.shipping?.trackingCode && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-1">🚚 Mã vận đơn</p>
                  <p className="text-sm text-blue-700 font-mono">{selectedOrder.shipping.trackingCode}</p>
                  <p className="text-xs text-blue-600 mt-1">Đơn vị vận chuyển: {selectedOrder.shipping.carrier}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải trang tra cứu...</p>
      </div>
    </div>
  );
}

// Page component wrap với Suspense
export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderTrackingContent />
    </Suspense>
  );
}
