'use client';

import { useState, useEffect, useMemo, FormEvent, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import {
  BarChart3,
  Coins,
  Edit,
  FilePlus,
  FileText,
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
  Newspaper,
  Ticket,
  Plus,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import ArticleEditor from '@/components/ArticleEditor';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Types for Revenue Chart
interface RevenueChartData {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface RevenueSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface RevenueData {
  summary: RevenueSummary;
  chartData: RevenueChartData[];
  period: {
    type: string;
    startDate: string;
    endDate: string;
    year: number;
    month: number | null;
  };
}

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
  preorderStatus: 'NONE' | 'PREORDER' | 'ORDER';
  // New detail fields
  seriesName?: string;
  brandName?: string;
  releaseDate?: string;
  msrpValue?: number;
  msrpCurrency?: string;
  productCode?: string;
  features?: string;
  condition?: string;
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
  note?: string | null;
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

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl?: string | null;
  isActive: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  description: string | null;
  status?: string;
  remainingUses?: number | null;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts?: Array<{ productId: string; name: string; image?: string | null; price: number; totalSold: number }>;
  ordersByStatus?: Record<string, number>;
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
  preorderStatus: 'NONE' | 'PREORDER' | 'ORDER';
  // New detail fields
  seriesName: string;
  brandName: string;
  releaseDate: string;
  msrpValue: string;
  msrpCurrency: string;
  productCode: string;
  features: string;
  condition: string;
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
  preorderStatus: 'NONE',
  // New detail fields
  seriesName: '',
  brandName: '',
  releaseDate: '',
  msrpValue: '',
  msrpCurrency: 'JPY',
  productCode: '',
  features: '',
  condition: 'New',
};

export default function AdminPage() {
  const { user } = useAuth();
  const csrfToken = Cookies.get('csrf-token') || '';
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  // States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'reviews' | 'articles' | 'coupons'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Form states
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Shipping modal states
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({ trackingCode: '', carrier: 'GHN' });

  // Loading states for actions
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Products filters & pagination
  const [productFilters, setProductFilters] = useState({ search: '', categoryId: '', stockStatus: '' });
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productTotal, setProductTotal] = useState(0);

  // Orders filters & pagination
  const [orderFilters, setOrderFilters] = useState({ search: '', status: '' });
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);

  // Reviews filters & pagination
  const [reviewFilters, setReviewFilters] = useState({ isApproved: '', rating: '' });
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);

  // Order detail modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderAdminNote, setOrderAdminNote] = useState('');

  // Articles states
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Announcement | null>(null);
  const [articleForm, setArticleForm] = useState({ title: '', summary: '', content: '', imageUrl: '', isActive: true, isHot: false });
  const [articlePage, setArticlePage] = useState(1);
  const [articleTotalPages, setArticleTotalPages] = useState(1);
  const [articleTotal, setArticleTotal] = useState(0);

  // Coupons states
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    value: '',
    minOrder: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    description: '',
    isActive: true,
  });
  const [couponPage, setCouponPage] = useState(1);
  const [couponTotalPages, setCouponTotalPages] = useState(1);
  const [couponTotal, setCouponTotal] = useState(0);
  const [couponFilters, setCouponFilters] = useState({ search: '', status: '' });

  // Revenue Chart states
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<'month' | 'day'>('month');
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [revenueMonth, setRevenueMonth] = useState(new Date().getMonth() + 1);

  // API Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  });

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch Revenue Data for Chart
  const fetchRevenueData = async () => {
    setRevenueLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('period', revenuePeriod);
      params.set('year', String(revenueYear));
      if (revenuePeriod === 'day') {
        params.set('month', String(revenueMonth));
      }

      const response = await fetch(`/api/admin/dashboard/revenue?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.data);
      }
    } catch (err) {
      console.error('Error fetching revenue data:', err);
    } finally {
      setRevenueLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(productPage));
      params.set('limit', '10');
      if (productFilters.search) params.set('search', productFilters.search);
      if (productFilters.categoryId) params.set('categoryId', productFilters.categoryId);
      if (productFilters.stockStatus) params.set('stockStatus', productFilters.stockStatus);

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // API trả về data.data.products
        const productsList = data.data?.products || data.products || data.data || [];
        setProducts(Array.isArray(productsList) ? productsList : []);
        const pagination = data.data?.pagination || data.pagination;
        if (pagination) {
          setProductTotal(pagination.total || 0);
          setProductTotalPages(pagination.totalPages || 1);
        }
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
        credentials: 'include',
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
      const params = new URLSearchParams();
      params.set('page', String(orderPage));
      params.set('limit', '10');
      if (orderFilters.search) params.set('search', orderFilters.search);
      if (orderFilters.status) params.set('status', orderFilters.status);

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // API trả về data.data.orders
        setOrders(data.data?.orders || data.orders || data.data || []);
        const pagination = data.data?.pagination || data.pagination;
        if (pagination) {
          setOrderTotal(pagination.total || 0);
          setOrderTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(reviewPage));
      params.set('limit', '10');
      if (reviewFilters.isApproved) params.set('isApproved', reviewFilters.isApproved);
      if (reviewFilters.rating) params.set('rating', reviewFilters.rating);

      const response = await fetch(`/api/admin/reviews?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // API trả về data.data.reviews
        setReviews(data.data?.reviews || data.reviews || data.data || []);
        const pagination = data.data?.pagination || data.pagination;
        if (pagination) {
          setReviewTotal(pagination.total || 0);
          setReviewTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Fetch Announcements/Articles
  const fetchAnnouncements = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(articlePage));
      params.set('limit', '10');

      const response = await fetch(`/api/admin/announcements?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data?.announcements || data.announcements || data.data || []);
        const pagination = data.data?.pagination || data.pagination;
        if (pagination) {
          setArticleTotal(pagination.total || 0);
          setArticleTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(couponPage));
      params.set('limit', '10');
      if (couponFilters.search) params.set('search', couponFilters.search);
      if (couponFilters.status) params.set('status', couponFilters.status);

      const response = await fetch(`/api/admin/coupons?${params.toString()}`, {
        headers: getHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.data?.coupons || data.coupons || []);
        const pagination = data.data?.pagination || data.pagination;
        if (pagination) {
          setCouponTotal(pagination.total || 0);
          setCouponTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchRevenueData(),
        fetchCategories(),
        fetchProducts(),
        fetchOrders(),
        fetchReviews(),
        fetchAnnouncements(),
        fetchCoupons(),
      ]);
      setLoading(false);
    };
    if (isAdmin) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Refetch announcements when pagination changes
  useEffect(() => {
    if (isAdmin) {
      fetchAnnouncements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, articlePage]);

  // Refetch when filters/pagination change
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, productPage, productFilters]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, orderPage, orderFilters]);

  useEffect(() => {
    if (isAdmin) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, reviewPage, reviewFilters]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnnouncements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, articlePage]);

  // Refetch coupons when filters/pagination change
  useEffect(() => {
    if (isAdmin) {
      fetchCoupons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, couponPage, couponFilters]);

  // Refetch revenue data when period/year/month changes
  useEffect(() => {
    if (isAdmin && activeTab === 'dashboard') {
      fetchRevenueData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, revenuePeriod, revenueYear, revenueMonth]);

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
      preorderStatus: productForm.preorderStatus,
      // New detail fields
      seriesName: productForm.seriesName || null,
      brandName: productForm.brandName || null,
      releaseDate: productForm.releaseDate || null,
      msrpValue: productForm.msrpValue ? parseFloat(productForm.msrpValue) : null,
      msrpCurrency: productForm.msrpCurrency || 'JPY',
      productCode: productForm.productCode || null,
      features: productForm.features || null,
      condition: productForm.condition || null,
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
        showToast(editingProduct ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm', 'success');
      } else {
        const data = await response.json();
        setError(data.error || 'Có lỗi xảy ra');
        showToast(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (_err) {
      setError('Không thể kết nối đến server');
      showToast('Không thể kết nối đến server', 'error');
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
        showToast('Đã xóa sản phẩm', 'success');
      } else {
        const data = await response.json();
        setError(data.error || 'Có lỗi xảy ra');
        showToast(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Không thể kết nối đến server');
      showToast('Không thể kết nối đến server', 'error');
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
      preorderStatus: product.preorderStatus || 'NONE',
      // New detail fields
      seriesName: product.seriesName || '',
      brandName: product.brandName || '',
      releaseDate: product.releaseDate ? product.releaseDate.split('T')[0] : '',
      msrpValue: product.msrpValue?.toString() || '',
      msrpCurrency: product.msrpCurrency || 'JPY',
      productCode: product.productCode || '',
      features: product.features || '',
      condition: product.condition || 'New',
    });
    setShowProductModal(true);
  };

  // Handle Toggle Product Status (Active/Inactive)
  const handleToggleProductStatus = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error toggling product status:', err);
    }
  };

  // Handle Order Status Update
  const handleOrderStatusUpdate = async (orderId: string, status: string, extraData?: { trackingCode?: string; carrier?: string; adminNote?: string }) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, ...extraData }),
      });

      if (response.ok) {
        await fetchOrders();
        await fetchDashboardStats();
        showToast('Cập nhật trạng thái đơn hàng thành công', 'success');
        return true;
      } else {
        const data = await response.json();
        showToast(data.error || 'Không thể cập nhật trạng thái đơn hàng', 'error');
        return false;
      }
    } catch (err) {
      console.error('Error updating order:', err);
      showToast('Có lỗi xảy ra khi cập nhật đơn hàng', 'error');
      return false;
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Shipping - mở modal nhập thông tin vận chuyển
  const handleShipping = (orderId: string) => {
    setShippingOrderId(orderId);
    setShippingForm({ trackingCode: '', carrier: 'GHN' });
    setShowShippingModal(true);
  };

  // Submit shipping info
  const handleShippingSubmit = async () => {
    if (!shippingOrderId) return;
    if (!shippingForm.trackingCode.trim()) {
      showToast('Vui lòng nhập mã vận đơn', 'error');
      return;
    }
    const success = await handleOrderStatusUpdate(shippingOrderId, 'SHIPPING', {
      trackingCode: shippingForm.trackingCode,
      carrier: shippingForm.carrier
    });
    if (success) {
      setShowShippingModal(false);
      setShippingOrderId(null);
    }
  };

  // Handle Review Approve/Delete
  const handleReviewAction = async (reviewId: string, action: 'approve' | 'delete') => {
    if (action === 'delete' && !confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    setUpdatingReviewId(reviewId);
    try {
      if (action === 'delete') {
        await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        showToast('Đã xóa đánh giá', 'success');
      } else {
        await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ isApproved: true }),
        });
        showToast('Đã duyệt đánh giá', 'success');
      }
      await fetchReviews();
    } catch (err) {
      console.error('Error handling review:', err);
      showToast('Có lỗi xảy ra', 'error');
    } finally {
      setUpdatingReviewId(null);
    }
  };

  // Handle Toggle Article Status
  const handleToggleArticleStatus = async (article: Announcement) => {
    try {
      const response = await fetch(`/api/admin/announcements/${article.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !article.isActive }),
      });

      if (response.ok) {
        await fetchAnnouncements();
        showToast(`Đã ${!article.isActive ? 'xuất bản' : 'ẩn'} tin tức`, 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (err) {
      console.error('Error toggling article status:', err);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái', 'error');
    }
  };

  // Handle Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tin tức này?')) return;

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Đã xóa tin tức', 'success');
        await fetchAnnouncements();
      } else {
        showToast(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (err) {
      console.error('Error deleting article:', err);
      showToast('Không thể kết nối đến server', 'error');
    }
  };

  // Handle Edit Article
  const handleEditArticle = async (article: Announcement) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      summary: article.summary,
      content: article.content || '',
      imageUrl: article.imageUrl || '',
      isActive: article.isActive,
      isHot: article.isHot
    });
    setShowArticleModal(true);
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

  // Handle Article Submit (Create/Update)
  const handleArticleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!articleForm.title.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }
    if (!articleForm.summary.trim()) {
      setError('Tóm tắt không được để trống');
      return;
    }
    if (!articleForm.content || articleForm.content.trim() === '<p><br></p>') {
      setError('Nội dung không được để trống');
      return;
    }

    try {
      const url = editingArticle
        ? `/api/admin/announcements/${editingArticle.id}`
        : '/api/admin/announcements';
      const method = editingArticle ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(articleForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi lưu tin tức');
      }

      await fetchAnnouncements();
      setShowArticleModal(false);
      setArticleForm({ title: '', summary: '', content: '', imageUrl: '', isActive: true, isHot: false });
      setEditingArticle(null);
      setToast({
        type: 'success',
        message: editingArticle ? 'Cập nhật tin tức thành công' : 'Thêm tin tức thành công',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(message);
      setToast({ type: 'error', message });
    }
  };

  // Handle Coupon Submit (Create/Update)
  const handleCouponSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!couponForm.code.trim()) {
      setError('Mã giảm giá không được để trống');
      return;
    }
    if (!couponForm.value) {
      setError('Giá trị giảm giá không được để trống');
      return;
    }
    if (!couponForm.validFrom || !couponForm.validTo) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const payload = {
        code: couponForm.code.toUpperCase().replace(/\s/g, ''),
        type: couponForm.type,
        value: parseFloat(couponForm.value),
        minOrder: couponForm.minOrder ? parseFloat(couponForm.minOrder) : null,
        maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : null,
        validFrom: new Date(couponForm.validFrom).toISOString(),
        validTo: new Date(couponForm.validTo).toISOString(),
        usageLimit: couponForm.usageLimit ? parseInt(couponForm.usageLimit) : null,
        description: couponForm.description || null,
        isActive: couponForm.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi lưu mã giảm giá');
      }

      await fetchCoupons();
      setShowCouponModal(false);
      setCouponForm({
        code: '',
        type: 'PERCENTAGE',
        value: '',
        minOrder: '',
        maxDiscount: '',
        validFrom: '',
        validTo: '',
        usageLimit: '',
        description: '',
        isActive: true,
      });
      setEditingCoupon(null);
      showToast(editingCoupon ? 'Cập nhật mã giảm giá thành công' : 'Thêm mã giảm giá thành công', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(message);
      showToast(message, 'error');
    }
  };

  // Handle Coupon Delete
  const handleCouponDelete = async (couponId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa mã giảm giá');
      }

      await fetchCoupons();
      showToast('Xóa mã giảm giá thành công', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      showToast(message, 'error');
    }
  };

  // Handle Coupon Toggle Active
  const handleCouponToggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái');
      }

      await fetchCoupons();
      showToast(`Đã ${coupon.isActive ? 'vô hiệu hóa' : 'kích hoạt'} mã giảm giá`, 'success');
    } catch (err) {
      showToast('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  // Open Edit Coupon Modal
  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrder: coupon.minOrder ? String(coupon.minOrder) : '',
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
      validTo: new Date(coupon.validTo).toISOString().slice(0, 16),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
      description: coupon.description || '',
      isActive: coupon.isActive,
    });
    setShowCouponModal(true);
  };

  // Calculate pending orders
  const pendingOrders = useMemo(
    () => (orders || []).filter((o) => o.status === 'PENDING'),
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

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
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
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-rose-500 text-white' :
          'bg-slate-800 text-white'
        }`}>
          {toast.message}
        </div>
      )}
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
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-sm text-slate-300">Sản phẩm</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{pendingOrders.length}</div>
                <p className="text-sm text-slate-300">Đơn chờ duyệt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
            { id: 'products', label: 'Sản phẩm', icon: FolderPlus },
            { id: 'articles', label: 'Tin tức', icon: FileText },
            { id: 'orders', label: 'Đơn hàng', icon: PackageCheck },
            { id: 'reviews', label: 'Đánh giá', icon: MessageSquare },
            { id: 'coupons', label: 'Mã giảm giá', icon: Ticket },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all bg-white text-slate-600 hover:bg-slate-100"
          >
            <Users size={18} />
            Tài khoản
          </Link>
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

            {/* Status Summary & Top Products */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-700 border border-slate-100"
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                      </span>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                  ))}
                  {(!stats?.ordersByStatus || Object.keys(stats.ordersByStatus).length === 0) && (
                    <p className="text-slate-500 text-sm">Chưa có dữ liệu</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Top sản phẩm bán chạy</h3>
                <div className="space-y-3">
                  {(stats?.topProducts || []).map((p) => (
                    <div key={p.productId} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">No</div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{p.name}</p>
                          <p className="text-sm text-slate-500">{formatCurrency(Number(p.price || 0))}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{p.totalSold} bán</p>
                      </div>
                    </div>
                  ))}
                  {(stats?.topProducts?.length || 0) === 0 && (
                    <p className="text-sm text-slate-500">Chưa có dữ liệu</p>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Biểu đồ doanh thu</h2>
                  {revenueData?.summary && (
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <span className="text-slate-600">
                        Tổng: <span className="font-semibold text-slate-900">{formatCurrency(revenueData.summary.totalRevenue)}</span>
                      </span>
                      <span className="text-slate-600">
                        Đơn hàng: <span className="font-semibold text-slate-900">{revenueData.summary.totalOrders}</span>
                      </span>
                      <span className={`${revenueData.summary.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {revenueData.summary.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueData.summary.revenueGrowth)}% so với kỳ trước
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={revenuePeriod}
                    onChange={(e) => setRevenuePeriod(e.target.value as 'month' | 'day')}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="month">Theo tháng</option>
                    <option value="day">Theo ngày</option>
                  </select>
                  <select
                    value={revenueYear}
                    onChange={(e) => setRevenueYear(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {revenuePeriod === 'day' && (
                    <select
                      value={revenueMonth}
                      onChange={(e) => setRevenueMonth(Number(e.target.value))}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>Tháng {month}</option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={fetchRevenueData}
                    disabled={revenueLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={revenueLoading ? 'animate-spin' : ''} />
                    Làm mới
                  </button>
                </div>
              </div>

              {revenueLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                </div>
              ) : revenueData?.chartData && revenueData.chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData.chartData.map((item) => ({
                        ...item,
                        name: revenuePeriod === 'month'
                          ? `T${item.period}`
                          : `${item.period}/${revenueMonth}`,
                        revenueDisplay: item.revenue,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis
                        tickFormatter={(value) => {
                          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                          return value;
                        }}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          const numValue = typeof value === 'number' ? value : 0;
                          if (name === 'revenueDisplay') return [formatCurrency(numValue), 'Doanh thu'];
                          if (name === 'orders') return [numValue, 'Đơn hàng'];
                          return [numValue, String(name)];
                        }}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          if (value === 'revenueDisplay') return 'Doanh thu';
                          if (value === 'orders') return 'Số đơn hàng';
                          return value;
                        }}
                      />
                      <Bar
                        dataKey="revenueDisplay"
                        fill="#ec4899"
                        radius={[4, 4, 0, 0]}
                        name="revenueDisplay"
                      />
                      <Bar
                        dataKey="orders"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="orders"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500">
                  Chưa có dữ liệu doanh thu trong khoảng thời gian này
                </div>
              )}
            </div>

            {/* Recent Orders from stats */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Đơn hàng gần đây</h2>
                <button
                  onClick={fetchDashboardStats}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} />
                  Làm mới
                </button>
              </div>
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
                    {(stats?.recentOrders || []).map((order) => (
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
              {(stats?.recentOrders?.length || 0) === 0 && (
                <div className="p-8 text-center text-slate-500">Chưa có đơn hàng nào</div>
              )}
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
                    setProductForm(initialProductForm);
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
              {/* Filters */}
              <div className="p-4 flex flex-wrap gap-4 items-end border-b border-slate-100">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm text-slate-600">Tìm kiếm</label>
                  <input
                    value={productFilters.search}
                    onChange={(e) => { setProductPage(1); setProductFilters({ ...productFilters, search: e.target.value }); }}
                    className="input-field mt-1"
                    placeholder="Tên hoặc slug"
                  />
                </div>
                <div className="min-w-[200px]">
                  <label className="text-sm text-slate-600">Danh mục</label>
                  <select
                    value={productFilters.categoryId}
                    onChange={(e) => { setProductPage(1); setProductFilters({ ...productFilters, categoryId: e.target.value }); }}
                    className="input-field mt-1"
                  >
                    <option value="">Tất cả</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="min-w-[200px]">
                  <label className="text-sm text-slate-600">Tồn kho</label>
                  <select
                    value={productFilters.stockStatus}
                    onChange={(e) => { setProductPage(1); setProductFilters({ ...productFilters, stockStatus: e.target.value }); }}
                    className="input-field mt-1"
                  >
                    <option value="">Tất cả</option>
                    <option value="in_stock">Còn nhiều</option>
                    <option value="low_stock">Sắp hết</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </div>
                <button
                  onClick={() => { setProductFilters({ search: '', categoryId: '', stockStatus: '' }); setProductPage(1); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
                >
                  Xóa lọc
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-600">San pham</th>
                      <th className="text-left p-4 font-medium text-slate-600">Danh muc</th>
                      <th className="text-right p-4 font-medium text-slate-600">Gia</th>
                      <th className="text-center p-4 font-medium text-slate-600">Ton kho</th>
                      <th className="text-center p-4 font-medium text-slate-600">Phan loai</th>
                      <th className="text-center p-4 font-medium text-slate-600">Trang thai</th>
                      <th className="text-center p-4 font-medium text-slate-600">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(products || []).map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.images && product.images[0] && (
                              <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stockQuantity === 0
                            ? 'bg-rose-100 text-rose-600'
                            : product.stockQuantity <= 10
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-emerald-100 text-emerald-600'
                            }`}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.preorderStatus === 'NONE'
                            ? 'bg-green-100 text-green-600'
                            : product.preorderStatus === 'PREORDER'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-blue-100 text-blue-600'
                            }`}>
                            {product.preorderStatus === 'NONE' ? 'Sẵn hàng' : product.preorderStatus === 'PREORDER' ? 'Pre-order' : 'Đặt hàng'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleProductStatus(product)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive
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
                  {loading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chưa có sản phẩm nào'
                  )}
                </div>
              )}

              {/* Pagination */}
              {productTotalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm text-slate-600">
                  <span>Trang {productPage}/{productTotalPages} · {productTotal} sản phẩm</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                      disabled={productPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setProductPage((p) => Math.min(productTotalPages, p + 1))}
                      disabled={productPage === productTotalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
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
                  {loading ? (
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  ) : (
                    'Chưa có đơn hàng nào'
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quản lý đơn hàng ({orders.length})</h2>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={16} />
                Làm mới
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-end mb-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-slate-600">Tìm kiếm</label>
                <input
                  value={orderFilters.search}
                  onChange={(e) => { setOrderPage(1); setOrderFilters({ ...orderFilters, search: e.target.value }); }}
                  className="input-field mt-1"
                  placeholder="Mã đơn, khách hàng, email, SĐT"
                />
              </div>
              <div className="min-w-[200px]">
                <label className="text-sm text-slate-600">Trạng thái</label>
                <select
                  value={orderFilters.status}
                  onChange={(e) => { setOrderPage(1); setOrderFilters({ ...orderFilters, status: e.target.value }); }}
                  className="input-field mt-1"
                >
                  <option value="">Tất cả</option>
                  {['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <option key={st} value={st}>{getStatusLabel(st)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setOrderFilters({ search: '', status: '' }); setOrderPage(1); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
              >
                Xóa lọc
              </button>
            </div>
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
                      <button
                        onClick={() => { setSelectedOrder(order); setShowOrderModal(true); setOrderAdminNote(''); }}
                        className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200"
                      >
                        Chi tiết
                      </button>
                      {order.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'CONFIRMED')}
                            disabled={updatingOrderId === order.id}
                            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                              updatingOrderId === order.id
                                ? 'bg-slate-200 text-slate-500 cursor-wait'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              'Xác nhận'
                            )}
                          </button>
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'CANCELLED')}
                            disabled={updatingOrderId === order.id}
                            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                              updatingOrderId === order.id
                                ? 'bg-slate-200 text-slate-500 cursor-wait'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              'Hủy đơn'
                            )}
                          </button>
                        </>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                          disabled={updatingOrderId === order.id}
                          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[130px] justify-center transition-all ${
                            updatingOrderId === order.id
                              ? 'bg-slate-200 text-slate-500 cursor-wait'
                              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                          }`}
                        >
                          {updatingOrderId === order.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            'Chuẩn bị hàng'
                          )}
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => handleShipping(order.id)}
                          className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100"
                        >
                          Giao hàng
                        </button>
                      )}
                      {order.status === 'SHIPPING' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')}
                          disabled={updatingOrderId === order.id}
                          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                            updatingOrderId === order.id
                              ? 'bg-slate-200 text-slate-500 cursor-wait'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {updatingOrderId === order.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            'Đã giao'
                          )}
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.id, 'COMPLETED')}
                          disabled={updatingOrderId === order.id}
                          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                            updatingOrderId === order.id
                              ? 'bg-slate-200 text-slate-500 cursor-wait'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {updatingOrderId === order.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            'Hoàn thành'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-slate-500 py-8">Chưa có đơn hàng nào</p>
              )}

              {/* Pagination */}
              {orderTotalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm text-slate-600">
                  <span>Trang {orderPage}/{orderTotalPages} · {orderTotal} đơn</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                      disabled={orderPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setOrderPage((p) => Math.min(orderTotalPages, p + 1))}
                      disabled={orderPage === orderTotalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quản lý đánh giá ({reviews.length})</h2>
              <button
                onClick={fetchReviews}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={16} />
                Làm mới
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-end mb-6">
              <div className="min-w-[180px]">
                <label className="text-sm text-slate-600">Trạng thái</label>
                <select
                  value={reviewFilters.isApproved}
                  onChange={(e) => { setReviewPage(1); setReviewFilters({ ...reviewFilters, isApproved: e.target.value }); }}
                  className="input-field mt-1"
                >
                  <option value="">Tất cả</option>
                  <option value="true">Đã duyệt</option>
                  <option value="false">Chờ duyệt</option>
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-slate-600">Số sao</label>
                <select
                  value={reviewFilters.rating}
                  onChange={(e) => { setReviewPage(1); setReviewFilters({ ...reviewFilters, rating: e.target.value }); }}
                  className="input-field mt-1"
                >
                  <option value="">Tất cả</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={String(r)}>{r} sao</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setReviewFilters({ isApproved: '', rating: '' }); setReviewPage(1); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
              >
                Xóa lọc
              </button>
            </div>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${review.isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
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
                        disabled={updatingReviewId === review.id}
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                          updatingReviewId === review.id
                            ? 'bg-slate-200 text-slate-500 cursor-wait'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {updatingReviewId === review.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          'Duyệt'
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleReviewAction(review.id, 'delete')}
                      disabled={updatingReviewId === review.id}
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 min-w-[110px] justify-center transition-all ${
                        updatingReviewId === review.id
                          ? 'bg-slate-200 text-slate-500 cursor-wait'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      {updatingReviewId === review.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Xóa'
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-center text-slate-500 py-8">Chưa có đánh giá nào</p>
              )}

              {/* Pagination */}
              {reviewTotalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm text-slate-600">
                  <span>Trang {reviewPage}/{reviewTotalPages} · {reviewTotal} đánh giá</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      disabled={reviewPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setReviewPage((p) => Math.min(reviewTotalPages, p + 1))}
                      disabled={reviewPage === reviewTotalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles/News Tab */}
        {activeTab === 'articles' && (
          <>
            {/* Header và action button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Quản lý tin tức</h2>
                <p className="text-slate-600 mt-1">Tổng cộng: <span className="font-semibold">{articleTotal}</span> tin tức</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchAnnouncements}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} />
                  Làm mới
                </button>
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleForm({ title: '', summary: '', content: '', imageUrl: '', isActive: true, isHot: false });
                    setShowArticleModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg"
                >
                  <FilePlus size={20} />
                  Thêm tin tức mới
                </button>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg font-medium">Chưa có tin tức nào</p>
                <p className="text-slate-400 text-sm mt-1">Hãy thêm tin tức đầu tiên để bắt đầu</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Tiêu đề</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Tóm tắt</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Ngày tạo</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Cập nhật</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">Trạng thái</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {announcements.map((article) => (
                        <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs">
                            <div className="line-clamp-1">{article.title}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 max-w-xs">
                            <div className="line-clamp-2 text-sm">{article.summary}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                            {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                            {new Date(article.updatedAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                article.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${article.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                {article.isActive ? 'Công khai' : 'Ẩn'}
                              </span>
                              {article.isHot && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  🔥 Hot
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {articleTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-600 font-medium">
                      Trang <span className="font-bold text-slate-900">{articlePage}</span> / <span className="font-bold text-slate-900">{articleTotalPages}</span>
                      <span className="text-slate-500 ml-2">(Tổng: {articleTotal} tin)</span>
                    </p>
                    <div className="space-x-2">
                      <button
                        onClick={() => setArticlePage((p) => Math.max(1, p - 1))}
                        disabled={articlePage === 1}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Trước
                      </button>
                      <button
                        onClick={() => setArticlePage((p) => Math.min(articleTotalPages, p + 1))}
                        disabled={articlePage === articleTotalPages}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Sau →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <>
            {/* Header và action button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Quản lý mã giảm giá</h2>
                <p className="text-slate-600 mt-1">Tổng cộng: <span className="font-semibold">{couponTotal}</span> mã giảm giá</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchCoupons}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw size={16} />
                  Làm mới
                </button>
                <button
                  onClick={() => {
                    setEditingCoupon(null);
                    setCouponForm({
                      code: '',
                      type: 'PERCENTAGE',
                      value: '',
                      minOrder: '',
                      maxDiscount: '',
                      validFrom: '',
                      validTo: '',
                      usageLimit: '',
                      description: '',
                      isActive: true,
                    });
                    setShowCouponModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg"
                >
                  <Plus size={20} />
                  Thêm mã giảm giá
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm mã giảm giá..."
                  value={couponFilters.search}
                  onChange={(e) => { setCouponPage(1); setCouponFilters({ ...couponFilters, search: e.target.value }); }}
                  className="input-field"
                />
              </div>
              <div className="min-w-[160px]">
                <select
                  value={couponFilters.status}
                  onChange={(e) => { setCouponPage(1); setCouponFilters({ ...couponFilters, status: e.target.value }); }}
                  className="input-field"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="upcoming">Sắp có hiệu lực</option>
                </select>
              </div>
              <button
                onClick={() => { setCouponFilters({ search: '', status: '' }); setCouponPage(1); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
              >
                Xóa lọc
              </button>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg font-medium">Chưa có mã giảm giá nào</p>
                <p className="text-slate-400 text-sm mt-1">Hãy thêm mã giảm giá đầu tiên để bắt đầu</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Mã</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Loại giảm giá</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Giá trị</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Giảm tối đa</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Đơn tối thiểu</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">Số lượng</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Thời hạn</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">Trạng thái</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.map((coupon) => {
                        const isExpired = new Date(coupon.validTo) < new Date();
                        const isUpcoming = new Date(coupon.validFrom) > new Date();
                        const isUsedUp = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;

                        return (
                          <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-mono font-bold text-sm">
                                <Ticket size={14} />
                                {coupon.code}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                coupon.type === 'PERCENTAGE'
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}>
                                {coupon.type === 'PERCENTAGE' ? (
                                  <><Percent size={12} /> Phần trăm</>
                                ) : (
                                  <><Coins size={12} /> Số tiền cố định</>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {coupon.type === 'PERCENTAGE'
                                ? `${coupon.value}%`
                                : formatCurrency(Number(coupon.value))
                              }
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {coupon.maxDiscount
                                ? formatCurrency(Number(coupon.maxDiscount))
                                : <span className="text-slate-400">-</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {coupon.minOrder
                                ? formatCurrency(Number(coupon.minOrder))
                                : <span className="text-slate-400">-</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <span className={`font-bold ${isUsedUp ? 'text-rose-600' : 'text-slate-900'}`}>
                                  {coupon.usedCount}{coupon.usageLimit !== null && ` / ${coupon.usageLimit}`}
                                </span>
                                {coupon.usageLimit !== null && (
                                  <span className="text-xs text-slate-500">
                                    Còn lại: {Math.max(0, coupon.usageLimit - coupon.usedCount)}
                                  </span>
                                )}
                                {coupon.usageLimit === null && (
                                  <span className="text-xs text-slate-400">Không giới hạn</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-600">
                                  <span className="text-slate-400">Từ:</span>{' '}
                                  {new Date(coupon.validFrom).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="text-slate-600">
                                  <span className="text-slate-400">Đến:</span>{' '}
                                  {new Date(coupon.validTo).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {isExpired ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                    <XCircle size={12} /> Hết hạn
                                  </span>
                                ) : isUpcoming ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                                    <Calendar size={12} /> Sắp tới
                                  </span>
                                ) : isUsedUp ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                                    <XCircle size={12} /> Đã hết lượt
                                  </span>
                                ) : coupon.isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                                    <CheckCircle size={12} /> Hoạt động
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                    <XCircle size={12} /> Vô hiệu
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditCoupon(coupon)}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={14} />
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleCouponToggleActive(coupon)}
                                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs transition-colors ${
                                    coupon.isActive
                                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  }`}
                                  title={coupon.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                >
                                  {coupon.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                  {coupon.isActive ? 'Tắt' : 'Bật'}
                                </button>
                                <button
                                  onClick={() => handleCouponDelete(coupon.id)}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 size={14} />
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {couponTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-600 font-medium">
                      Trang <span className="font-bold text-slate-900">{couponPage}</span> / <span className="font-bold text-slate-900">{couponTotalPages}</span>
                      <span className="text-slate-500 ml-2">(Tổng: {couponTotal} mã)</span>
                    </p>
                    <div className="space-x-2">
                      <button
                        onClick={() => setCouponPage((p) => Math.max(1, p - 1))}
                        disabled={couponPage === 1}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Trước
                      </button>
                      <button
                        onClick={() => setCouponPage((p) => Math.min(couponTotalPages, p + 1))}
                        disabled={couponPage === couponTotalPages}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Sau →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
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
                  title="Đóng"
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
                      title="Chọn danh mục sản phẩm"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Details Section */}
                  <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Thông tin chi tiết sản phẩm</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Series (Anime/Manga) *
                    </label>
                    <input
                      required
                      value={productForm.seriesName}
                      onChange={(e) => setProductForm({ ...productForm, seriesName: e.target.value })}
                      className="input-field"
                      placeholder="VD: Naruto, One Piece, Demon Slayer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Thương hiệu *
                    </label>
                    <input
                      required
                      value={productForm.brandName}
                      onChange={(e) => setProductForm({ ...productForm, brandName: e.target.value })}
                      className="input-field"
                      placeholder="VD: Bandai, Good Smile, Kotobukiya..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ngày phát hành
                    </label>
                    <input
                      type="date"
                      value={productForm.releaseDate}
                      onChange={(e) => setProductForm({ ...productForm, releaseDate: e.target.value })}
                      className="input-field"
                      title="Ngày phát hành sản phẩm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mã sản phẩm (Code) *
                    </label>
                    <input
                      required
                      value={productForm.productCode}
                      onChange={(e) => setProductForm({ ...productForm, productCode: e.target.value })}
                      className="input-field"
                      placeholder="VD: GSC-12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Giá hãng đề xuất (MSRP)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={productForm.msrpValue}
                        onChange={(e) => setProductForm({ ...productForm, msrpValue: e.target.value })}
                        className="input-field flex-1"
                        placeholder="0"
                      />
                      <select
                        value={productForm.msrpCurrency}
                        onChange={(e) => setProductForm({ ...productForm, msrpCurrency: e.target.value })}
                        className="input-field w-24"
                        title="Đơn vị tiền tệ"
                      >
                        <option value="JPY">JPY</option>
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                        <option value="CNY">CNY</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tình trạng *
                    </label>
                    <select
                      required
                      value={productForm.condition}
                      onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                      className="input-field"
                      title="Tình trạng sản phẩm"
                    >
                      <option value="New">Mới 100%</option>
                      <option value="Like New">Như mới</option>
                      <option value="Used">Đã qua sử dụng</option>
                      <option value="Damaged Box">Hộp bị móp/hư</option>
                      <option value="No Box">Không có hộp</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Đặc điểm sản phẩm *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={productForm.features}
                      onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                      className="input-field"
                      placeholder="Mô tả các đặc điểm nổi bật: kích thước, chất liệu, phụ kiện đi kèm..."
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2"></div>

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
                          <img src={img} alt={`Hình ảnh sản phẩm ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
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

                  {/* Preorder Status */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Trạng thái hàng hóa
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preorderStatus"
                          value="NONE"
                          checked={productForm.preorderStatus === 'NONE'}
                          onChange={() => setProductForm({ ...productForm, preorderStatus: 'NONE' })}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Sẵn hàng
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preorderStatus"
                          value="PREORDER"
                          checked={productForm.preorderStatus === 'PREORDER'}
                          onChange={() => setProductForm({ ...productForm, preorderStatus: 'PREORDER' })}
                          className="w-4 h-4 text-orange-600"
                        />
                        <span className="text-sm">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                          Pre-order
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preorderStatus"
                          value="ORDER"
                          checked={productForm.preorderStatus === 'ORDER'}
                          onChange={() => setProductForm({ ...productForm, preorderStatus: 'ORDER' })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          Đặt hàng
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Sẵn hàng: Giao ngay | Pre-order: Đặt trước chờ phát hành | Đặt hàng: Phải order từ nhà sản xuất
                    </p>
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

        {/* Order detail modal */}
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
                  <p className="text-sm text-slate-600">Trạng thái: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</span></p>
                  <p className="text-sm text-slate-600 mt-1">Tổng tiền: <span className="font-semibold">{formatCurrency(Number(selectedOrder.totalAmount))}</span></p>
                  <p className="text-sm text-slate-600 mt-1">Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Ghi chú admin</p>
                  <textarea
                    value={orderAdminNote}
                    onChange={(e) => setOrderAdminNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-slate-400"
                    rows={3}
                    placeholder="Thêm ghi chú khi cập nhật trạng thái"
                  />
                </div>
              </div>

              {/* Customer Note - Ghi chú từ khách hàng */}
              {selectedOrder.note && selectedOrder.note.trim() !== '' ? (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Ghi chú từ khách hàng
                  </p>
                  <p className="text-sm text-amber-700 whitespace-pre-wrap">{selectedOrder.note}</p>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-500 mb-1 flex items-center gap-2">
                    <FileText size={16} />
                    Ghi chú từ khách hàng
                  </p>
                  <p className="text-sm text-slate-400 italic">Không có ghi chú</p>
                </div>
              )}

              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-2">Sản phẩm</p>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between text-sm">
                      <span>{item.product?.name || 'Sản phẩm'} x{item.quantity}</span>
                      <span>{formatCurrency(Number(item.price))}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Đóng
                </button>
                {selectedOrder.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleOrderStatusUpdate(selectedOrder.id, 'CONFIRMED', { adminNote: orderAdminNote || undefined })}
                      disabled={updatingOrderId === selectedOrder.id}
                      className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 min-w-[120px] justify-center transition-all ${
                        updatingOrderId === selectedOrder.id
                          ? 'bg-slate-200 text-slate-500 cursor-wait'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {updatingOrderId === selectedOrder.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Xác nhận'
                      )}
                    </button>
                    <button
                      onClick={() => handleOrderStatusUpdate(selectedOrder.id, 'CANCELLED', { adminNote: orderAdminNote || undefined })}
                      disabled={updatingOrderId === selectedOrder.id}
                      className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 min-w-[120px] justify-center transition-all ${
                        updatingOrderId === selectedOrder.id
                          ? 'bg-slate-200 text-slate-500 cursor-wait'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      {updatingOrderId === selectedOrder.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Hủy đơn'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Shipping Modal - Nhập thông tin vận chuyển */}
        {showShippingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Thông tin vận chuyển</h2>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Đơn vị vận chuyển <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={shippingForm.carrier}
                    onChange={(e) => setShippingForm({ ...shippingForm, carrier: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="GHN">Giao Hàng Nhanh (GHN)</option>
                    <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
                    <option value="VNPost">VNPost</option>
                    <option value="ViettelPost">Viettel Post</option>
                    <option value="JT">J&T Express</option>
                    <option value="Ninja">Ninja Van</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mã vận đơn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingForm.trackingCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, trackingCode: e.target.value })}
                    placeholder="Nhập mã vận đơn..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowShippingModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleShippingSubmit}
                  disabled={updatingOrderId === shippingOrderId}
                  className={`flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    updatingOrderId === shippingOrderId
                      ? 'bg-slate-300 text-slate-500 cursor-wait'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {updatingOrderId === shippingOrderId ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận giao hàng'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Article Modal - Thêm/Sửa tin tức */}
        {showArticleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingArticle ? '✏️ Chỉnh sửa tin tức' : '📰 Thêm tin tức mới'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {editingArticle ? 'Cập nhật thông tin tin tức' : 'Tạo một bài viết tin tức mới'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowArticleModal(false);
                    setEditingArticle(null);
                    setArticleForm({ title: '', summary: '', content: '', imageUrl: '', isActive: true, isHot: false });
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  title="Đóng"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-semibold">Lỗi</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleArticleSubmit} className="space-y-6">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Tiêu đề <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ví dụ: Cập nhật sản phẩm mới tháng 12..."
                  />
                  <p className="text-xs text-slate-500 mt-1">Tiêu đề sẽ hiển thị trên trang tin tức</p>
                </div>

                {/* Tóm tắt */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Tóm tắt <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Nhập tóm tắt ngắn gọn (hiển thị trên danh sách tin)..."
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {articleForm.summary.length}/300 ký tự
                  </p>
                </div>

                {/* Nội dung */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Nội dung <span className="text-rose-500">*</span>
                  </label>
                  <ArticleEditor
                    value={articleForm.content}
                    onChange={(content) => setArticleForm({ ...articleForm, content })}
                    placeholder="Nhập nội dung chi tiết của tin tức..."
                    minHeight="300px"
                  />
                  <p className="text-xs text-slate-500 mt-1">Hỗ trợ: định dạng chữ, danh sách, liên kết, hình ảnh...</p>
                </div>

                {/* Hình minh họa */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Hình minh họa (URL)
                  </label>
                  <input
                    type="url"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-slate-500 mt-1">URL hình ảnh sẽ hiển thị trên banner tin tức hot</p>
                  {articleForm.imageUrl && (
                    <div className="mt-3 relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={articleForm.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Trạng thái & Tin hot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trạng thái */}
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={articleForm.isActive}
                          onChange={(e) => setArticleForm({ ...articleForm, isActive: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 cursor-pointer accent-indigo-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Công khai bài viết</p>
                        <p className="text-xs text-slate-600">
                          {articleForm.isActive ? '✅ Hiển thị trên trang tin tức' : '🔒 Ẩn, chỉ admin thấy'}
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Tin hot */}
                  <div className="bg-rose-50 p-4 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={articleForm.isHot}
                          onChange={(e) => setArticleForm({ ...articleForm, isHot: e.target.checked })}
                          className="w-5 h-5 rounded border-rose-300 cursor-pointer accent-rose-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Tin tức hot</p>
                        <p className="text-xs text-slate-600">
                          {articleForm.isHot ? '🔥 Hiển thị trên banner trang chủ' : '📰 Tin tức thường'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowArticleModal(false);
                      setEditingArticle(null);
                      setArticleForm({ title: '', summary: '', content: '', imageUrl: '', isActive: true, isHot: false });
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FilePlus size={18} />
                    {editingArticle ? '💾 Cập nhật' : '➕ Thêm'} tin tức
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupon Modal - Thêm/Sửa mã giảm giá */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingCoupon ? '✏️ Chỉnh sửa mã giảm giá' : '🎫 Thêm mã giảm giá mới'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {editingCoupon ? 'Cập nhật thông tin mã giảm giá' : 'Tạo một mã giảm giá mới cho khách hàng'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCouponModal(false);
                    setEditingCoupon(null);
                    setCouponForm({
                      code: '',
                      type: 'PERCENTAGE',
                      value: '',
                      minOrder: '',
                      maxDiscount: '',
                      validFrom: '',
                      validTo: '',
                      usageLimit: '',
                      description: '',
                      isActive: true,
                    });
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  title="Đóng"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-semibold">Lỗi</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCouponSubmit} className="space-y-6">
                {/* Mã coupon */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Mã giảm giá <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono uppercase"
                    placeholder="VD: SALE20, NEWYEAR2025..."
                    maxLength={50}
                  />
                  <p className="text-xs text-slate-500 mt-1">Chỉ dùng chữ in hoa, số, gạch ngang và gạch dưới</p>
                </div>

                {/* Loại giảm giá và Giá trị */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Loại giảm giá <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={couponForm.type}
                      onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="PERCENTAGE">Phần trăm (%)</option>
                      <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Giá trị <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="number"
                        min="0"
                        max={couponForm.type === 'PERCENTAGE' ? 100 : undefined}
                        step={couponForm.type === 'PERCENTAGE' ? '1' : '1000'}
                        value={couponForm.value}
                        onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                        placeholder={couponForm.type === 'PERCENTAGE' ? '10' : '50000'}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        {couponForm.type === 'PERCENTAGE' ? '%' : '₫'}
                      </span>
                    </div>
                    {couponForm.type === 'PERCENTAGE' && (
                      <p className="text-xs text-slate-500 mt-1">Tối đa 100%</p>
                    )}
                  </div>
                </div>

                {/* Giảm tối đa và Đơn tối thiểu */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Giảm tối đa {couponForm.type === 'PERCENTAGE' && <span className="text-slate-500 font-normal">(khuyến nghị)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                        placeholder="100000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Để trống = không giới hạn</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Đơn hàng tối thiểu
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={couponForm.minOrder}
                        onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                        placeholder="200000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Để trống = không yêu cầu</p>
                  </div>
                </div>

                {/* Thời hạn */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Ngày bắt đầu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={couponForm.validFrom}
                      onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Ngày kết thúc <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={couponForm.validTo}
                      onChange={(e) => setCouponForm({ ...couponForm, validTo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Số lượng sử dụng */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Số lượng mã (giới hạn lượt sử dụng)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="VD: 100 (mỗi lần dùng sẽ giảm 1)"
                  />
                  <p className="text-xs text-slate-500 mt-1">Để trống = không giới hạn số lượng. Mỗi đơn hàng sử dụng mã sẽ trừ đi 1.</p>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="VD: Mã giảm giá dành cho khách hàng mới..."
                    rows={2}
                    maxLength={500}
                  />
                </div>

                {/* Trạng thái */}
                <div className="bg-slate-50 p-4 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={couponForm.isActive}
                      onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 cursor-pointer accent-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Kích hoạt mã giảm giá</p>
                      <p className="text-xs text-slate-600">
                        {couponForm.isActive ? '✅ Mã có thể được sử dụng' : '🔒 Mã tạm vô hiệu hóa'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponModal(false);
                      setEditingCoupon(null);
                      setCouponForm({
                        code: '',
                        type: 'PERCENTAGE',
                        value: '',
                        minOrder: '',
                        maxDiscount: '',
                        validFrom: '',
                        validTo: '',
                        usageLimit: '',
                        description: '',
                        isActive: true,
                      });
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Ticket size={18} />
                    {editingCoupon ? '💾 Cập nhật' : '➕ Thêm'} mã giảm giá
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
