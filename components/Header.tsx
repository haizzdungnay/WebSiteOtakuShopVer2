'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Search,
  Phone,
  MapPin,
  User,
  Package,
  HelpCircle,
  Newspaper,
  Grid3x3,
  Truck,
  Calculator,
  Gift,
  ShoppingBag,
  Box,
  Boxes,
  Backpack,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartDropdown from './CartDropdown';

// Submenu data for mega menu
interface SubItem {
  label: string;
  href: string;
  count?: number;
}

const submenuData: Record<string, SubItem[]> = {
  '/pvc-figure': [
    { label: 'Nendoroid', href: '/pvc-figure/nendoroid', count: 150 },
    { label: 'figma', href: '/pvc-figure/figma', count: 85 },
    { label: 'Pop Up Parade', href: '/pvc-figure/pop-up-parade', count: 42 },
    { label: 'Scale Figure 1/7', href: '/pvc-figure/scale-1-7', count: 120 },
    { label: 'Scale Figure 1/8', href: '/pvc-figure/scale-1-8', count: 95 },
    { label: 'Prize Figure', href: '/pvc-figure/prize', count: 68 },
  ],
  '/resin-figure': [
    { label: 'GK Model Kit', href: '/resin-figure/gk-model', count: 45 },
    { label: 'Statue', href: '/resin-figure/statue', count: 32 },
    { label: 'Diorama', href: '/resin-figure/diorama', count: 28 },
    { label: 'Bust', href: '/resin-figure/bust', count: 15 },
    { label: 'Custom Figure', href: '/resin-figure/custom', count: 22 },
  ],
};

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  hasSubmenu?: boolean;
}

const menuItems: MenuItem[] = [
  { href: '/new-releases', icon: <Gift size={20} className="text-accent-red" />, label: 'NEW RELEASES !!!', badge: 'hot' },
  { href: '/in-stock', icon: <Package size={20} className="text-green-600" />, label: 'NOW In Stock!' },
  { href: '/products', icon: <ShoppingBag size={20} className="text-blue-600" />, label: 'ALL PRODUCTS' },
  { href: '/pvc-figure', icon: <Box size={20} />, label: 'PVC Figure', hasSubmenu: true },
  { href: '/resin-figure', icon: <Box size={20} />, label: 'RESIN Figure', hasSubmenu: true },
  { href: '/blindbox', icon: <Boxes size={20} />, label: 'Blindbox Arttoy' },
  { href: '/gundam', icon: <Boxes size={20} />, label: 'Gundam / Plastic Model / Tokusatsu Toys' },
  { href: '/goods', icon: <Backpack size={20} />, label: 'Balo / Character Goods' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
    };

    if (showUserDropdown || showCartDropdown || showMenuDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showCartDropdown, showMenuDropdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
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
      <nav className="bg-black text-white relative">
        <div className="container-custom overflow-visible">
          <div className="flex items-center gap-1 overflow-x-auto overflow-y-visible">
            {/* Menu Button with Dropdown */}
            <div
              className="relative"
              ref={menuDropdownRef}
              onMouseEnter={() => setShowMenuDropdown(true)}
              onMouseLeave={() => {
                setShowMenuDropdown(false);
                setHoveredMenu(null);
              }}
            >
              <button
                onClick={() => setShowMenuDropdown((v) => !v)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors whitespace-nowrap font-semibold"
              >
                <Grid3x3 size={18} />
                <span>MENU</span>
              </button>

              {/* Mega Menu Dropdown */}
              {showMenuDropdown && (
                <div className="absolute left-0 top-full mt-0 w-[280px] md:w-[600px] lg:w-[720px] bg-white rounded-b-lg shadow-2xl border border-gray-200 z-[100]">
                  <div className="flex">
                    {/* Left Column - Main Categories */}
                    <aside className="w-full md:w-64 lg:w-72 md:border-r border-gray-200 p-2">
                      <nav>
                        {menuItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 group"
                            onClick={() => setShowMenuDropdown(false)}
                            onMouseEnter={() => item.hasSubmenu && setHoveredMenu(item.href)}
                          >
                            {item.icon}
                            <span className="flex-1 font-medium text-sm">{item.label}</span>
                            {item.badge === 'hot' && (
                              <span className="bg-accent-red text-white text-xs px-2 py-1 rounded-full font-bold">HOT</span>
                            )}
                            {item.hasSubmenu && (
                              <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                            )}
                          </Link>
                        ))}
                      </nav>
                    </aside>

                    {/* Right Column - Submenu - Hidden on mobile, shown on md+ */}
                    <section className="hidden md:block flex-1 p-4 min-h-[300px]">
                      {hoveredMenu && submenuData[hoveredMenu] ? (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                            {menuItems.find(m => m.href === hoveredMenu)?.label}
                          </h3>
                          <ul className="grid grid-cols-2 gap-2">
                            {submenuData[hoveredMenu].map((sub, idx) => (
                              <li key={idx}>
                                <Link
                                  href={sub.href}
                                  className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 transition-colors group"
                                  onClick={() => setShowMenuDropdown(false)}
                                >
                                  <span className="text-sm text-gray-700 group-hover:text-accent-red transition-colors">
                                    {sub.label}
                                  </span>
                                  {sub.count && (
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                      {sub.count}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <Link
                              href={hoveredMenu}
                              className="block text-center text-sm text-accent-red font-semibold hover:underline"
                              onClick={() => setShowMenuDropdown(false)}
                            >
                              Xem tất cả {menuItems.find(m => m.href === hoveredMenu)?.label} →
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          Hover vào danh mục để xem sản phẩm
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              )}
            </div>

            {/* Centered Navigation Items */}
            <div className="flex-1">
              <div className="grid grid-flow-col auto-cols-max justify-center gap-10 md:gap-16 lg:gap-20">
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

            {/* Right Spacer for Visual Balance */}
            <div className="w-12"></div>
          </div>
        </div>
      </nav>
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
