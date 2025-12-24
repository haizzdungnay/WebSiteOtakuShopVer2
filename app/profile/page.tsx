'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Package,
  Heart,
  MapPin,
  ShoppingCart,
  ChevronRight,
  Save,
  X,
  Camera,
  Gift
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        gender: '',
        dateOfBirth: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cập nhật thông tin thành công!');
        setIsEditing(false);
        refreshUser();
      } else {
        setError(data.error || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { href: '/profile', label: 'Thông tin cá nhân', icon: User, active: true },
    { href: '/profile/orders', label: 'Đơn hàng của tôi', icon: Package },
    { href: '/profile/preorders', label: 'Đơn đặt trước & mua hộ', icon: ShoppingCart },
    { href: '/profile/wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
    { href: '/profile/addresses', label: 'Địa chỉ giao hàng', icon: MapPin },
    { href: '/profile/loyalty', label: 'Khách hàng thân thiết', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-primary font-medium">Tài khoản của tôi</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* User Info Header */}
              <div className="bg-gradient-to-r from-primary to-accent-red p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary font-bold text-2xl">
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
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
                      <Camera size={12} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{user.fullName || user.username || 'Người dùng'}</h3>
                    <p className="text-sm opacity-90 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {!item.active && <ChevronRight size={16} className="ml-auto text-gray-400" />}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                    <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Edit2 size={18} />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <X size={18} />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                    <Shield size={18} />
                    {success}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        <Save size={18} />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={18} />
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Họ và tên</p>
                          <p className="font-semibold text-gray-900">{user.fullName || 'Chưa cập nhật'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold text-gray-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-semibold text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Shield size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loại tài khoản</p>
                          <p className="font-semibold text-gray-900">
                            {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Truy cập nhanh</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                          href="/profile/orders"
                          className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors group"
                        >
                          <Package size={32} className="text-gray-400 group-hover:text-primary" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Đơn hàng</span>
                        </Link>
                        <Link
                          href="/profile/wishlist"
                          className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors group"
                        >
                          <Heart size={32} className="text-gray-400 group-hover:text-primary" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Yêu thích</span>
                        </Link>
                        <Link
                          href="/profile/addresses"
                          className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors group"
                        >
                          <MapPin size={32} className="text-gray-400 group-hover:text-primary" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Địa chỉ</span>
                        </Link>
                        <Link
                          href="/profile/loyalty"
                          className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors group"
                        >
                          <Gift size={32} className="text-gray-400 group-hover:text-primary" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Thân thiết</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
