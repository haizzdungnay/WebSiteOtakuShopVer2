'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  slug: string;
  productCode?: string;
  stockQuantity: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  description: string;
  shortDescription?: string;
  featured?: boolean;
  isActive?: boolean;
  // New detail fields
  seriesName?: string;
  brandName?: string;
  releaseDate?: string;
  msrpValue?: number;
  msrpCurrency?: string;
  features?: string;
  condition?: string;
  preorderStatus?: 'NONE' | 'PREORDER' | 'ORDER';
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  slug: string;
}

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error || 'Không tìm thấy sản phẩm');
          setProduct(null);
          return;
        }

        setProduct(data.data);

        // Fetch related products from same category
        if (data.data?.category?.slug) {
          const relatedResponse = await fetch(`/api/products?category=${data.data.category.slug}&limit=4`);
          const relatedData = await relatedResponse.json();
          if (relatedData.success && relatedData.data) {
            // Filter out current product and transform data
            const related = relatedData.data
              .filter((p: Product) => p.id !== data.data.id)
              .slice(0, 3)
              .map((p: Product) => ({
                id: p.id,
                name: p.name,
                price: Number(p.comparePrice) || Number(p.price),
                discountPrice: p.comparePrice ? Number(p.price) : undefined,
                image: p.images?.[0] || '/images/placeholder.jpg',
                slug: p.slug,
              }));
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discountPrice: product.comparePrice ? Number(product.price) : undefined,
      image: product.images?.[0] || '/images/placeholder.jpg',
      slug: product.slug,
    }, quantity);
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.comparePrice ? Number(product.price) : undefined,
        image: product.images?.[0] || '/images/placeholder.jpg',
        slug: product.slug,
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy sản phẩm'}
          </h2>
          <Link href="/products" className="text-accent-red hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Price logic: comparePrice is original, price is current/sale price
  const currentPrice = Number(product.price);
  const originalPrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link href="/products" className="hover:text-accent-red">Sản phẩm</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6">
              {/* Main Image */}
              <div className="relative w-full aspect-square mb-3 sm:mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-accent-red text-white px-3 py-1 rounded-full font-bold">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      title={`Xem ảnh ${idx + 1}`}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-accent-red' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs: Description & Specifications */}
            <div className="bg-white rounded-lg p-6 mt-6">
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-3 font-semibold transition-colors ${activeTab === 'description'
                      ? 'text-accent-red border-b-2 border-accent-red'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Mô tả sản phẩm
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`pb-3 font-semibold transition-colors ${activeTab === 'specifications'
                      ? 'text-accent-red border-b-2 border-accent-red'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Thông số kỹ thuật
                  </button>
                </div>
              </div>

              {activeTab === 'description' ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.productCode && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Mã sản phẩm:</span>
                      <span className="text-gray-700 w-2/3">{product.productCode}</span>
                    </div>
                  )}
                  {product.seriesName && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Series (Anime):</span>
                      <span className="text-gray-700 w-2/3">{product.seriesName}</span>
                    </div>
                  )}
                  {product.brandName && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Thương hiệu:</span>
                      <span className="text-gray-700 w-2/3">{product.brandName}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Danh mục:</span>
                      <span className="text-gray-700 w-2/3">{product.category.name}</span>
                    </div>
                  )}
                  {product.releaseDate && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Ngày phát hành:</span>
                      <span className="text-gray-700 w-2/3">
                        {new Date(product.releaseDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {product.msrpValue && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Giá hãng (MSRP):</span>
                      <span className="text-gray-700 w-2/3">
                        {product.msrpValue.toLocaleString()} {product.msrpCurrency || 'JPY'}
                      </span>
                    </div>
                  )}
                  {product.condition && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Tình trạng:</span>
                      <span className="text-gray-700 w-2/3">{product.condition}</span>
                    </div>
                  )}
                  {product.features && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Đặc điểm:</span>
                      <span className="text-gray-700 w-2/3 whitespace-pre-line">{product.features}</span>
                    </div>
                  )}
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-900 w-1/3">Kho hàng:</span>
                    <span className="text-gray-700 w-2/3">
                      {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                    </span>
                  </div>
                  {product.preorderStatus && product.preorderStatus !== 'NONE' && (
                    <div className="flex py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 w-1/3">Trạng thái:</span>
                      <span className={`w-2/3 font-semibold ${product.preorderStatus === 'PREORDER' ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                        {product.preorderStatus === 'PREORDER' ? 'Pre-order' : 'Đặt hàng từ nhà sản xuất'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 lg:sticky lg:top-24">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{product.name}</h1>

              {/* Price */}
              <div className="mb-3 sm:mb-4">
                {originalPrice ? (
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent-red">
                      {formatPrice(currentPrice)}
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent-red">
                    {formatPrice(currentPrice)}
                  </span>
                )}
              </div>

              {/* Sale Badge */}
              {discount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-red-800">🔥 Đang giảm giá {discount}%!</p>
                </div>
              )}

              {/* Product Info */}
              <div className="border-t border-b border-gray-200 py-4 mb-4 space-y-2 text-sm">
                {product.productCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã SP:</span>
                    <span className="font-semibold">{product.productCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span className={`font-semibold ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
                {product.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="font-semibold">{product.category.name}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    title="Giảm số lượng"
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    title="Số lượng sản phẩm"
                    className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    title="Tăng số lượng"
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="w-full bg-accent-red text-white py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  THÊM VÀO GIỎ
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleToggleWishlist}
                    className={`border-2 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isInWishlist(product.id)
                        ? 'border-accent-red text-accent-red bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <Heart
                      size={18}
                      className={isInWishlist(product.id) ? 'fill-accent-red' : ''}
                    />
                    {isInWishlist(product.id) ? 'Đã yêu thích' : 'Yêu thích'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Chia sẻ
                  </button>
                </div>
              </div>

              {/* Info Boxes */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3 text-sm">
                  <Truck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Miễn phí vận chuyển</div>
                    <div className="text-gray-600">Cho đơn hàng từ 500.000đ</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <RotateCcw className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Đổi trả trong 7 ngày</div>
                    <div className="text-gray-600">Nếu sản phẩm lỗi từ nhà sản xuất</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Shield className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Bảo hành chính hãng</div>
                    <div className="text-gray-600">Theo chính sách nhà sản xuất</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <CreditCard className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">Thanh toán linh hoạt</div>
                    <div className="text-gray-600">COD, Chuyển khoản, Ví điện tử</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  image={product.image}
                  slug={product.slug}
                />
              ))}
            </div>
          </div>
        )}

        {/* Review Section */}
        {product && (
          <ReviewSection productId={product.id} productName={product.name} />
        )}
      </div>
    </div>
  );
}
