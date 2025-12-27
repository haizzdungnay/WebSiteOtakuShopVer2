'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  FileText,
  User,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  shipping: {
    recipientName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    carrier: string | null;
    trackingCode: string | null;
    status: string;
  } | null;
  payment: {
    method: string;
    status: string;
  } | null;
  items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'PENDING': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
  'CONFIRMED': { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={16} /> },
  'PREPARING': { label: 'Đang chuẩn bị', color: 'bg-indigo-100 text-indigo-800', icon: <Package size={16} /> },
  'SHIPPING': { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: <Truck size={16} /> },
  'DELIVERED': { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <XCircle size={16} /> },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/admin/orders?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Làm mới"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã đơn, tên khách hàng, email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="PREPARING">Đang chuẩn bị</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-red"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-semibold text-accent-red">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[order.status]?.color}`}>
                          {statusMap[order.status]?.icon}
                          {statusMap[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {order.note ? (
                          <div className="max-w-xs">
                            <div className="flex items-start gap-1 text-sm text-gray-600">
                              <FileText size={14} className="flex-shrink-0 mt-0.5 text-orange-500" />
                              <span className="line-clamp-2">{order.note}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Chi tiết đơn hàng
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Status Update */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật trạng thái
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent disabled:opacity-50"
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PREPARING">Đang chuẩn bị</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>

              {/* Customer Note */}
              {selectedOrder.note && (
                <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FileText size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-1">Ghi chú từ khách hàng</h4>
                      <p className="text-orange-700">{selectedOrder.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} />
                  Thông tin khách hàng
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-500">Tên:</span> {selectedOrder.user.fullName}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedOrder.user.email}</p>
                  {selectedOrder.user.phone && (
                    <p><span className="text-gray-500">SĐT:</span> {selectedOrder.user.phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              {selectedOrder.shipping && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Địa chỉ giao hàng
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="text-gray-500">Người nhận:</span> {selectedOrder.shipping.recipientName}</p>
                    <p className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      {selectedOrder.shipping.phone}
                    </p>
                    <p>
                      {selectedOrder.shipping.address}, {selectedOrder.shipping.ward}, {selectedOrder.shipping.district}, {selectedOrder.shipping.province}
                    </p>
                    {selectedOrder.shipping.trackingCode && (
                      <p className="mt-2">
                        <span className="text-gray-500">Mã vận đơn:</span>{' '}
                        <span className="font-mono">{selectedOrder.shipping.trackingCode}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {selectedOrder.payment && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard size={18} />
                    Thanh toán
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>
                      <span className="text-gray-500">Phương thức:</span>{' '}
                      {selectedOrder.payment.method === 'COD' ? 'Thanh toán khi nhận hàng' : selectedOrder.payment.method}
                    </p>
                    <p>
                      <span className="text-gray-500">Trạng thái:</span>{' '}
                      <span className={selectedOrder.payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                        {selectedOrder.payment.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} />
                  Sản phẩm ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-gray-50 rounded-lg p-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-500">x{item.quantity}</span>
                          <span className="font-semibold text-accent-red">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-accent-red">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} />
                <span>Đặt hàng: {formatDate(selectedOrder.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>Cập nhật: {formatDate(selectedOrder.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
