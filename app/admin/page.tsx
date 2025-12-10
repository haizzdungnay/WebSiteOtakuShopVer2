'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  FilePlus,
  FolderPlus,
  ListChecks,
  LockKeyhole,
  PackageCheck,
  ShieldAlert,
  Users,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Pin,
  Check,
  X,
  Loader2,
  Plus,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'dashboard' | 'products' | 'orders' | 'reviews' | 'announcements';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  categoryId: string;
  images: string[];
  isActive: boolean;
  featured: boolean;
}

interface AnnouncementFormState {
  title: string;
  summary: string;
  content: string;
  isActive: boolean;
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; nextStatus?: string[] }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-600', nextStatus: ['CONFIRMED', 'CANCELLED'] },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600', nextStatus: ['PREPARING', 'CANCELLED'] },
  PREPARING: { label: 'Đang chuẩn bị', color: 'bg-indigo-50 text-indigo-600', nextStatus: ['SHIPPING'] },
  SHIPPING: { label: 'Đang giao', color: 'bg-purple-50 text-purple-600', nextStatus: ['DELIVERED'] },
  DELIVERED: { label: 'Đã giao', color: 'bg-teal-50 text-teal-600', nextStatus: ['COMPLETED'] },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-600' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-rose-50 text-rose-600' },
};

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Products state
  const { getProducts, createProduct, updateProduct, deleteProduct, loading: productsLoading } = useAdminProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsSummary, setProductsSummary] = useState({ total: 0, active: 0, inactive: 0, outOfStock: 0, lowStock: 0 });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    categoryId: '',
    images: [],
    isActive: true,
    featured: false,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  // Orders state
  const { getOrders, updateOrderStatus, loading: ordersLoading } = useAdminOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersSummary, setOrdersSummary] = useState({ total: 0, totalRevenue: 0, byStatus: {} as Record<string, number> });

  // Reviews state
  const { getReviews, updateReview, deleteReview, loading: reviewsLoading } = useAdminReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsSummary, setReviewsSummary] = useState({ total: 0, pending: 0, approved: 0, pinned: 0 });

  // Categories state
  const { getCategories } = useAdminCategories();
  const [categories, setCategories] = useState<Category[]>([]);

  // Announcements state
  const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, loading: announcementsLoading } = useAdminAnnouncements();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementFormState>({
    title: '',
    summary: '',
    content: '',
    isActive: true,
  });

  // Shipping modal for order status
  const [shippingModal, setShippingModal] = useState<{ orderId: string; status: string } | null>(null);
  const [shippingInfo, setShippingInfo] = useState({ trackingCode: '', carrier: '' });

  // Load initial data
  useEffect(() => {
    if (user?.role === 'admin') {
      loadCategories();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
        case 'products':
          loadProducts();
          break;
        case 'orders':
          loadOrders();
          break;
        case 'reviews':
          loadReviews();
          break;
        case 'announcements':
          loadAnnouncements();
          break;
      }
    }
  }, [activeTab, user]);

  const loadCategories = async () => {
    const result = await getCategories({ limit: 100 });
    if (result.success && result.data) {
      setCategories(result.data.categories);
    }
  };

  const loadProducts = async () => {
    const result = await getProducts({ limit: 50 });
    if (result.success && result.data) {
      setProducts(result.data.products);
      setProductsSummary(result.data.summary);
    }
  };

  const loadOrders = async () => {
    const result = await getOrders({ limit: 50 });
    if (result.success && result.data) {
      setOrders(result.data.orders);
      setOrdersSummary(result.data.summary);
    }
  };

  const loadReviews = async () => {
    const result = await getReviews({ limit: 50 });
    if (result.success && result.data) {
      setReviews(result.data.reviews);
      setReviewsSummary(result.data.summary);
    }
  };

  const loadAnnouncements = async () => {
    const result = await getAnnouncements({ limit: 50 });
    if (result.success && result.data) {
      setAnnouncements(result.data.announcements);
    }
  };

  // Product handlers
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      stock: '',
      categoryId: '',
      images: [],
      isActive: true,
      featured: false,
    });
    setNewImageUrl('');
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      stock: String(product.stockQuantity),
      categoryId: product.categoryId,
      images: product.images,
      isActive: product.isActive,
      featured: product.featured,
    });
    setShowProductForm(true);
  };

  const handleAddImage = () => {
    if (newImageUrl && newImageUrl.startsWith('http')) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const productData: CreateProductData = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : null,
      categoryId: productForm.categoryId,
      stockQuantity: Number(productForm.stock),
      images: productForm.images,
      isActive: productForm.isActive,
      featured: productForm.featured,
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result.success) {
      setShowProductForm(false);
      resetProductForm();
      loadProducts();
    } else {
      alert(result.error || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    const result = await deleteProduct(id);
    if (result.success) {
      loadProducts();
    } else {
      alert(result.error || 'Không thể xóa sản phẩm');
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    const result = await updateProduct(product.id, { isActive: !product.isActive });
    if (result.success) {
      loadProducts();
    }
  };

  // Order handlers
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === 'SHIPPING') {
      setShippingModal({ orderId, status: newStatus });
      return;
    }

    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      loadOrders();
    } else {
      alert(result.error || 'Không thể cập nhật trạng thái');
    }
  };

  const handleShippingSubmit = async () => {
    if (!shippingModal) return;
    if (!shippingInfo.trackingCode || !shippingInfo.carrier) {
      alert('Vui lòng nhập đầy đủ mã vận đơn và đơn vị vận chuyển');
      return;
    }

    const result = await updateOrderStatus(shippingModal.orderId, shippingModal.status, {
      trackingCode: shippingInfo.trackingCode,
      carrier: shippingInfo.carrier,
    });

    if (result.success) {
      setShippingModal(null);
      setShippingInfo({ trackingCode: '', carrier: '' });
      loadOrders();
    } else {
      alert(result.error || 'Không thể cập nhật trạng thái');
    }
  };

  // Review handlers
  const handleToggleReviewApproval = async (review: Review) => {
    const result = await updateReview(review.id, { isApproved: !review.isApproved });
    if (result.success) {
      loadReviews();
    }
  };

  const handleToggleReviewPin = async (review: Review) => {
    const result = await updateReview(review.id, { isPinned: !review.isPinned });
    if (result.success) {
      loadReviews();
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    const result = await deleteReview(id);
    if (result.success) {
      loadReviews();
    } else {
      alert(result.error || 'Không thể xóa đánh giá');
    }
  };

  // Announcement handlers
  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      summary: '',
      content: '',
      isActive: true,
    });
  };

  const handleAnnouncementSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await createAnnouncement({
      title: announcementForm.title,
      summary: announcementForm.summary,
      content: announcementForm.content || undefined,
      isActive: announcementForm.isActive,
    });

    if (result.success) {
      setShowAnnouncementForm(false);
      resetAnnouncementForm();
      loadAnnouncements();
    } else {
      alert(result.error || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
    const result = await deleteAnnouncement(id);
    if (result.success) {
      loadAnnouncements();
    } else {
      alert(result.error || 'Không thể xóa thông báo');
    }
  };

  const handleToggleAnnouncementStatus = async (announcement: Announcement) => {
    const result = await updateAnnouncement(announcement.id, { isActive: !announcement.isActive });
    if (result.success) {
      loadAnnouncements();
    }
  };

  // Access denied screen
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

  const pendingOrdersCount = ordersSummary.byStatus?.PENDING || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Admin workspace</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Xin chao, {user.username}</h1>
              <p className="text-slate-300 mt-2">
                Quan tri don hang, doanh thu va noi dung chi trong mot bang dieu khien.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{productsSummary.total}</div>
                <p className="text-sm text-slate-300">San pham</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                <p className="text-sm text-slate-300">Don cho duyet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'dashboard', label: 'Tong quan', icon: BarChart3 },
            { id: 'products', label: 'San pham', icon: FolderPlus },
            { id: 'orders', label: 'Don hang', icon: PackageCheck },
            { id: 'reviews', label: 'Danh gia', icon: MessageSquare },
            { id: 'announcements', label: 'Thong bao', icon: FilePlus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg'
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
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Tong doanh thu</p>
                  <Coins className="text-amber-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {ordersSummary.totalRevenue?.toLocaleString('vi-VN') || 0}d
                </p>
                <p className="text-xs text-emerald-500 mt-1">Tu don da giao & hoan thanh</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Don cho duyet</p>
                  <ListChecks className="text-blue-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{pendingOrdersCount}</p>
                <p className="text-xs text-slate-500 mt-1">Can xu ly</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">San pham het hang</p>
                  <PackageCheck className="text-rose-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{productsSummary.outOfStock}</p>
                <p className="text-xs text-slate-500 mt-1">Can nhap them</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Danh gia cho duyet</p>
                  <MessageSquare className="text-purple-500" size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{reviewsSummary.pending}</p>
                <p className="text-xs text-slate-500 mt-1">Can kiem duyet</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">San pham sap het hang</h3>
                <div className="space-y-3">
                  {products
                    .filter((p) => p.stockQuantity <= 10)
                    .slice(0, 5)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.category?.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stockQuantity === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          Con {product.stockQuantity}
                        </span>
                      </div>
                    ))}
                  {products.filter((p) => p.stockQuantity <= 10).length === 0 && (
                    <p className="text-slate-500 text-center py-4">Khong co san pham nao sap het hang</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Don hang gan day</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">#{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">{order.customerName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_MAP[order.status]?.color}`}>
                        {ORDER_STATUS_MAP[order.status]?.label}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-slate-500 text-center py-4">Chua co don hang nao</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quan ly san pham ({productsSummary.total})</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadProducts}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} className={productsLoading ? 'animate-spin' : ''} />
                  Lam moi
                </button>
                <button
                  onClick={() => {
                    resetProductForm();
                    setShowProductForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus size={16} />
                  Them san pham
                </button>
              </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-semibold">
                      {editingProduct ? 'Chinh sua san pham' : 'Them san pham moi'}
                    </h3>
                  </div>
                  <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ten san pham *</label>
                      <input
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="input-field"
                        placeholder="VD: Figure Gojo Satoru 1/7"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mo ta *</label>
                      <textarea
                        required
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="input-field"
                        placeholder="Mo ta chi tiet san pham (it nhat 20 ky tu)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gia ban *</label>
                        <input
                          required
                          type="number"
                          min={0}
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="input-field"
                          placeholder="VND"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gia goc (neu giam gia)</label>
                        <input
                          type="number"
                          min={0}
                          value={productForm.comparePrice}
                          onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                          className="input-field"
                          placeholder="VND"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ton kho *</label>
                        <input
                          required
                          type="number"
                          min={0}
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Danh muc *</label>
                        <select
                          required
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Chon danh muc</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hinh anh *</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="input-field flex-1"
                          placeholder="Nhap URL hinh anh"
                        />
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productForm.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} className="mx-auto" />
                            </button>
                          </div>
                        ))}
                        {productForm.images.length === 0 && (
                          <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isActive}
                          onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">Hien thi san pham</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">San pham noi bat</span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          resetProductForm();
                        }}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Huy
                      </button>
                      <button
                        type="submit"
                        disabled={productsLoading}
                        className="flex-1 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {productsLoading && <Loader2 size={16} className="animate-spin" />}
                        {editingProduct ? 'Cap nhat' : 'Them san pham'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quan ly don hang ({ordersSummary.total})</h2>
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
                Lam moi
              </button>
            </div>

            {/* Shipping Modal */}
            {shippingModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Thong tin van chuyen</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ma van don *</label>
                      <input
                        value={shippingInfo.trackingCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, trackingCode: e.target.value })}
                        className="input-field"
                        placeholder="VD: SPXVN123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Don vi van chuyen *</label>
                      <select
                        value={shippingInfo.carrier}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, carrier: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Chon don vi</option>
                        <option value="GHN">Giao Hang Nhanh</option>
                        <option value="GHTK">Giao Hang Tiet Kiem</option>
                        <option value="SPX">Shopee Express</option>
                        <option value="JT">J&T Express</option>
                        <option value="VNPost">VNPost</option>
                        <option value="Viettel">Viettel Post</option>
                        <option value="Ninja">Ninja Van</option>
                        <option value="Other">Khac</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShippingModal(null);
                          setShippingInfo({ trackingCode: '', carrier: '' });
                        }}
                        className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600"
                      >
                        Huy
                      </button>
                      <button
                        onClick={handleShippingSubmit}
                        className="flex-1 py-2 rounded-xl bg-slate-900 text-white"
                      >
                        Xac nhan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">#{order.orderNumber}</p>
                        <p className="font-semibold text-slate-900">{order.customerName}</p>
                        <p className="text-sm text-slate-500">{order.customerPhone}</p>
                        <p className="text-sm text-slate-500">{order._count.orderItems} san pham</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {Number(order.totalAmount).toLocaleString('vi-VN')}d
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_MAP[order.status]?.color}`}>
                        {ORDER_STATUS_MAP[order.status]?.label}
                      </span>
                      <div className="flex gap-2">
                        {ORDER_STATUS_MAP[order.status]?.nextStatus?.map((nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() => handleOrderStatusChange(order.id, nextStatus)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                              nextStatus === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                          >
                            {ORDER_STATUS_MAP[nextStatus]?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
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
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Quan ly danh gia ({reviewsSummary.total}) - Cho duyet: {reviewsSummary.pending}
              </h2>
              <button
                onClick={loadReviews}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={16} className={reviewsLoading ? 'animate-spin' : ''} />
                Lam moi
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                        {review.user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{review.user.fullName}</p>
                        <p className="text-sm text-slate-500">{review.user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {review.isVerified && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">Da mua</span>
                        )}
                        {review.isPinned && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-600">Ghim</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          review.isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {review.isApproved ? 'Da duyet' : 'Cho duyet'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-500 mb-1">San pham: <span className="font-medium text-slate-700">{review.product.name}</span></p>
                    {review.title && <p className="font-medium text-slate-900">{review.title}</p>}
                    <p className="text-slate-600 mt-1">{review.comment}</p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleReviewApproval(review)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        review.isApproved
                          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                    >
                      {review.isApproved ? <EyeOff size={14} /> : <Eye size={14} />}
                      {review.isApproved ? 'Bo duyet' : 'Duyet'}
                    </button>
                    <button
                      onClick={() => handleToggleReviewPin(review)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        review.isPinned
                          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Pin size={14} />
                      {review.isPinned ? 'Bo ghim' : 'Ghim'}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                    >
                      <Trash2 size={14} />
                      Xoa
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center text-slate-500">
                  {reviewsLoading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chua co danh gia nao'
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quan ly thong bao ({announcements.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadAnnouncements}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} className={announcementsLoading ? 'animate-spin' : ''} />
                  Lam moi
                </button>
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus size={16} />
                  Them thong bao
                </button>
              </div>
            </div>

            {/* Announcement Form Modal */}
            {showAnnouncementForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl w-full max-w-lg">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-semibold">Them thong bao moi</h3>
                  </div>
                  <form onSubmit={handleAnnouncementSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tieu de *</label>
                      <input
                        required
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        className="input-field"
                        placeholder="Tieu de thong bao"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tom tat *</label>
                      <textarea
                        required
                        rows={2}
                        value={announcementForm.summary}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, summary: e.target.value })}
                        className="input-field"
                        placeholder="Tom tat ngan gon (it nhat 10 ky tu)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Noi dung chi tiet</label>
                      <textarea
                        rows={4}
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                        className="input-field"
                        placeholder="Noi dung chi tiet (tuy chon)"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={announcementForm.isActive}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Hien thi thong bao</span>
                    </label>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAnnouncementForm(false);
                          resetAnnouncementForm();
                        }}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Huy
                      </button>
                      <button
                        type="submit"
                        disabled={announcementsLoading}
                        className="flex-1 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {announcementsLoading && <Loader2 size={16} className="animate-spin" />}
                        Dang thong bao
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-1">{announcement.title}</h3>
                      <p className="text-slate-600 mt-2">{announcement.summary}</p>
                      {announcement.content && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{announcement.content}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        announcement.isActive
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {announcement.isActive ? 'Hien thi' : 'An'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleAnnouncementStatus(announcement)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                          title={announcement.isActive ? 'An' : 'Hien thi'}
                        >
                          {announcement.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-2 rounded-lg hover:bg-rose-100 text-rose-600"
                          title="Xoa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center text-slate-500">
                  {announcementsLoading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chua co thong bao nao'
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
