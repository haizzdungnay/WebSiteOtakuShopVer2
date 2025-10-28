'use client';

import Link from 'next/link';
import { Gift, Package, ShoppingBag, Box, Boxes, Backpack, ChevronRight } from 'lucide-react';

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  hasSubmenu?: boolean;
}

const menuItems: SidebarItem[] = [
  {
    href: '/new-releases',
    icon: <Gift size={20} className="text-accent-red" />,
    label: 'NEW RELEASES !!!',
    badge: 'hot',
  },
  {
    href: '/in-stock',
    icon: <Package size={20} className="text-green-600" />,
    label: 'NOW In Stock!',
  },
  {
    href: '/products',
    icon: <ShoppingBag size={20} className="text-blue-600" />,
    label: 'ALL PRODUCTS',
  },
  {
    href: '/pvc-figure',
    icon: <Box size={20} />,
    label: 'PVC Figure',
    hasSubmenu: true,
  },
  {
    href: '/resin-figure',
    icon: <Box size={20} />,
    label: 'RESIN Figure',
    hasSubmenu: true,
  },
  {
    href: '/blindbox',
    icon: <Boxes size={20} />,
    label: 'Blindbox Arttoy',
  },
  {
    href: '/gundam',
    icon: <Boxes size={20} />,
    label: 'Gundam / Plastic Model / Tokusatsu Toys',
  },
  {
    href: '/goods',
    icon: <Backpack size={20} />,
    label: 'Balo / Character Goods',
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
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
          fixed lg:static
          top-0 left-0 h-full
          w-72 bg-white
          shadow-lg lg:shadow-none
          z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="sidebar-link group"
                    onClick={onClose}
                  >
                    {item.icon}
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge === 'hot' && (
                      <span className="badge badge-hot text-xs">HOT</span>
                    )}
                    {item.hasSubmenu && (
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-primary"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Promotional Banner */}
          <div className="mt-6 bg-gradient-to-br from-primary to-primary-light rounded-lg p-4 text-white">
            <h3 className="font-bold text-lg mb-2">JOIN US</h3>
            <p className="text-sm mb-3">Nhận ưu đãi đặc biệt!</p>
            <Link
              href="/register"
              className="block bg-white text-primary text-center py-2 rounded font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
