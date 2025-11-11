'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronRight,
  User,
  Gift,
  Package,
  MapPin,
  ShoppingCart,
  Search,
  Phone,
  Mail,
  Clock,
  Heart,
  Star,
  TrendingUp,
  Truck,
  Shield
} from 'lucide-react';

interface PreOrder {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  status: 'in-stock' | 'pre-order' | 'coming-soon';
  discount?: number;
  isNew?: boolean;
  isHot?: boolean;
  rating?: number;
  soldCount?: number;
}

// Mock data với nhiều sản phẩm hơn
const mockPreOrders: PreOrder[] = [
  {
    id: '1',
    name: 'Hatsune Miku - Sakura Miku 2024',
    price: 595000,
    originalPrice: 720000,
    image: 'https://via.placeholder.com/300x400/FFB6C1/FFFFFF?text=Miku+2024',
    brand: 'Good Smile Company',
    status: 'pre-order',
    discount: 17,
    isNew: true,
    isHot: true,
    rating: 4.8,
    soldCount: 234
  },
  {
    id: '2',
    name: 'Nendoroid Chainsaw Man - Denji',
    price: 720000,
    image: 'https://via.placeholder.com/300x400/FFC0CB/FFFFFF?text=Chainsaw+Man',
    brand: 'Good Smile Company',
    status: 'pre-order',
    isHot: true,
    rating: 4.9,
    soldCount: 189
  },
  {
    id: '3',
    name: 'Nendoroid Demon Slayer - Nezuko',
    price: 680000,
    image: 'https://via.placeholder.com/300x400/FFE5ED/FFFFFF?text=Nezuko',
    brand: 'Good Smile Company',
    status: 'pre-order',
    isNew: true,
    rating: 4.7,
    soldCount: 156
  },
  {
    id: '4',
    name: 'Figma Spy x Family - Anya Forger',
    price: 1950000,
    originalPrice: 2200000,
    image: 'https://via.placeholder.com/300x400/FFD5DC/FFFFFF?text=Anya',
    brand: 'Max Factory',
    status: 'in-stock',
    discount: 11,
    rating: 5.0,
    soldCount: 312
  },
  {
    id: '5',
    name: 'Scale Figure - Rem - 1/7',
    price: 2800000,
    image: 'https://via.placeholder.com/300x400/FF8FAB/FFFFFF?text=Rem+1/7',
    brand: 'Emontoys',
    status: 'pre-order',
    isHot: true,
    rating: 4.9,
    soldCount: 78
  },
  {
    id: '6',
    name: 'Nendoroid Chainsaw Man - Power',
    price: 720000,
    image: 'https://via.placeholder.com/300x400/FFB6C1/FFFFFF?text=Power',
    brand: 'Good Smile Company',
    status: 'pre-order',
    rating: 4.8,
    soldCount: 167
  },
  {
    id: '7',
    name: 'Scale Figure - Miku Racing 2025',
    price: 3360000,
    originalPrice: 3800000,
    image: 'https://via.placeholder.com/300x400/FFC0CB/FFFFFF?text=Racing+Miku',
    brand: 'Good Smile Racing',
    status: 'pre-order',
    discount: 12,
    isNew: true,
    isHot: true,
    rating: 5.0,
    soldCount: 45
  },
  {
    id: '8',
    name: 'Pop Up Parade - Gojo Satoru',
    price: 750000,
    image: 'https://via.placeholder.com/300x400/FFE5ED/FFFFFF?text=Gojo',
    brand: 'Good Smile Company',
    status: 'in-stock',
    rating: 4.6,
    soldCount: 289
  },
];

const categories = [
  { name: 'NEW RELEASES !!', icon: '🆕', color: 'bg-accent-red' },
  { name: 'NOW In Stock!', icon: '✨', color: 'bg-green-500' },
  { name: 'ALL PRODUCTS', icon: '📦', color: 'bg-blue-500' },
  { name: 'PVC Figure', icon: '🎭', color: 'bg-purple-500' },
  { name: 'RESIN Figure', icon: '💎', color: 'bg-accent-pink' },
  { name: 'Bandai Army', icon: '🤖', color: 'bg-accent-orange' },
  { name: 'Gundam / Plastic Model / Valuables Toys', icon: '🛠️', color: 'bg-yellow-500' },
  { name: 'Bath / Character Goods', icon: '🎁', color: 'bg-indigo-500' },
  { name: 'Pre-order /Order', icon: '⏰', color: 'bg-teal-500' },
  { name: 'Khách hàng thân thiết', icon: '⭐', color: 'bg-amber-500' },
];

