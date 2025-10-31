'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Search,
  Phone,
  MapPin,
  User,
  Menu,
  Package,
  HelpCircle,
  Newspaper,
  Grid3x3,
  Truck,
  Calculator,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartDropdown from './CartDropdown';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false);
      }
    };

    if (showUserDropdown || showCartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showCartDropdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Pink Header */}
      <div className="bg-primary py-3 px-4">
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-accent-red">JH</span>
                <span className="text-2xl font-bold text-gray-800">FIGURE</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl order-3 lg:order-2 w-full"
            >
              <div className="flex bg-white rounded-lg overflow-hidden border-2 border-white">
                <input
                  type="text"
                  placeholder="Bạn đang tìm gì..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 outline-none text-sm text-gray-700"
                />
                <button
                  type="submit"
                  className="bg-primary-light px-6 hover:bg-primary-dark transition-colors"
                >
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-4 order-2 lg:order-3 flex-wrap lg:flex-nowrap">
              {/* Hotline */}
              <div className="hidden lg:flex items-center gap-2 text-gray-800">
                <Phone size={20} className="text-accent-red" />
                <div>
                  <div className="text-xs text-gray-600">Hotline</div>
                  <div className="text-sm font-semibold">0396686826</div>
                </div>
              </div>

              {/* Hệ thống cửa hàng */}
              <Link
                href="/stores"
                className="hidden lg:flex items-center gap-2 text-gray-800 hover:text-accent-red transition-colors"
              >
                <MapPin size={20} />
                <div>
                  <div className="text-xs text-gray-600">Hệ thống</div>
                  <div className="text-sm font-semibold">cửa hàng</div>
                </div>
              </Link>

              {/* Đăng nhập / Đăng ký */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 text-gray-800 hover:text-accent-red transition-colors"
                  >
                    <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-xs text-gray-600">Xin chào</div>
                      <div className="text-sm font-semibold">{user.username}</div>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <User size={18} />
                          <span className="font-medium">Xem chi tiết</span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Package size={18} />
                          <span className="font-medium">Đơn hàng của tôi</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-accent-red font-medium"
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-gray-800 hover:text-accent-red transition-colors"
                >
                  <User size={20} />
                  <div className="hidden lg:block">
                    <div className="text-xs text-gray-600">Đăng nhập</div>
                    <div className="text-sm font-semibold">Đăng ký</div>
                  </div>
                </Link>
              )}

              {/* Giỏ hàng */}
              <div className="relative" ref={cartDropdownRef}>
                <button
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  className="relative flex items-center gap-2 bg-white px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <ShoppingCart size={20} className="text-accent-red" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-gray-800">
                    Giỏ hàng
                  </span>
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                  <CartDropdown onClose={() => setShowCartDropdown(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Black Navigation Bar */}
      <nav className="bg-black text-white">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto">
            {/* Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors whitespace-nowrap font-semibold"
            >
              <Grid3x3 size={18} />
              <span>MENU</span>
            </button>

            {/* Nav Items */}
            <NavLink href="/giao-hang" icon={<Truck size={18} />}>
              Giao hàng & bảo hành
            </NavLink>
            <NavLink href="/tra-cuu" icon={<Search size={18} />}>
              Tra cứu đơn đặt trước
            </NavLink>
            <NavLink href="/tinh-gia" icon={<Calculator size={18} />}>
              Tính giá gom hàng
            </NavLink>
            <NavLink href="/faq" icon={<HelpCircle size={18} />}>
              FAQ
            </NavLink>
            <NavLink href="/tin-tuc" icon={<Newspaper size={18} />}>
              Tin tức
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors whitespace-nowrap text-sm"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
