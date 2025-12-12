'use client'

import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'

// Base fetch function with auth
async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const csrfToken = Cookies.get('csrf-token') || ''

    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...options.headers,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Có lỗi xảy ra' }
    }

    return { success: true, data: result.data || result }
  } catch (error) {
    console.error('Admin API error:', error)
    return { success: false, error: 'Không thể kết nối đến máy chủ' }
  }
}

// ============ PRODUCTS ============

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  stockQuantity: number
  images: string[]
  isActive: boolean
  featured: boolean
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  summary: {
    total: number
    active: number
    inactive: number
    outOfStock: number
    lowStock: number
    inStock: number
  }
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  comparePrice?: number | null
  categoryId: string
  stockQuantity: number
  images: string[]
  isActive?: boolean
  featured?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export function useAdminProducts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProducts = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    isActive?: string
    stockStatus?: string
  }) => {
    setLoading(true)
    setError(null)

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params?.isActive) searchParams.set('isActive', params.isActive)
    if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus)

    const result = await adminFetch<ProductsResponse>(
      `/api/admin/products?${searchParams.toString()}`
    )

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải danh sách sản phẩm')
    }
    return result
  }, [])

  const createProduct = useCallback(async (data: CreateProductData) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tạo sản phẩm')
    }
    return result
  }, [])

  const updateProduct = useCallback(async (id: string, data: UpdateProductData) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch<Product>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể cập nhật sản phẩm')
    }
    return result
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể xóa sản phẩm')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

// ============ ORDERS ============

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email: string
    fullName: string
    avatar?: string
  }
  _count: {
    orderItems: number
  }
}

export interface OrdersResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  summary: {
    total: number
    totalRevenue: number
    byStatus: Record<string, number>
  }
}

export function useAdminOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getOrders = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }) => {
    setLoading(true)
    setError(null)

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom)
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo)

    const result = await adminFetch<OrdersResponse>(
      `/api/admin/orders?${searchParams.toString()}`
    )

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải danh sách đơn hàng')
    }
    return result
  }, [])

  const updateOrderStatus = useCallback(async (
    id: string,
    status: string,
    options?: { trackingCode?: string; carrier?: string; adminNote?: string }
  ) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...options }),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể cập nhật trạng thái đơn hàng')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getOrders,
    updateOrderStatus,
  }
}

// ============ REVIEWS ============

export interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  images: string[]
  isApproved: boolean
  isPinned: boolean
  isVerified: boolean
  helpfulCount: number
  unhelpfulCount: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    fullName: string
    avatar?: string
  }
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
  order?: {
    id: string
    orderNumber: string
    createdAt: string
  }
}

export interface ReviewsResponse {
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  summary: {
    total: number
    pending: number
    approved: number
    pinned: number
    byRating: Record<number, number>
  }
}

export function useAdminReviews() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getReviews = useCallback(async (params?: {
    page?: number
    limit?: number
    isApproved?: string
    isPinned?: string
    rating?: number
  }) => {
    setLoading(true)
    setError(null)

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.isApproved) searchParams.set('isApproved', params.isApproved)
    if (params?.isPinned) searchParams.set('isPinned', params.isPinned)
    if (params?.rating) searchParams.set('rating', String(params.rating))

    const result = await adminFetch<ReviewsResponse>(
      `/api/admin/reviews?${searchParams.toString()}`
    )

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải danh sách đánh giá')
    }
    return result
  }, [])

  const updateReview = useCallback(async (id: string, data: {
    isApproved?: boolean
    isPinned?: boolean
  }) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể cập nhật đánh giá')
    }
    return result
  }, [])

  const deleteReview = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể xóa đánh giá')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getReviews,
    updateReview,
    deleteReview,
  }
}

// ============ CATEGORIES ============

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

export interface CategoriesResponse {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useAdminCategories() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCategories = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    setLoading(true)
    setError(null)

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)

    const result = await adminFetch<CategoriesResponse>(
      `/api/admin/categories?${searchParams.toString()}`
    )

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải danh sách danh mục')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getCategories,
  }
}

// ============ ANNOUNCEMENTS ============

export interface Announcement {
  id: string
  title: string
  summary: string
  content?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AnnouncementsResponse {
  announcements: Announcement[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useAdminAnnouncements() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAnnouncements = useCallback(async (params?: {
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    setError(null)

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))

    const result = await adminFetch<AnnouncementsResponse>(
      `/api/admin/announcements?${searchParams.toString()}`
    )

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải danh sách thông báo')
    }
    return result
  }, [])

  const createAnnouncement = useCallback(async (data: {
    title: string
    summary: string
    content?: string
    isActive?: boolean
  }) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch<Announcement>('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tạo thông báo')
    }
    return result
  }, [])

  const updateAnnouncement = useCallback(async (id: string, data: {
    title?: string
    summary?: string
    content?: string
    isActive?: boolean
  }) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch<Announcement>(`/api/admin/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể cập nhật thông báo')
    }
    return result
  }, [])

  const deleteAnnouncement = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const result = await adminFetch(`/api/admin/announcements/${id}`, {
      method: 'DELETE',
    })

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể xóa thông báo')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  }
}

// ============ DASHBOARD STATS ============

export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalCustomers: number
  customersGrowth: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
}

export function useAdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await adminFetch<DashboardStats>('/api/admin/dashboard/stats')

    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Không thể tải thống kê')
    }
    return result
  }, [])

  return {
    loading,
    error,
    getStats,
  }
}
