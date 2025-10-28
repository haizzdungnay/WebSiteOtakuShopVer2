'use client';

import { useState } from 'react';
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

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();

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
                <div className="flex items-center gap-2 text-gray-800">
                  <User size={20} />
                  <div className="hidden lg:block">
                    <div className="text-xs text-gray-600">Xin chào</div>
                    <button
                      onClick={logout}
                      className="text-sm font-semibold hover:text-accent-red"
                    >
                      Đăng xuất
                    </button>
                  </div>
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
              <Link
                href="/cart"
                className="relative flex items-center gap-2 bg-white px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-accent-red" />
                  <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    0
                  </span>
                </div>
                <span className="hidden lg:block text-sm font-semibold text-gray-800">
                  Giỏ hàng
                </span>
              </Link>
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
