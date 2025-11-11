'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Gift, Package, MapPin, ShoppingCart, Search } from 'lucide-react';

interface PreOrder {
  id: string;
  createdAt: string;
  product: string;
  price: number;
  shippingStatus: string;
  processingStatus: string;
  image: string;
}

const mockPreOrders: PreOrder[] = [
  // Empty for demo - showing empty state
];

type TabType = 'date' | 'product' | 'price' | 'shipping' | 'processing';

export default function PreOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('date');
  const [filterStatus, setFilterStatus] = useState('all');

  // Redirect if not logged in
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchQuery);
  };

  const filteredOrders = mockPreOrders.filter((order) => {
    // Apply filters
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-accent-red">
              Trang chủ
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Tài khoản</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user.username?.[0]?.toUpperCase() || 'TD'}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg truncate">{user.username || 'Đinh Tuấn Dương'}</h2>
                  <p className="text-sm text-gray-600 truncate">{user.email || 'tuanduongdinh0602@gmail.com'}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <User size={20} className="text-gray-400" />
                  <span className="font-medium">Thông tin cá nhân</span>
                </Link>
                <Link
                  href="/profile/loyalty"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Gift size={20} className="text-gray-400" />
                  <span className="font-medium">Khách hàng thân thiết</span>
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Package size={20} className="text-gray-400" />
                  <span className="font-medium">Đơn thông thường</span>
                </Link>
                <Link
                  href="/profile/preorders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent-red text-white"
                >
                  <ShoppingCart size={20} />
                  <span className="font-medium">Đơn đặt trước & mua hộ</span>
                </Link>
                <Link
                  href="/profile/addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <MapPin size={20} className="text-gray-400" />
                  <span className="font-medium">Địa chỉ giao hàng</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Đơn đặt trước & mua hộ</h1>

              {/* Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Không thấy đơn hàng mới? Vui lòng liên hệ admin.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm sản phẩm, trạng thái..."
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Tất cả trạng thái
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-accent-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Làm mới
                  </button>
                </div>
              </form>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('date')}
                    className={`pb-3 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === 'date'
                        ? 'border-accent-red text-accent-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Ngày tạo
                  </button>
                  <button
                    onClick={() => setActiveTab('product')}
                    className={`pb-3 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === 'product'
                        ? 'border-accent-red text-accent-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sản phẩm
                  </button>
                  <button
                    onClick={() => setActiveTab('price')}
                    className={`pb-3 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === 'price'
                        ? 'border-accent-red text-accent-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Giá chưa phụ phí
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-3 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === 'shipping'
                        ? 'border-accent-red text-accent-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Trạng thái vận chuyển
                  </button>
                  <button
                    onClick={() => setActiveTab('processing')}
                    className={`pb-3 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === 'processing'
                        ? 'border-accent-red text-accent-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Trạng thái xử lý
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng phù hợp bộ lọc.</h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có <span className="font-semibold">0</span> đơn hàng trong 365 ngày gần đây.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Bắt đầu mua sắm
                  </Link>
                </div>
              ) : (
                /* Orders List */
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{order.product}</h3>
                          <p className="text-sm text-gray-600 mb-2">Đơn hàng: #{order.id}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Ngày tạo:</span>{' '}
                              <span className="font-medium">{order.createdAt}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Giá:</span>{' '}
                              <span className="font-medium text-accent-red">
                                {order.price.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Vận chuyển:</span>{' '}
                              <span className="font-medium">{order.shippingStatus}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Xử lý:</span>{' '}
                              <span className="font-medium">{order.processingStatus}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Link
                            href={`/profile/preorders/${order.id}`}
                            className="px-6 py-2 border border-accent-red text-accent-red rounded-lg font-semibold hover:bg-accent-red hover:text-white transition-colors"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
