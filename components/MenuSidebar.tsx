'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Gift, Package, ShoppingBag, Box, Boxes, Backpack } from 'lucide-react';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  hasSubmenu?: boolean;
}

interface SubMenuItem {
  label: string;
  href: string;
  count?: number;
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

const submenuData: Record<string, SubMenuItem[]> = {
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

const priceRanges = [
  { label: 'Dưới 500,000đ', value: '0-500000' },
  { label: '500,000đ - 2,000,000đ', value: '500000-2000000' },
  { label: '2,000,000đ - 5,000,000đ', value: '2000000-5000000' },
  { label: '5,000,000đ - 10,000,000đ', value: '5000000-10000000' },
];

const brands = ['Doki Kouyou', 'AmiAmi', 'Good Smile Company', 'Bandai', 'Kotobukiya'];

export default function MenuSidebar({ isOpen, onClose }: MenuSidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
            {menuItems.map((item, index) => (
              <li key={index}>
                <div>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 group"
                    onClick={() => {
                      if (!item.hasSubmenu) onClose();
                      else setExpandedItem(expandedItem === item.href ? null : item.href);
                    }}
                  >
                    {item.icon}
                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                    {item.badge === 'hot' && (
                      <span className="bg-accent-red text-white text-xs px-2 py-1 rounded-full font-bold">HOT</span>
                    )}
                    {item.hasSubmenu && (
                      <ChevronRight
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          expandedItem === item.href ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.hasSubmenu && expandedItem === item.href && submenuData[item.href] && (
                    <ul className="ml-10 mt-2 space-y-1">
                      {submenuData[item.href].map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 transition-colors group/sub"
                            onClick={onClose}
                          >
                            <span className="text-sm text-gray-700 group-hover/sub:text-accent-red transition-colors">
                              {subItem.label}
                            </span>
                            {subItem.count && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {subItem.count}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />

        {/* Filters Section */}
        <div className="px-4 pb-6">
          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3">Thương hiệu</h3>
            <div className="space-y-2">
              {brands.map((brand, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-bold text-sm mb-3">Lọc Giá</h3>
            <div className="space-y-2">
              {priceRanges.map((range, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
