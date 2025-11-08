'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Package, ShoppingBag, Box, Boxes, Backpack, ChevronRight } from 'lucide-react';

interface SidebarItem {
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

const menuItems: SidebarItem[] = [
  { href: '/new-releases', icon: <Gift size={20} className="text-accent-red" />, label: 'NEW RELEASES !!!', badge: 'hot' },
  { href: '/in-stock', icon: <Package size={20} className="text-green-600" />, label: 'NOW In Stock!' },
  { href: '/products', icon: <ShoppingBag size={20} className="text-blue-600" />, label: 'ALL PRODUCTS' },
  { href: '/pvc-figure', icon: <Box size={20} />, label: 'PVC Figure', hasSubmenu: true },
  { href: '/resin-figure', icon: <Box size={20} />, label: 'RESIN Figure', hasSubmenu: true },
  { href: '/blindbox', icon: <Boxes size={20} />, label: 'Blindbox Arttoy' },
  { href: '/gundam', icon: <Boxes size={20} />, label: 'Gundam / Plastic Model / Tokusatsu Toys' },
  { href: '/goods', icon: <Backpack size={20} />, label: 'Balo / Character Goods' },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Overlay (có thể bỏ nếu không cần) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar: KHÔNG fixed, sẽ cuộn theo trang */}
      <aside
        className={`
          ${isOpen ? 'block' : 'hidden'} lg:block
          w-72 bg-white shadow-lg lg:shadow-none
        `}
      >
        <div className="p-4">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.hasSubmenu && setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
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
                        className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </Link>

                  {/* Submenu (hover desktop) */}
                  {item.hasSubmenu && hoveredItem === item.href && submenuData[item.href] && (
                    <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-[60] hidden lg:block">
                      <div className="mb-2 px-2 py-1 border-b border-gray-200">
                        <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                      </div>
                      <ul className="space-y-1">
                        {submenuData[item.href].map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-50 transition-colors group/sub"
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
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <Link
                          href={item.href}
                          className="block text-center text-sm text-accent-red font-semibold hover:underline"
                          onClick={onClose}
                        >
                          Xem tất cả →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* ĐÃ XÓA khối "JOIN US" */}
        </div>
      </aside>
    </>
  );
}
