'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import {
  useAdminProducts,
  useAdminOrders,
  useAdminReviews,
  useAdminCategories,
  useAdminAnnouncements,
  Product,
  Order,
  Review,
  Category,
  Announcement,
  CreateProductData,
} from '@/hooks/useAdminApi';
import {
  BarChart3,
  Coins,
  Edit,
  FilePlus,
  FolderPlus,
  Image,
  ListChecks,
  Loader2,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  featured: boolean;
  categoryId: string;
  category?: { name: string };
  reviewCount: number;
  averageRating: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: { name: string };
  }>;
}

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  user: { fullName: string; email: string };
  product: { name: string };
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: Order[];
}

interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  stockQuantity: string;
  categoryId: string;
  images: string[];
  isActive: boolean;
  featured: boolean;
}

const initialProductForm: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  comparePrice: '',
  stockQuantity: '',
  categoryId: '',
  images: [],
  isActive: true,
  featured: false,
};

export default function AdminPage() {
  const { user } = useAuth();
  const token = Cookies.get('token');

  // States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'reviews'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Form states
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // API Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        headers: getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchReviews(),
      ]);
      setLoading(false);
    };
    if (token) {
      loadData();
    }
  }, [token]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle Add/Edit Product
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const productData = {
      name: productForm.name,
      slug: productForm.slug || generateSlug(productForm.name),
      description: productForm.description,
      price: parseFloat(productForm.price),
      comparePrice: productForm.comparePrice ? parseFloat(productForm.comparePrice) : null,
      stockQuantity: parseInt(productForm.stockQuantity),
      categoryId: productForm.categoryId,
      images: productForm.images,
      isActive: productForm.isActive,
      featured: productForm.featured,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        setShowProductModal(false);
        setProductForm(initialProductForm);
        setEditingProduct(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Handle Edit Product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.categoryId,
      images: product.images || [],
      isActive: product.isActive,
      featured: product.featured,
    });
    setShowProductModal(true);
  };

  // Handle Order Status Update
  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchOrders();
        await fetchDashboardStats();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Handle Review Approve/Delete
  const handleReviewAction = async (reviewId: string, action: 'approve' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
        await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
      } else {
        await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ isApproved: true }),
        });
      }
      await fetchReviews();
    } catch (err) {
      console.error('Error handling review:', err);
    }
  };

  // Add image to product
  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setProductForm({
        ...productForm,
        images: [...productForm.images, imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  // Remove image from product
  const handleRemoveImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    });
  };

  // Calculate pending orders
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'PENDING'),
    [orders]
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-600',
      CONFIRMED: 'bg-blue-50 text-blue-600',
      PREPARING: 'bg-purple-50 text-purple-600',
      SHIPPING: 'bg-indigo-50 text-indigo-600',
      DELIVERED: 'bg-emerald-50 text-emerald-600',
      COMPLETED: 'bg-green-50 text-green-600',
      CANCELLED: 'bg-rose-50 text-rose-600',
    };
    return colors[status] || 'bg-slate-50 text-slate-600';
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      CONFIRMED: 'Đã xác nhận',
      PREPARING: 'Đang chuẩn bị',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Đã giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return labels[status] || status;
  };

  // Auth check
  if (!user || user.role !== 'admin') {
    return (
      <section className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center bg-white shadow-lg rounded-3xl p-10 border border-slate-100">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">Khong co quyen truy cap</h1>
          <p className="text-slate-600 mb-6">
            Khu vuc nay chi danh cho quan tri vien. Vui long dang nhap bang tai khoan quan tri de truy cap.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
          >
            Dang nhap
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-600" />
          <p className="mt-4 text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom space-y-10">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Admin workspace</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Xin chào, {user.username || user.fullName}</h1>
              <p className="text-slate-300 mt-2">
                Quản trị đơn hàng, sản phẩm và nội dung chỉ trong một bảng điều khiển.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-sm text-slate-300">Sản phẩm</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                <p className="text-sm text-slate-300">Don cho duyet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
            { id: 'products', label: 'Sản phẩm', icon: FolderPlus },
            { id: 'orders', label: 'Đơn hàng', icon: PackageCheck },
            { id: 'reviews', label: 'Đánh giá', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Tổng doanh thu</p>
                  <Coins className="text-amber-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Tổng đơn hàng</p>
                  <ListChecks className="text-blue-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{stats?.totalOrders || 0}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                  <Users className="text-purple-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{stats?.totalCustomers || 0}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Đơn chờ xử lý</p>
                  <PackageCheck className="text-rose-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{stats?.pendingOrders || 0}</p>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Làm mới
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      slug: '',
                      description: '',
                      price: '',
                      comparePrice: '',
                      stockQuantity: '',
                      categoryId: '',
                      images: [],
                      isActive: true,
                      featured: false,
                    });
                    setShowProductModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <FilePlus size={16} />
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-600">San pham</th>
                      <th className="text-left p-4 font-medium text-slate-600">Danh muc</th>
                      <th className="text-right p-4 font-medium text-slate-600">Gia</th>
                      <th className="text-center p-4 font-medium text-slate-600">Ton kho</th>
                      <th className="text-center p-4 font-medium text-slate-600">Trang thai</th>
                      <th className="text-center p-4 font-medium text-slate-600">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.images[0] && (
                              <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{product.name}</p>
                              <p className="text-sm text-slate-500">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{product.category?.name}</td>
                        <td className="p-4 text-right">
                          <p className="font-medium text-slate-900">{Number(product.price).toLocaleString('vi-VN')}d</p>
                          {product.comparePrice && (
                            <p className="text-sm text-slate-400 line-through">
                              {Number(product.comparePrice).toLocaleString('vi-VN')}d
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stockQuantity === 0
                              ? 'bg-rose-100 text-rose-600'
                              : product.stockQuantity <= 10
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleProductStatus(product)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {product.isActive ? 'Dang ban' : 'An'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                              title="Chinh sua"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-lg hover:bg-rose-100 text-rose-600"
                              title="Xoa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  {productsLoading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chua co san pham nao'
                  )}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <h2 className="text-xl font-semibold mb-6">Đơn hàng gần đây</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4">Mã đơn</th>
                      <th className="text-left py-3 px-4">Khách hàng</th>
                      <th className="text-left py-3 px-4">Tổng tiền</th>
                      <th className="text-left py-3 px-4">Trạng thái</th>
                      <th className="text-left py-3 px-4">Ngày đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-slate-50">
                        <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">{formatCurrency(Number(order.totalAmount))}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  {ordersLoading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chua co don hang nao'
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quản lý sản phẩm ({products.length})</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm(initialProductForm);
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800"
              >
                <FilePlus size={18} />
                Thêm sản phẩm
              </button>
            </div>

            {/* Products List */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4">Hình ảnh</th>
                      <th className="text-left py-3 px-4">Tên sản phẩm</th>
                      <th className="text-left py-3 px-4">Danh mục</th>
                      <th className="text-left py-3 px-4">Giá</th>
                      <th className="text-left py-3 px-4">Tồn kho</th>
                      <th className="text-left py-3 px-4">Trạng thái</th>
                      <th className="text-left py-3 px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-50">
                        <td className="py-3 px-4">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Image size={20} className="text-slate-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.slug}</p>
                        </td>
                        <td className="py-3 px-4">{product.category?.name || '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(Number(product.price))}</td>
                        <td className="py-3 px-4">{product.stockQuantity}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {product.isActive ? 'Đang bán' : 'Tạm ẩn'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">Quản lý đơn hàng ({orders.length})</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-100 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">#{order.orderNumber}</p>
                      <p className="text-lg font-semibold text-slate-900">{order.customerName}</p>
                      <p className="text-sm text-slate-500">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-sm text-slate-500">{order.customerEmail}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Tổng tiền</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(Number(order.totalAmount))}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm font-medium text-slate-700 mb-2">Sản phẩm:</p>
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.product?.name || 'Sản phẩm'} x{item.quantity}</span>
                        <span>{formatCurrency(Number(item.price))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {order.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'CONFIRMED')}
                            className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold hover:bg-emerald-100"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'CANCELLED')}
                            className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100"
                          >
                            Hủy đơn
                          </button>
                        </>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                          className="px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold hover:bg-purple-100"
                        >
                          Chuẩn bị hàng
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'SHIPPING')}
                          className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100"
                        >
                          Giao hàng
                        </button>
                      )}
                      {order.status === 'SHIPPING' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')}
                          className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold hover:bg-emerald-100"
                        >
                          Đã giao
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'COMPLETED')}
                          className="px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-slate-500 py-8">Chưa có đơn hàng nào</p>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">Quản lý đánh giá ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-100 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= review.rating ? 'text-amber-400' : 'text-slate-200'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          review.isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900">{review.user?.fullName}</p>
                      <p className="text-sm text-slate-500">{review.user?.email}</p>
                      <p className="text-sm text-blue-600 mt-1">Sản phẩm: {review.product?.name}</p>
                    </div>
                    <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                  </div>
                  {review.title && (
                    <p className="mt-3 font-medium text-slate-900">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="mt-2 text-slate-600">{review.comment}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleReviewAction(review.id, 'approve')}
                        className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold hover:bg-emerald-100"
                      >
                        Duyệt
                      </button>
                    )}
                    <button
                      onClick={() => handleReviewAction(review.id, 'delete')}
                      className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-center text-slate-500 py-8">Chưa có đánh giá nào</p>
              )}
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tên sản phẩm *
                    </label>
                    <input
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })}
                      className="input-field"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Slug (URL)
                    </label>
                    <input
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="input-field"
                      placeholder="tu-dong-tao-tu-ten"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mô tả *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="input-field"
                      placeholder="Mô tả chi tiết sản phẩm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Giá bán *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Giá gốc (nếu có)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.comparePrice}
                      onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Số lượng tồn kho *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Danh mục *
                    </label>
                    <select
                      required
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Images */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Hình ảnh
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input-field flex-1"
                        placeholder="Nhập URL hình ảnh"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                      >
                        Thêm
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {productForm.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status toggles */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-700">Đang bán</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm text-slate-700">Sản phẩm nổi bật</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
