'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Award, Package, ShoppingBag, MapPin, Search, Calendar, TruckIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  products: { name: string; quantity: number; image: string }[];
  totalPrice: number;
  shippingStatus: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '15/03/2024',
      products: [
        { name: 'Nendoroid Hatsune Miku', quantity: 1, image: '/images/products/product-1.jpg' },
      ],
      totalPrice: 1200000,
      shippingStatus: 'delivered',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '10/03/2024',
      products: [
        { name: 'figma Asuna', quantity: 1, image: '/images/products/product-2.jpg' },
        { name: 'Scale Figure Rem', quantity: 1, image: '/images/products/product-3.jpg' },
      ],
      totalPrice: 3500000,
      shippingStatus: 'shipping',
      paymentStatus: 'paid',
    },
  ];

  const sidebarItems = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { id: 'loyalty', icon: Award, label: 'Khách hàng thân thiết' },
    { id: 'orders', icon: Package, label: 'Đơn thông thường' },
    { id: 'preorders', icon: ShoppingBag, label: 'Đơn đặt trước & mua hộ' },
    { id: 'addresses', icon: MapPin, label: 'Địa chỉ giao hàng' },
  ];

  const shippingStatusLabels = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  };

  const paymentStatusLabels = {
    pending: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.shippingStatus === statusFilter;
    return matchesSearch && matchesStatus;
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
                      <img 
                        src={user.avatar} 
                        alt={user.username || 'User'} 
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
                        placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Không tìm thấy đơn hàng
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                        : 'Bạn chưa có đơn hàng nào'}
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Calendar size={14} />
                                <span>{order.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-accent-red">
                              {formatPrice(order.totalPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="mb-4 space-y-2">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0"></div>
                              <span className="text-gray-700">
                                {product.name} x{product.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <TruckIcon size={16} className="text-gray-400" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                shippingStatusLabels[order.shippingStatus].color
                              }`}
                            >
                              {shippingStatusLabels[order.shippingStatus].label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-gray-400" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentStatusLabels[order.paymentStatus].color
                              }`}
                            >
                              {paymentStatusLabels[order.paymentStatus].label}
                            </span>
                          </div>
                          <Link
                            href={`/orders/${order.id}`}
                            className="ml-auto text-accent-red font-semibold text-sm hover:underline"
                          >
                            Xem chi tiết →
                          </Link>
                        </div>
                      </div>
                    ))}
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
      </div>
    </div>
  );
}
