'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid3x3, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Mock data - In production, this would come from API
const characterData: Record<string, {
  name: string;
  banner: string;
  description: string;
  series: string;
}> = {
  'frieren': {
    name: 'Frieren',
    banner: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200&h=400&fit=crop',
    description: 'Frieren: Beyond Journey\'s End',
    series: 'Frieren',
  },
  'miku': {
    name: 'Hatsune Miku',
    banner: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=400&fit=crop',
    description: 'Virtual Idol - Hatsune Miku',
    series: 'Vocaloid',
  },
};

const mockProducts = [
  {
    id: 1,
    name: 'Fern Battle with Lugner 1/7 - Frieren Beyond Journey\'s End',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400&h=400&fit=crop',
    badge: 'new',
    rating: 5,
    reviews: 12,
  },
  {
    id: 2,
    name: 'Aura - Sousou no Frieren Desktop Cute | Taito | Figure',
    price: 530000,
    image: 'https://images.unsplash.com/photo-1589395937658-0e d92c64f36f?w=400&h=400&fit=crop',
    discount: 15,
    rating: 4.5,
    reviews: 8,
  },
  {
    id: 3,
    name: 'Himmel - Sousou no Frieren Trio Try IT Figure | FuRyu',
    price: 530000,
    image: 'https://images.unsplash.com/photo-1589397809827-876d8b33e1f1?w=400&h=400&fit=crop',
    badge: 'preorder',
    rating: 5,
    reviews: 15,
  },
  {
    id: 4,
    name: 'Frieren Dress Ver. - Sousou no Frieren Careful Figure',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1589397731219-94a0 e8fb81c6?w=400&h=400&fit=crop',
    discount: 10,
    rating: 4.8,
    reviews: 20,
  },
  {
    id: 5,
    name: 'Relax Time Frieren - Sousou no Frieren | Bandai Spirits',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop',
    badge: 'hot',
    rating: 4.9,
    reviews: 25,
  },
  {
    id: 6,
    name: 'figma Himmel - Frieren Beyond Journey\'s End | Coin Merchandise',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1589397797070-1c4a33ff2e85?w=400&h=400&fit=crop',
    rating: 5,
    reviews: 18,
  },
];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá: Tăng dần' },
  { value: 'price-desc', label: 'Giá: Giảm dần' },
  { value: 'name-asc', label: 'A-Z' },
];

export default function CharacterPage({ params }: { params: Promise<{ character: string }> }) {
  const resolvedParams = use(params);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [_priceRange, _setPriceRange] = useState<[number, number]>([0, 10000000]); // reserved for future price filter
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const character = characterData[resolvedParams.character] || {
    name: resolvedParams.character,
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=400&fit=crop',
    description: resolvedParams.character,
    series: 'Unknown',
  };

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

  const brands = ['Good Smile Company', 'Mega House', 'FuRyu', 'Kotobukiya', 'ECOGG', 'SEGA', 'Magi Arts', 'Bandai Spirits'];
  const categories = ['Game Prize', 'Mini Figure', 'Scale 1/7', 'Plushie', 'Nendoroid', 'S.H.Figuarts', 'Portrait.Of.Pirates', 'LookUp'];
  const releaseTypes = ['Pre-Order', 'Order'];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      {/* Hero Banner */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${character.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30">
          <div className="container-custom h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{character.name}</h1>
              <p className="text-lg md:text-xl text-gray-200">{character.description}</p>
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-dark-card border-b dark:border-dark-border transition-colors">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-accent-red">Trang chủ</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link href="/pvc-figure" className="text-gray-600 hover:text-accent-red">PVC Figure</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link href="/pvc-figure/characters" className="text-gray-600 hover:text-accent-red">Characters</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{character.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6 sticky top-4">
              {/* Release Type */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between font-bold text-lg mb-3">
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

              {/* Brands */}
              <div className="mb-6 border-t pt-6">
                <button className="w-full flex items-center justify-between font-bold text-lg mb-3">
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
                <button className="w-full flex items-center justify-between font-bold text-lg mb-3">
                  <span>Lọc Giá</span>
                  <ChevronRight size={20} className="transform rotate-90" />
                </button>
                <div className="space-y-3">
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
                <button className="w-full flex items-center justify-between font-bold text-lg mb-3">
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
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-gray-600 dark:text-gray-400">
                  Hiển thị <span className="font-semibold text-gray-900 dark:text-gray-100">{sortedProducts.length}</span> sản phẩm
                </div>
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
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
                  discountPrice={product.discount ? product.price * (1 - product.discount / 100) : undefined}
                  image={product.image}
                  badge={product.badge as 'hot' | 'new' | 'sale' | undefined}
                  salePercentage={product.discount}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border">
                  Trước
                </button>
                <button className="px-4 py-2 bg-accent-red text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border">
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
