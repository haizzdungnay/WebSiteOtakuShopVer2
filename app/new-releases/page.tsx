'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Grid3x3, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Lu Guang Beautiful Blessed World Kotobukiya | Code Seraph - 1/7 Scale Figure | Original',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400&h=400&fit=crop',
    badge: 'new',
    brand: 'Kotobukiya',
    status: 'coming-soon',
  },
  {
    id: 2,
    name: 'Goodsmile Pop Up Parade Kamisato Ayaka Genshin Impact',
    price: 530000,
    image: 'https://images.unsplash.com/photo-1589395937658-0ed92c64f36f?w=400&h=400&fit=crop',
    badge: 'new',
    brand: 'Good Smile Company',
    status: 'coming-soon',
  },
  {
    id: 3,
    name: 'Complete Figure Sword Art Online Extra Motions Asuna - White Dragon Tamer',
    price: 530000,
    image: 'https://images.unsplash.com/photo-1589397809827-876d8b33e1f1?w=400&h=400&fit=crop',
    badge: 'new',
    brand: 'FuRyu',
    status: 'coming-soon',
  },
  {
    id: 4,
    name: 'MODEROID Lancelot Code Geass',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1589397731219-94a0e8fb81c6?w=400&h=400&fit=crop',
    badge: 'new',
    brand: 'Good Smile Company',
    status: 'coming-soon',
  },
  {
    id: 5,
    name: 'Pop Up Parade Emilia School Uniform Ver. - Re:ZERO',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop',
    badge: 'hot',
    brand: 'Good Smile Company',
    status: 'coming-soon',
  },
  {
    id: 6,
    name: 'figma Kazuki One Punch Man',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1589397797070-1c4a33ff2e85?w=400&h=400&fit=crop',
    badge: 'new',
    brand: 'Max Factory',
    status: 'coming-soon',
  },
];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Sắp xếp' },
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá: Tăng dần' },
  { value: 'price-desc', label: 'Giá: Giảm dần' },
  { value: 'name-asc', label: 'A-Z' },
];

export default function NewReleasesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Sort products
  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const brands = ['Good Smile Company', 'Kotobukiya', 'FuRyu', 'Max Factory', 'Bandai', 'ECOGG'];
  const categories = ['Nendoroid', 'figma', 'Pop Up Parade', 'Scale 1/7', 'Scale 1/8', 'Prize Figure'];
  const releaseTypes = ['Pre-Order', 'Order'];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-2 p-4">
          {/* Banner Images Grid */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative h-full">
              <Image
                src={`https://images.unsplash.com/photo-${1578632000000 + i * 100000}-0ed92c64f36f?w=300&h=400&fit=crop`}
                alt={`Banner ${i}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/70 flex items-center">
          <div className="container-custom">
            <div className="text-white max-w-xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                NEW<br />RELEASES
              </h1>
              <p className="text-lg md:text-xl mb-6">NHỮNG MÓN HÌNH MỚI PHÁT HÀNH</p>
              <Link
                href="#products"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-accent-red">Trang chủ</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">NEW RELEASES !!!</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8" id="products">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Hàng mới phát hành</h2>

              {/* Release Type */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between font-bold text-base mb-3">
                  <span>Hạng đặt trước</span>
                  <ChevronRight size={20} className="transform rotate-90" />
                </button>
                <div className="space-y-2">
                  {releaseTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Filters */}
              <div className="mb-6 border-t pt-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date" className="rounded-full" />
                    <span className="text-sm">Phát hành 2025/10</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="date" className="rounded-full" />
                    <span className="text-sm">Phát hành 2025/12</span>
                  </label>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 border-t pt-6">
                <button className="w-full flex items-center justify-between font-bold text-base mb-3">
                  <span>Thương hiệu</span>
                  <ChevronRight size={20} className="transform rotate-90" />
                </button>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 border-t pt-6">
                <button className="w-full flex items-center justify-between font-bold text-base mb-3">
                  <span>Lọc Giá</span>
                  <ChevronRight size={20} className="transform rotate-90" />
                </button>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Dưới 500,000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">500,000đ - 2,000,000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">2,000,000đ - 5,000,000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">5,000,000đ - 10,000,000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Trên 10,000,000đ</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="border-t pt-6">
                <button className="w-full flex items-center justify-between font-bold text-base mb-3">
                  <span>Loại</span>
                  <ChevronRight size={20} className="transform rotate-90" />
                </button>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-gray-600">
                  Hiển thị <span className="font-semibold text-gray-900">{sortedProducts.length}</span> sản phẩm
                </div>
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                    >
                      {sortOptions.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent-red text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Grid3x3 size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent-red text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  slug={`product-${product.id}`}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  badge={product.badge as 'hot' | 'new' | 'sale' | undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Trước
                </button>
                <button className="px-4 py-2 bg-accent-red text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
