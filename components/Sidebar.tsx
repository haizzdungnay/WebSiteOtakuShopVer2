'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Gift,
  Package,
  ShoppingBag,
  Percent,
  FolderOpen,
  User,
  ChevronRight,
  Heart,
  MapPin,
  LogOut,
  LogIn
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [submenuTimeout, setSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length]);

  const handleMouseEnter = (itemKey: string) => {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      setSubmenuTimeout(null);
    }
    setHoveredItem(itemKey);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
      setSubmenuTimeout(null);
    }, 300);
    setSubmenuTimeout(timeout);
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? 'block' : 'hidden'} lg:block
          w-72 bg-white shadow-lg lg:shadow-none rounded-2xl
          self-start h-auto
        `}
      >
        <div className="p-4">
          <nav>
            <ul className="space-y-1">
              {/* NEW RELEASES */}
              <li>
                <Link
                  href="/new-releases"
                  className="sidebar-link group"
                  onClick={onClose}
                >
                  <Gift size={20} className="text-accent-red" />
                  <span className="flex-1 text-sm font-medium">NEW RELEASES !!!</span>
                  <span className="badge badge-hot text-xs">HOT</span>
                </Link>
              </li>

              {/* NOW In Stock */}
              <li>
                <Link
                  href="/in-stock"
                  className="sidebar-link group"
                  onClick={onClose}
                >
                  <Package size={20} className="text-green-600" />
                  <span className="flex-1 text-sm font-medium">NOW In Stock!</span>
                </Link>
              </li>

              {/* ALL PRODUCTS */}
              <li>
                <Link
                  href="/products"
                  className="sidebar-link group"
                  onClick={onClose}
                >
                  <ShoppingBag size={20} className="text-blue-600" />
                  <span className="flex-1 text-sm font-medium">ALL PRODUCTS</span>
                </Link>
              </li>

              {/* Đang giảm giá (On Sale) */}
              <li>
                <Link
                  href="/products?onSale=true"
                  className="sidebar-link group"
                  onClick={onClose}
                >
                  <Percent size={20} className="text-orange-500" />
                  <span className="flex-1 text-sm font-medium">Đang giảm giá</span>
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">SALE</span>
                </Link>
              </li>

              {/* Danh mục (Categories) */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('categories')}
                onMouseLeave={handleMouseLeave}
              >
                <div suppressHydrationWarning className="sidebar-link group cursor-pointer">
                  <FolderOpen size={20} className="text-purple-600" />
                  <span className="flex-1 text-sm font-medium">Danh mục</span>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1"
                  />
                </div>

                {/* Categories Submenu */}
                {hoveredItem === 'categories' && (
                  <div
                    suppressHydrationWarning
                    className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-[60] hidden lg:block"
                    onMouseEnter={() => handleMouseEnter('categories')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2 px-2 py-1 border-b border-gray-200">
                      <span className="font-bold text-gray-900 text-sm">Danh mục sản phẩm</span>
                    </div>
                    <ul className="space-y-1 max-h-80 overflow-y-auto">
                      {loadingCategories ? (
                        <li className="px-2 py-2 text-sm text-gray-500">Đang tải...</li>
                      ) : categories.length === 0 ? (
                        <li className="px-2 py-2 text-sm text-gray-500">Chưa có danh mục</li>
                      ) : (
                        categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/products?category=${category.slug}`}
                              className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-50 transition-colors group/sub"
                              onClick={onClose}
                            >
                              <span className="text-sm text-gray-700 group-hover/sub:text-accent-red transition-colors">
                                {category.name}
                              </span>
                              {category._count?.products !== undefined && (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {category._count.products}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <Link
                        href="/products"
                        className="block text-center text-sm text-accent-red font-semibold hover:underline"
                        onClick={onClose}
                      >
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Trang cá nhân (Profile) */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="sidebar-link group cursor-pointer">
                  <User size={20} className="text-blue-500" />
                  <span className="flex-1 text-sm font-medium">Trang cá nhân</span>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1"
                  />
                </div>

                {/* Profile Submenu */}
                {hoveredItem === 'profile' && (
                  <div
                    className="absolute left-full top-0 ml-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[60] hidden lg:block"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.fullName || 'User'} 
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{user.fullName || 'Người dùng'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>

                        {/* Profile Links */}
                        <ul className="space-y-1">
                          <li>
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <User size={18} className="text-accent-red" />
                              <span className="text-sm">Thông tin cá nhân</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile/orders"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <Package size={18} />
                              <span className="text-sm">Đơn hàng của tôi</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile/wishlist"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <Heart size={18} className="text-pink-500" />
                              <span className="text-sm">Sản phẩm yêu thích</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile/addresses"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <MapPin size={18} className="text-green-600" />
                              <span className="text-sm">Địa chỉ giao hàng</span>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                            >
                              <LogOut size={18} />
                              <span className="text-sm">Đăng xuất</span>
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      /* Not Logged In */
                      <div className="text-center py-4">
                        <User size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-4">Đăng nhập để xem thông tin cá nhân</p>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                          onClick={onClose}
                        >
                          <LogIn size={18} />
                          Đăng nhập
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
