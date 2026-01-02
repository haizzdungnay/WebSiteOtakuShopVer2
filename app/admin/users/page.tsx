'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Coins,
  Star,
  ArrowLeft,
  Loader2,
  Shield,
  UserCheck,
  X,
  RefreshCw,
  AlertCircle,
  Trash2,
  ShieldCheck,
  ShieldOff
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  role: string;
  emailVerified: boolean;
  otpCode?: string;
  otpExpires?: string;
  createdAt: string;
  updatedAt: string;
  totalSpent: number;
  latestOrder?: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
  };
  _count: {
    orders: number;
    reviews: number;
    wishlists: number;
  };
}

interface UserDetail {
  user: User & {
    addresses: Array<{
      id: string;
      label: string;
      fullName: string;
      phone: string;
      address: string;
      ward?: string;
      district: string;
      city: string;
      isDefault: boolean;
    }>;
  };
  statistics: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    totalReviews: number;
    reviewsByRating: Record<number, number>;
    totalWishlists: number;
    totalAddresses: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const csrfToken = Cookies.get('csrf-token') || '';

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // User detail modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Delete user state
  const [deleting, setDeleting] = useState<string | null>(null);

  // Role change state
  const [canPromoteUsers, setCanPromoteUsers] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  // Check admin access (allow both ADMIN and STAFF)
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (verifiedFilter) params.set('verified', verifiedFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data?.users || []);
        const pagination = data.data?.pagination;
        if (pagination) {
          setTotal(pagination.total || 0);
          setTotalPages(pagination.totalPages || 1);
        }
        // Lấy thông tin quyền cấp quyền cho admin hiện tại
        if (data.data?.currentAdmin) {
          setCanPromoteUsers(data.data.currentAdmin.canPromoteUsers || false);
        }
      } else {
        setError('Không thể tải danh sách người dùng');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      fetchUsers();
    }
  }, [page, roleFilter, verifiedFilter, user]);

  // Fetch user detail
  const fetchUserDetail = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.data);
        setShowUserModal(true);
      }
    } catch (err) {
      console.error('Error fetching user detail:', err);
      showToast('error', 'Không thể tải thông tin người dùng');
    }
  };

  // Verify user manually
  const verifyUser = async (userId: string) => {
    try {
      setVerifying(true);
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', data.message || 'Xác minh thành công');
        fetchUsers();
        if (selectedUser) {
          fetchUserDetail(userId);
        }
      } else {
        showToast('error', data.error || 'Xác minh thất bại');
      }
    } catch (err) {
      console.error('Error verifying user:', err);
      showToast('error', 'Lỗi khi xác minh');
    } finally {
      setVerifying(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: string, userName: string) => {
    // Prevent deleting self
    if (userId === user?.id) {
      showToast('error', 'Không thể xóa chính tài khoản của bạn');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan (đơn hàng, đánh giá, địa chỉ, giỏ hàng, wishlist) và không thể hoàn tác.`)) {
      return;
    }

    try {
      setDeleting(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', data.message || 'Xóa người dùng thành công');
        fetchUsers();
        if (showUserModal && selectedUser?.user?.id === userId) {
          setShowUserModal(false);
          setSelectedUser(null);
        }
      } else {
        showToast('error', data.error || 'Không thể xóa người dùng');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast('error', 'Lỗi khi xóa người dùng');
    } finally {
      setDeleting(null);
    }
  };

  // Change user role (promote to STAFF or demote to CUSTOMER)
  const changeUserRole = async (userId: string, userName: string, newRole: 'STAFF' | 'CUSTOMER') => {
    const action = newRole === 'STAFF' ? 'cấp quyền Nhân viên cho' : 'thu hồi quyền Nhân viên của';

    if (!confirm(`Bạn có chắc chắn muốn ${action} "${userName}"?`)) {
      return;
    }

    try {
      setChangingRole(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', data.message || `Đã ${action} thành công`);
        fetchUsers();
        if (showUserModal && selectedUser?.user?.id === userId) {
          fetchUserDetail(userId);
        }
      } else {
        showToast('error', data.error || `Không thể ${action}`);
      }
    } catch (err) {
      console.error('Error changing user role:', err);
      showToast('error', 'Lỗi khi thay đổi quyền');
    } finally {
      setChangingRole(null);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPING: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại trang quản trị
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Quản lý tài khoản</h1>
              <p className="text-slate-600 mt-1">Xem và quản lý tất cả tài khoản (Khách hàng, Nhân viên, Admin)</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchUsers()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Làm mới
              </button>
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-sm text-slate-500">Tổng số:</span>
                <span className="ml-2 font-bold text-slate-900">{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm theo email, tên, số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Tất cả vai trò</option>
              <option value="CUSTOMER">Khách hàng</option>
              <option value="STAFF">Nhân viên</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>

            {/* Verified Filter */}
            <select
              value={verifiedFilter}
              onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đã xác minh</option>
              <option value="false">Chưa xác minh</option>
            </select>

            {/* Search Button */}
            <button
              onClick={() => { setPage(1); fetchUsers(); }}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Không tìm thấy người dùng nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Khách hàng</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Liên hệ</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Đơn hàng</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Chi tiêu</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Ngày tạo</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.fullName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {u.fullName?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{u.fullName}</p>
                            <p className="text-sm text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{u.phone || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {u.emailVerified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle size={14} />
                              Đã xác minh
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              <AlertCircle size={14} />
                              Chưa xác minh
                            </span>
                          )}
                          {u.role === 'ADMIN' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Shield size={12} />
                              Admin gốc
                            </span>
                          )}
                          {u.role === 'STAFF' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <ShieldCheck size={12} />
                              Nhân viên
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-900">{u._count?.orders || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-900">{formatCurrency(Number(u.totalSpent) || 0)}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => fetchUserDetail(u.id)}
                            className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {!u.emailVerified && (
                            <button
                              onClick={() => verifyUser(u.id)}
                              disabled={verifying}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                              title="Xác minh thủ công"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                          {/* Promote/Demote button - only show for original admin */}
                          {canPromoteUsers && u.id !== user?.id && u.role !== 'ADMIN' && (
                            <>
                              {u.role === 'CUSTOMER' ? (
                                <button
                                  onClick={() => changeUserRole(u.id, u.fullName, 'STAFF')}
                                  disabled={changingRole === u.id}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Cấp quyền Nhân viên"
                                >
                                  {changingRole === u.id ? (
                                    <Loader2 size={18} className="animate-spin" />
                                  ) : (
                                    <ShieldCheck size={18} />
                                  )}
                                </button>
                              ) : u.role === 'STAFF' && (
                                <button
                                  onClick={() => changeUserRole(u.id, u.fullName, 'CUSTOMER')}
                                  disabled={changingRole === u.id}
                                  className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Thu hồi quyền Nhân viên"
                                >
                                  {changingRole === u.id ? (
                                    <Loader2 size={18} className="animate-spin" />
                                  ) : (
                                    <ShieldOff size={18} />
                                  )}
                                </button>
                              )}
                            </>
                          )}
                          {/* Delete button - only show if not current admin */}
                          {u.id !== user?.id && (
                            <button
                              onClick={() => deleteUser(u.id, u.fullName)}
                              disabled={deleting === u.id}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Xóa người dùng"
                            >
                              {deleting === u.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Hiển thị {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} trong {total} người dùng
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Chi tiết tài khoản</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-6">
                {selectedUser.user.avatar ? (
                  <img
                    src={selectedUser.user.avatar}
                    alt={selectedUser.user.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">
                      {selectedUser.user.fullName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedUser.user.fullName}</h3>
                    {selectedUser.user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={14} />
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <AlertCircle size={14} />
                        Chưa xác minh
                      </span>
                    )}
                    {selectedUser.user.role === 'ADMIN' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Shield size={12} />
                        Admin gốc
                      </span>
                    )}
                    {selectedUser.user.role === 'STAFF' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <ShieldCheck size={12} />
                        Nhân viên
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Mail size={16} />
                      {selectedUser.user.email}
                    </span>
                    {selectedUser.user.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={16} />
                        {selectedUser.user.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Tham gia: {formatDate(selectedUser.user.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Verify Button */}
                {!selectedUser.user.emailVerified && (
                  <button
                    onClick={() => verifyUser(selectedUser.user.id)}
                    disabled={verifying}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifying ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                    Xác minh thủ công
                  </button>
                )}
              </div>

              {/* OTP Info (for unverified users) */}
              {!selectedUser.user.emailVerified && selectedUser.user.otpCode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Thông tin xác minh
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-amber-700">Mã OTP:</span>
                      <span className="ml-2 font-mono font-bold text-amber-900 text-lg">
                        {selectedUser.user.otpCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-amber-700">Hết hạn:</span>
                      <span className="ml-2 text-amber-900">
                        {selectedUser.user.otpExpires
                          ? formatDate(selectedUser.user.otpExpires)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <ShoppingBag className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{selectedUser.statistics.totalOrders}</p>
                  <p className="text-sm text-slate-500">Tổng đơn hàng</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{selectedUser.statistics.completedOrders}</p>
                  <p className="text-sm text-slate-500">Hoàn thành</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Coins className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(Number(selectedUser.statistics.totalSpent) || 0)}
                  </p>
                  <p className="text-sm text-slate-500">Tổng chi tiêu</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{selectedUser.statistics.totalReviews}</p>
                  <p className="text-sm text-slate-500">Đánh giá</p>
                </div>
              </div>

              {/* Recent Orders */}
              {selectedUser.recentOrders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Đơn hàng gần đây</h4>
                  <div className="bg-slate-50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Mã đơn</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Ngày đặt</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-600">Tổng tiền</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-slate-600">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedUser.recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 font-medium text-slate-900">{order.orderNumber}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{formatDate(order.createdAt)}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900">
                              {formatCurrency(Number(order.totalAmount))}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {selectedUser.user.addresses && selectedUser.user.addresses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Địa chỉ đã lưu</h4>
                  <div className="grid gap-3">
                    {selectedUser.user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`bg-slate-50 rounded-xl p-4 ${address.isDefault ? 'ring-2 ring-primary' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-900">{address.label}</span>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {address.fullName} - {address.phone}
                        </p>
                        <p className="text-sm text-slate-600">
                          {address.address}, {address.ward && `${address.ward}, `}
                          {address.district}, {address.city}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
