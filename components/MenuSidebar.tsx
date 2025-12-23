'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  X,
  ChevronRight,
  Gift,
  Package,
  ShoppingBag,
  Percent,
  FolderOpen,
  User,
  Heart,
  MapPin,
  LogOut,
  LogIn
} from 'lucide-react';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export default function MenuSidebar({ isOpen, onClose }: MenuSidebarProps) {
  const { user, logout } = useAuth();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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

    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={24} className="text-accent-red" />
            <h2 className="text-lg font-bold">MENU</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {/* NEW RELEASES */}
            <li>
              <Link
                href="/new-releases"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={onClose}
              >
                <Gift size={20} className="text-accent-red" />
                <span className="flex-1 font-medium text-sm">NEW RELEASES !!!</span>
                <span className="bg-accent-red text-white text-xs px-2 py-1 rounded-full font-bold">HOT</span>
              </Link>
            </li>

            {/* NOW In Stock */}
            <li>
              <Link
                href="/in-stock"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={onClose}
              >
                <Package size={20} className="text-green-600" />
                <span className="flex-1 font-medium text-sm">NOW In Stock!</span>
              </Link>
            </li>

            {/* ALL PRODUCTS */}
            <li>
              <Link
                href="/products"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={onClose}
              >
                <ShoppingBag size={20} className="text-blue-600" />
                <span className="flex-1 font-medium text-sm">ALL PRODUCTS</span>
              </Link>
            </li>

            {/* Đang giảm giá (On Sale) */}
            <li>
              <Link
                href="/products?onSale=true"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={onClose}
              >
                <Percent size={20} className="text-orange-500" />
                <span className="flex-1 font-medium text-sm">Đang giảm giá</span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">SALE</span>
              </Link>
            </li>

            {/* Danh mục (Categories) */}
            <li>
              <div>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  onClick={() => setExpandedItem(expandedItem === 'categories' ? null : 'categories')}
                >
                  <FolderOpen size={20} className="text-purple-600" />
                  <span className="flex-1 font-medium text-sm text-left">Danh mục</span>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedItem === 'categories' ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {/* Categories Submenu */}
                {expandedItem === 'categories' && (
                  <ul className="ml-10 mt-2 space-y-1">
                    {loadingCategories ? (
                      <li className="px-3 py-2 text-sm text-gray-500">Đang tải...</li>
                    ) : categories.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-gray-500">Chưa có danh mục</li>
                    ) : (
                      categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${category.slug}`}
                            className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 transition-colors group/sub"
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
                )}
              </div>
            </li>

            {/* Trang cá nhân (Profile) */}
            <li>
              <div>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  onClick={() => setExpandedItem(expandedItem === 'profile' ? null : 'profile')}
                >
                  <User size={20} className="text-blue-500" />
                  <span className="flex-1 font-medium text-sm text-left">Trang cá nhân</span>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedItem === 'profile' ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {/* Profile Submenu */}
                {expandedItem === 'profile' && (
                  <div className="ml-4 mt-2 bg-blue-50 rounded-lg p-4">
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.fullName || 'Người dùng'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>

                        {/* Profile Links */}
                        <ul className="space-y-1">
                          <li>
                            <Link
                              href="/account"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <User size={18} className="text-accent-red" />
                              <span className="text-sm">Thông tin cá nhân</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/account/orders"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <Package size={18} />
                              <span className="text-sm">Đơn hàng của tôi</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/account/wishlist"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <Heart size={18} className="text-pink-500" />
                              <span className="text-sm">Sản phẩm yêu thích</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/account/addresses"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-gray-700"
                              onClick={onClose}
                            >
                              <MapPin size={18} className="text-green-600" />
                              <span className="text-sm">Địa chỉ giao hàng</span>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
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
                          href="/auth/login"
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
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
