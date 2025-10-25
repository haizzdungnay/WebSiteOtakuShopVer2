'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-bold">
              <span className="text-[#FF6B9D]">FIGURE</span>
              <span className="text-text-dark">STORE</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl order-3 lg:order-2 w-full lg:w-auto"
          >
            <div className="flex border-2 border-[#FF6B9D] rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-3 outline-none text-sm"
              />
              <button 
                type="submit"
                className="bg-[#FF6B9D] text-white px-6 hover:bg-[#FF8FAB] transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-5 order-2 lg:order-3">
            <Link href="/profile" className="hover:text-[#FF6B9D] transition-colors">
              <User size={24} />
            </Link>
            <Link href="/wishlist" className="hover:text-[#FF6B9D] transition-colors">
              <Heart size={24} />
            </Link>
            <Link href="/cart" className="relative hover:text-[#FF6B9D] transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-[#FF6B9D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-[#FFE5ED] border-t border-[#FFD5E2] ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="container-custom">
          <ul className="flex flex-col lg:flex-row lg:overflow-x-auto gap-1 py-2 lg:py-0">
            <NavItem href="/" icon="🏷️" label="NEW RELEASE !!!" />
            <NavItem href="/tim-hang" icon="⭐" label="ĐANG TÌM HÀNG" />
            <NavItem href="/products" icon="📦" label="ALL PRODUCTS" />
            <NavItem href="/pvc-figure" icon="🎁" label="PVC Figure" />
            <NavItem href="/bring-figure" icon="👶" label="BRING Figure" />
            <NavItem href="/banbox-valley" icon="🏆" label="Banbox Valley" />
            <NavItem href="/nendoroid" icon="🎲" label="Nendoroid" />
            <NavItem href="/scale-figures" icon="🎮" label="Scale Figures" />
            <NavItem href="/pre-order" icon="📋" label="Pre-order (Đặt)" />
            <NavItem href="/order-new" icon="🕐" label="ORDER NEW" />
          </ul>
        </div>
      </nav>
    </header>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <li>
      <Link 
        href={href}
        className="flex items-center gap-2 px-5 py-3 text-sm hover:bg-[#FF6B9D] hover:text-white rounded-lg transition-all whitespace-nowrap"
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  )
}
