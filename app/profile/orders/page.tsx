'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  User,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  Calendar,
  FileText
} from 'lucide-react';

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
  status: string;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingWard: string | null;
  shippingDistrict: string;
  shippingCity: string;
  orderItems: OrderItem[];
  payment?: {
    method: string;
    status: string;
  };
  shipping?: {
    carrier: string;
    trackingCode: string | null;
    status: string;
  };
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-100', icon: <Clock size={16} /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-100', icon: <CheckCircle size={16} /> },
  PREPARING: { label: 'Đang chuẩn bị', color: 'text-orange-600 bg-orange-100', icon: <Package size={16} /> },
  SHIPPING: { label: 'Đang giao hàng', color: 'text-purple-600 bg-purple-100', icon: <Truck size={16} /> },
  DELIVERED: { label: 'Đã giao hàng', color: 'text-green-600 bg-green-100', icon: <CheckCircle size={16} /> },
  COMPLETED: { label: 'Hoàn thành', color: 'text-green-700 bg-green-100', icon: <CheckCircle size={16} /> },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600 bg-red-100', icon: <XCircle size={16} /> }
};

export default function OrdersPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile/orders');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, activeStatus, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam = activeStatus !== 'all' ? `&status=${activeStatus}` : '';
      const response = await fetch(
        `/api/orders?page=${pagination.page}&limit=${pagination.limit}${statusParam}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
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

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-red"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'PREPARING', label: 'Đang chuẩn bị' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  return (
    <div className="bg-gray-50 py-6">
      {/* Breadcrumb */}
      <div className="container-custom mb-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link href="/profile" className="text-gray-500 hover:text-primary">
            Tài khoản
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-primary font-medium">Đơn hàng của tôi</span>
        </nav>
      </div>

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* User Info Header */}
              <div className="bg-gradient-to-r from-primary to-accent-red p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName || 'Avatar'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{user.fullName || 'Người dùng'}</h3>
                    <p className="text-sm opacity-90 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <User size={18} />
                      <span className="text-sm">Thông tin cá nhân</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/orders"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent-red/10 text-accent-red font-medium transition-colors"
                    >
                      <ShoppingBag size={18} />
                      <span className="text-sm">Đơn hàng của tôi</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/wishlist"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <Heart size={18} />
                      <span className="text-sm">Sản phẩm yêu thích</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/addresses"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <MapPin size={18} />
                      <span className="text-sm">Địa chỉ giao hàng</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Đăng xuất</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                  <button
                    onClick={fetchOrders}
                    className="text-sm text-gray-600 hover:text-accent-red flex items-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Làm mới
                  </button>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {statusTabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveStatus(tab.key);
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                        activeStatus === tab.key
                          ? 'bg-accent-red text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-red"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng</h3>
                    <p className="text-gray-600 mb-4">
                      Bạn chưa có đơn hàng nào. Hãy mua sắm để trải nghiệm dịch vụ của chúng tôi!
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const isExpanded = expandedOrders.has(order.id);
                      const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* Order Header */}
                          <div
                            className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleOrderExpand(order.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">
                                      #{order.orderNumber}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                                      {statusInfo.icon}
                                      {statusInfo.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Calendar size={14} />
                                    {formatDate(order.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Tổng tiền</div>
                                  <div className="font-bold text-accent-red">
                                    {formatPrice(Number(order.totalAmount))}
                                  </div>
                                </div>
                                {isExpanded ? (
                                  <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={20} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order Details (Expanded) */}
                          {isExpanded && (
                            <div className="p-4 border-t border-gray-200">
                              {/* Order Items */}
                              <div className="space-y-3 mb-4">
                                {order.orderItems.map(item => (
                                  <div key={item.id} className="flex gap-3">
                                    <Link href={`/products/${item.product.slug}`}>
                                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                          src={item.product.images?.[0] || '/images/placeholder.jpg'}
                                          alt={item.product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                      <Link href={`/products/${item.product.slug}`}>
                                        <h4 className="text-sm font-medium text-gray-900 hover:text-accent-red line-clamp-2">
                                          {item.product.name}
                                        </h4>
                                      </Link>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm text-gray-500">
                                          x{item.quantity}
                                        </span>
                                        <span className="text-sm font-medium text-accent-red">
                                          {formatPrice(Number(item.price) * item.quantity)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Shipping Address */}
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex items-start gap-2">
                                  <MapPin size={16} className="text-gray-500 mt-0.5" />
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                      {order.shippingFullName} - {order.shippingPhone}
                                    </div>
                                    <div className="text-gray-600">
                                      {order.shippingAddress}
                                      {order.shippingWard && `, ${order.shippingWard}`}
                                      {`, ${order.shippingDistrict}, ${order.shippingCity}`}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Note */}
                              {order.note && (
                                <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                                  <div className="flex items-start gap-2">
                                    <FileText size={16} className="text-yellow-600 mt-0.5" />
                                    <div className="text-sm">
                                      <div className="font-medium text-yellow-800">Ghi chú đơn hàng</div>
                                      <div className="text-yellow-700">{order.note}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Tracking Info */}
                              {order.shipping?.trackingCode && (
                                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                  <div className="flex items-start gap-2">
                                    <Truck size={16} className="text-blue-600 mt-0.5" />
                                    <div className="text-sm">
                                      <div className="font-medium text-blue-800">Mã vận đơn</div>
                                      <div className="text-blue-700">
                                        {order.shipping.carrier}: {order.shipping.trackingCode}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <Link
                                  href={`/tra-cuu?order=${order.orderNumber}`}
                                  className="text-sm text-accent-red hover:underline flex items-center gap-1"
                                >
                                  <Eye size={16} />
                                  Xem chi tiết
                                </Link>
                                {order.status === 'PENDING' && (
                                  <button
                                    className="text-sm text-red-600 hover:underline"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                                        try {
                                          const res = await fetch(`/api/orders/${order.id}/cancel`, {
                                            method: 'POST',
                                            credentials: 'include'
                                          });
                                          if (res.ok) {
                                            fetchOrders();
                                          }
                                        } catch (err) {
                                          console.error('Cancel order failed:', err);
                                        }
                                      }
                                    }}
                                  >
                                    Hủy đơn hàng
                                  </button>
                                )}
                                {(order.status === 'DELIVERED' || order.status === 'COMPLETED') && (
                                  <Link
                                    href={`/products/${order.orderItems[0]?.product.slug}#reviews`}
                                    className="text-sm text-green-600 hover:underline"
                                  >
                                    Đánh giá sản phẩm
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`w-10 h-10 rounded-lg font-medium ${
                              pagination.page === page
                                ? 'bg-accent-red text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
