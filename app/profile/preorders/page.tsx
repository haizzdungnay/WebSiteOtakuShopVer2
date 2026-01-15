'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  User,
  Package,
  Heart,
  MapPin,
  Gift,
  Clock,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

const menuItems = [
  { icon: User, label: 'Thông tin tài khoản', href: '/profile' },
  { icon: Package, label: 'Đơn hàng của tôi', href: '/profile/orders' },
  { icon: Heart, label: 'Sản phẩm yêu thích', href: '/profile/wishlist' },
  { icon: MapPin, label: 'Sổ địa chỉ', href: '/profile/addresses' },
  { icon: Gift, label: 'Đặt trước & Mua hộ', href: '/profile/preorders', active: true },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: Package },
  SHIPPING: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function PreOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'all'>('pending')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', { credentials: 'include' })
      const data = await response.json()
      if (data.success) {
        setOrders(data.data.orders || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'PENDING'
    if (activeTab === 'processing') return ['PROCESSING', 'SHIPPING'].includes(order.status)
    return true
  })

  const pendingCount = orders.filter(o => o.status === 'PENDING').length
  const processingCount = orders.filter(o => ['PROCESSING', 'SHIPPING'].includes(o.status)).length

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-500">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/profile" className="hover:text-red-500">Tài khoản</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-100">Đặt trước & Mua hộ</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <nav className="mt-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Đơn đặt trước & Mua hộ</h1>

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Đơn hàng đang chờ xử lý</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Các đơn hàng chờ xác nhận hoặc đang xử lý sẽ được hiển thị tại đây.
                      Bạn có thể theo dõi trạng thái đơn hàng realtime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'pending'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chờ xác nhận ({pendingCount})
                </button>
                <button
                  onClick={() => setActiveTab('processing')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'processing'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đang xử lý ({processingCount})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'all'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tất cả ({orders.length})
                </button>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {activeTab === 'pending'
                      ? 'Không có đơn hàng nào đang chờ xác nhận'
                      : activeTab === 'processing'
                      ? 'Không có đơn hàng nào đang xử lý'
                      : 'Bạn chưa có đơn hàng nào'}
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.PENDING
                    const StatusIcon = status.icon

                    return (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        {/* Order Header */}
                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Mã đơn: <span className="font-medium text-gray-900 dark:text-gray-100">{order.orderNumber}</span>
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex gap-4 mb-3 last:mb-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.product.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="font-medium text-gray-900 hover:text-red-500 line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  x{item.quantity} · {item.price.toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              +{order.items.length - 2} sản phẩm khác
                            </p>
                          )}
                        </div>

                        {/* Order Footer */}
                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Tổng tiền: </span>
                            <span className="font-bold text-red-500">
                              {order.totalAmount.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                          <Link
                            href={`/profile/orders`}
                            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                          >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