const filterTabs = [
  { id: 'all', label: 'Tất cả sản phẩm', icon: Package },
  { id: 'pre-order', label: 'Đặt trước', icon: Clock },
  { id: 'in-stock', label: 'Còn hàng', icon: ShoppingCart },
  { id: 'hot', label: 'Bán chạy', icon: TrendingUp },
];

export default function PreOrdersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
  };

  const filteredOrders = mockPreOrders.filter((order) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hot') return order.isHot;
    return order.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background-light">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-primary to-accent-red text-white py-2">
        <div className="container-custom">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>0399624662</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>135 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>luankhung2002@icloud.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>Giỏ hàng: 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-background-white shadow-md sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-accent-red">JH FIGURE</div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 pr-10 border-2 border-primary-light rounded-full focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  <User size={18} />
                  <span className="font-medium">{user.username}</span>
                </Link>
              ) : (
                <Link href="/login" className="btn-accent">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="border-t border-gray-200">
            <div className="flex items-center gap-6 py-3 text-sm font-medium overflow-x-auto">
              <Link href="/" className="nav-link text-text-gray hover:text-primary">
                🏠 Trang chủ
              </Link>
              <Link href="/gioi-thieu" className="nav-link text-text-gray hover:text-primary">
                ℹ️ Giới thiệu & bán hàng
              </Link>
              <Link href="/tra-cuu" className="nav-link text-text-gray hover:text-primary">
                🔍 Tra cứu đơn đặt trước
              </Link>
              <Link href="/tinh-gia" className="nav-link text-text-gray hover:text-primary">
                💰 Tính giá mua hộ hàng
              </Link>
              <Link href="/faq" className="nav-link text-text-gray hover:text-primary">
                ❓ FAQ
              </Link>
              <Link href="/tin-tuc" className="nav-link text-text-gray hover:text-primary">
                📰 Tin tức
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-background-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-gray hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link href="/profile" className="text-text-gray hover:text-primary">
              Tài khoản
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-primary font-medium">Đơn đặt trước & mua hộ</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-background-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              {/* User Info */}
              {user && (
                <div className="bg-gradient-to-r from-primary to-accent-red p-4 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-background-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{user.username}</h3>
                      <p className="text-xs opacity-90 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Menu */}
              <div className="p-2">
                <h3 className="font-bold text-text-dark px-3 py-2 mb-2">DANH MỤC SẢN PHẨM</h3>
                <nav className="space-y-1">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="sidebar-link"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Profile Menu */}
              <div className="border-t border-gray-200 p-2 mt-4">
                <h3 className="font-bold text-text-dark px-3 py-2 mb-2">TÀI KHOẢN</h3>
                <nav className="space-y-1">
                  <Link href="/profile" className="sidebar-link">
                    <User size={18} />
                    <span className="font-medium text-sm">Thông tin cá nhân</span>
                  </Link>
                  <Link href="/profile/loyalty" className="sidebar-link">
                    <Gift size={18} />
                    <span className="font-medium text-sm">Khách hàng thân thiết</span>
                  </Link>
                  <Link href="/profile/orders" className="sidebar-link">
                    <Package size={18} />
                    <span className="font-medium text-sm">Đơn thông thường</span>
                  </Link>
                  <Link href="/profile/preorders" className="sidebar-link active bg-gradient-to-r from-primary to-accent-red text-white">
                    <ShoppingCart size={18} />
                    <span className="font-medium text-sm">Đơn đặt trước & mua hộ</span>
                  </Link>
                  <Link href="/profile/addresses" className="sidebar-link">
                    <MapPin size={18} />
                    <span className="font-medium text-sm">Địa chỉ giao hàng</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Title */}
            <div className="bg-gradient-to-r from-primary to-accent-red rounded-lg p-6 mb-6 text-white">
              <h1 className="section-title text-white mb-2">
                <span className="section-title-bar bg-white"></span>
                Đơn Đặt Trước & Mua Hộ
              </h1>
              <p className="text-primary-50">Quản lý tất cả đơn hàng đặt trước và mua hộ của bạn</p>
            </div>

            {/* Info Banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-background-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">Miễn phí vận chuyển</h3>
                    <p className="text-sm text-text-gray">Đơn từ 500k</p>
                  </div>
                </div>
              </div>
              <div className="bg-background-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">Bảo hành chính hãng</h3>
                    <p className="text-sm text-text-gray">100% authentic</p>
                  </div>
                </div>
              </div>
              <div className="bg-background-white rounded-lg p-4 shadow-sm border-l-4 border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                    <Heart className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">Hỗ trợ 24/7</h3>
                    <p className="text-sm text-text-gray">Tư vấn nhiệt tình</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-background-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-3">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeFilter === tab.id
                      ? 'bg-gradient-to-r from-primary to-accent-red text-white shadow-lg scale-105'
                      : 'bg-background-light text-text-gray hover:bg-primary-50'
                      }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-background-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-gray">
                  Hiển thị <span className="font-bold text-text-dark">{filteredOrders.length}</span> sản phẩm
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredOrders.length === 0 ? (
              <div className="bg-background-white rounded-lg shadow-sm p-12 text-center">
                <div className="w-32 h-32 bg-background-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart size={64} className="text-text-gray" />
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-text-gray mb-6">Hãy bắt đầu đặt trước những sản phẩm yêu thích của bạn!</p>
                <Link href="/products" className="btn-accent inline-block">
                  Khám phá ngay
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOrders.map((product) => (
                  <div key={product.id} className="product-card group">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="badge badge-new">MỚI</span>
                      )}
                      {product.isHot && (
                        <span className="badge badge-hot">HOT</span>
                      )}
                      {product.discount && (
                        <span className="badge badge-sale">-{product.discount}%</span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-2 right-2 z-10 w-8 h-8 bg-background-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
                      <Heart size={16} />
                    </button>

                    {/* Product Image */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-background-light">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Brand */}
                      <div className="text-xs text-text-gray mb-1">{product.brand}</div>

                      {/* Product Name */}
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-text-dark mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating & Sold */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium text-text-dark">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-text-gray">Đã bán {product.soldCount}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="price-sale">
                          {product.price.toLocaleString('vi-VN')}₫
                        </span>
                        {product.originalPrice && (
                          <span className="price-original">
                            {product.originalPrice.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        {product.status === 'in-stock' ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            ✓ Còn hàng
                          </span>
                        ) : product.status === 'pre-order' ? (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            ⏰ Đặt trước
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-text-gray bg-background-light px-2 py-1 rounded">
                            🔜 Sắp về
                          </span>
                        )}

                        {/* Add to Cart Button */}
                        <button className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md">
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredOrders.length > 0 && (
              <div className="text-center mt-8">
                <button className="btn-accent">
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">JH FIGURE</h3>
              <p className="text-gray-400 text-sm mb-4">
                Chuyên cung cấp các sản phẩm Figure & Anime chính hãng, uy tín hàng đầu Việt Nam.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  f
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  📷
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  🐦
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-primary">Liên kết nhanh</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-primary">Giới thiệu</Link></li>
                <li><Link href="/products" className="hover:text-primary">Sản phẩm</Link></li>
                <li><Link href="/news" className="hover:text-primary">Tin tức</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-primary">Hỗ trợ khách hàng</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/shipping" className="hover:text-primary">Chính sách vận chuyển</Link></li>
                <li><Link href="/return" className="hover:text-primary">Chính sách đổi trả</Link></li>
                <li><Link href="/payment" className="hover:text-primary">Hướng dẫn thanh toán</Link></li>
                <li><Link href="/warranty" className="hover:text-primary">Chính sách bảo hành</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4 text-primary">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span>135 Đường ABC, Quận 1, TP.HCM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>0399624662</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>luankhung2002@icloud.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 JH Figure. All rights reserved. Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}