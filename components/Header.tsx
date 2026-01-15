'use client';

import React from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartDropdown from './CartDropdown';
import MenuSidebar from './MenuSidebar';
import SearchSuggestions from './SearchSuggestions';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle scroll to hide/show pink header with debounce
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY;
          
          // Only trigger if scroll difference is significant (> 5px) to avoid jitter
          if (Math.abs(scrollDiff) > 5) {
            if (scrollDiff > 0 && currentScrollY > 80) {
              // Scrolling down & past threshold - hide header
              setHideHeader(true);
            } else if (scrollDiff < 0) {
              // Scrolling up - show header
              setHideHeader(false);
            }
            setLastScrollY(currentScrollY);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    if (showUserDropdown || showCartDropdown || showSearchSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showCartDropdown, showSearchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Menu Sidebar - outside header to avoid transform issues */}
      <MenuSidebar isOpen={showMenuSidebar} onClose={() => setShowMenuSidebar(false)} />
      
      <header 
        className={`sticky top-0 z-[100] transition-transform duration-300 ease-out ${
          hideHeader ? '-translate-y-[60px] lg:-translate-y-[72px]' : 'translate-y-0'
        }`} 
        suppressHydrationWarning
      >
        {/* Top Pink Header */}
        <div
          ref={headerRef}
          className="bg-primary dark:bg-dark-card py-2 lg:py-3 shadow-md transition-colors"
          suppressHydrationWarning
        >
        <div className="container-custom" suppressHydrationWarning>
          <div className="flex items-center justify-between gap-2 lg:gap-4" suppressHydrationWarning>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="Trang chủ Otaku Shop">
              <div className="flex items-center gap-1">
                <span className="text-xl lg:text-3xl font-bold text-accent-red">DN</span>
                <span className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">FIGURE</span>
              </div>
            </Link>

            {/* Search Bar - compact on mobile */}
            <div ref={searchRef} className="flex-1 min-w-0 max-w-[140px] lg:max-w-xl order-2 relative">
              <form onSubmit={handleSearch} role="search">
                <div className="flex bg-white dark:bg-dark-card rounded-lg overflow-hidden border-2 border-white dark:border-dark-border">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchSuggestions(true);
                    }}
                    onFocus={() => setShowSearchSuggestions(true)}
                    className="flex-1 w-full min-w-0 px-2 lg:px-4 py-2 lg:py-2.5 outline-none text-sm text-gray-700 dark:text-dark-text dark:bg-dark-card dark:placeholder-dark-muted"
                    aria-label="Tìm kiếm sản phẩm"
                  />
                  <button
                    type="submit"
                    title="Tìm kiếm"
                    aria-label="Tìm kiếm"
                    className="bg-primary-light px-3 lg:px-6 hover:bg-primary-dark transition-colors"
                  >
                    <Search size={18} className="text-white lg:w-5 lg:h-5" />
                  </button>
                </div>
              </form>

              {/* Search Suggestions */}
              {showSearchSuggestions && (
                <SearchSuggestions
                  query={searchQuery}
                  onClose={() => setShowSearchSuggestions(false)}
                  className="mt-1"
                />
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-4 order-3 flex-shrink-0">
              {/* Hotline */}
              <div className="hidden lg:flex items-center gap-2 text-gray-800 dark:text-dark-text">
                <Phone size={20} className="text-accent-red" aria-hidden="true" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-dark-muted">Hotline</div>
                  <a href="tel:0389836514" className="text-sm font-semibold hover:text-accent-red">0389836514</a>
                </div>
              </div>

              {/* Hệ thống cửa hàng */}
              <Link
                href="/stores"
                className="hidden lg:flex items-center gap-2 text-gray-800 dark:text-dark-text hover:text-accent-red transition-colors"
              >
                <MapPin size={20} aria-hidden="true" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-dark-muted">Hệ thống</div>
                  <div className="text-sm font-semibold">cửa hàng</div>
                </div>
              </Link>

              {/* Đăng nhập / Đăng ký */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 text-gray-800 dark:text-dark-text hover:text-accent-red transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username || 'User'}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-dark-border"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <div className="text-xs text-gray-600 dark:text-dark-muted">Xin chào</div>
                      <div className="text-sm font-semibold">{user.username}</div>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div
                      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-dark-border z-50"
                      role="menu"
                      aria-label="Menu người dùng"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username || 'User'}
                              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-dark-border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-accent-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">{user.username}</div>
                            <div className="text-sm text-gray-600 dark:text-dark-muted">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2" role="group">
                        {(user.role === 'admin' || user.role === 'staff') && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                            onClick={() => setShowUserDropdown(false)}
                            role="menuitem"
                          >
                            <ShieldCheck size={18} aria-hidden="true" />
                            <span className="font-medium">Trang quản trị</span>
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                          onClick={() => setShowUserDropdown(false)}
                          role="menuitem"
                        >
                          <User size={18} aria-hidden="true" />
                          <span className="font-medium">Xem chi tiết</span>
                        </Link>
                        <Link
                          href="/profile/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                          onClick={() => setShowUserDropdown(false)}
                          role="menuitem"
                        >
                          <Package size={18} aria-hidden="true" />
                          <span className="font-medium">Đơn hàng của tôi</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-accent-red font-medium"
                          role="menuitem"
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
                  className="flex items-center gap-2 text-gray-800 dark:text-dark-text hover:text-accent-red transition-colors"
                >
                  <User size={20} aria-hidden="true" />
                  <div className="hidden lg:block">
                    <div className="text-xs text-gray-600 dark:text-dark-muted">Đăng nhập</div>
                    <div className="text-sm font-semibold">Đăng ký</div>
                  </div>
                </Link>
              )}

              {/* Dark Mode Toggle */}
              <ThemeToggle variant="icon" className="hidden sm:flex" />

              <button
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                title="Giỏ hàng"
                aria-label="Giỏ hàng"
                className="relative flex items-center gap-1 lg:gap-2 bg-white px-2 lg:px-4 py-1.5 lg:py-2 rounded-full hover:bg-gray-50 transition-colors dark:bg-dark-card dark:hover:bg-dark-border"
              >
                <div className="relative">
                  <ShoppingCart size={18} className="text-accent-red lg:w-5 lg:h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center font-bold text-[10px] lg:text-xs">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-sm font-semibold text-gray-800 dark:text-dark-text">
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

      {/* Black Navigation Bar - hidden when menu sidebar is open */}
      <nav
        className={`bg-black dark:bg-slate-900 text-white relative transition-opacity duration-200 ${showMenuSidebar ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        role="navigation"
        aria-label="Menu chính"
      >
        <div className="container-custom">
          <div className="flex items-center">
            {/* Menu Button */}
            <div className="flex-shrink-0 mr-20">
              <button
                onClick={() => setShowMenuSidebar(true)}
                className="flex items-center justify-center gap-2 px-3 lg:px-4 py-3 hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors whitespace-nowrap font-semibold"
                title="Menu"
              >
                <Grid3x3 size={18} />
                <span className="hidden lg:inline">MENU</span>
              </button>
            </div>

            {/* Navigation Items - hiện trên mọi màn hình, mobile chỉ icon */}
            <div className="flex flex-1">
              <div className="flex items-center justify-around lg:justify-between w-full">
                <NavLink href="/in-stock" icon={<Package size={18} />} title="Hàng sẵn có">
                  Hàng sẵn có
                </NavLink>
                <NavLink href="/giao-hang" icon={<Truck size={18} />} title="Giao hàng & bảo hành">
                  Giao hàng & bảo hành
                </NavLink>
                <NavLink href="/tra-cuu" icon={<Search size={18} />} title="Tra cứu đơn đặt trước">
                  Tra cứu đơn đặt trước
                </NavLink>
                <NavLink href="/tinh-gia" icon={<Calculator size={18} />} title="Tính giá gom hàng">
                  Tính giá gom hàng
                </NavLink>
                <NavLink href="/faq" icon={<HelpCircle size={18} />} title="FAQ">
                  FAQ
                </NavLink>
                <NavLink href="/tin-tuc" icon={<Newspaper size={18} />} title="Tin tức">
                  Tin tức
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}

function NavLink({
  href,
  icon,
  children,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-2 lg:px-3 py-3 hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors whitespace-nowrap text-sm"
      title={title}
    >
      {icon}
      <span className="hidden lg:inline">{children}</span>
    </Link>
  );
}
