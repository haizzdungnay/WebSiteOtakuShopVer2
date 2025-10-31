'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  slug: string;
  sku: string;
  stock: number;
  category: string;
  description: string;
  specifications: Record<string, string>;
  saleEndsAt?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Mock product data - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProduct: Product = {
        id: '1',
        name: 'Nendoroid Hatsune Miku: Snow Miku 2024 Ver.',
        price: 1500000,
        discountPrice: 1200000,
        image: '/images/products/product-1.jpg',
        images: [
          '/images/products/product-1.jpg',
          '/images/products/product-2.jpg',
          '/images/products/product-3.jpg',
          '/images/products/product-4.jpg',
        ],
        slug: slug,
        sku: 'GSC-NEN-001',
        stock: 15,
        category: 'Nendoroid',
        description: `Mô hình Nendoroid Hatsune Miku phiên bản Snow Miku 2024 được sản xuất bởi Good Smile Company.

Sản phẩm cao khoảng 10cm, với khả năng tháo rời và thay đổi tư thế linh hoạt. Đi kèm với nhiều phụ kiện như mặt thay đổi biểu cảm, tay thay đổi, và các vật phẩm trang trí theo chủ đề mùa đông.

Đây là phiên bản giới hạn chỉ có trong sự kiện Snow Miku 2024, rất được yêu thích bởi các fan của Hatsune Miku và người sưu tập figure.`,
        specifications: {
          'Nhà sản xuất': 'Good Smile Company',
          'Series': 'Nendoroid',
          'Chất liệu': 'ABS & PVC',
          'Chiều cao': 'Khoảng 10cm',
          'Trọng lượng': '200g',
          'Xuất xứ': 'Nhật Bản',
          'Ngày phát hành': 'Tháng 2/2024',
          'Độ tuổi khuyến nghị': '15+',
        },
        saleEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setProduct(mockProduct);
      setLoading(false);

      // Mock related products
      setRelatedProducts([
        {
          id: '2',
          name: 'Nendoroid Miku: Winter Ver.',
          price: 1400000,
          image: '/images/products/product-2.jpg',
          slug: 'nendoroid-miku-winter',
          sku: 'GSC-NEN-002',
          stock: 10,
          category: 'Nendoroid',
          description: '',
          specifications: {},
        },
        {
          id: '3',
          name: 'figma Hatsune Miku',
          price: 1800000,
          discountPrice: 1600000,
          image: '/images/products/product-3.jpg',
          slug: 'figma-hatsune-miku',
          sku: 'GSC-FIG-001',
          stock: 5,
          category: 'figma',
          description: '',
          specifications: {},
        },
        {
          id: '4',
          name: 'Scale Figure Miku 1/7',
          price: 4500000,
          image: '/images/products/product-4.jpg',
          slug: 'scale-miku-1-7',
          sku: 'GSC-SCL-001',
          stock: 3,
          category: 'Scale Figure',
          description: '',
          specifications: {},
        },
      ]);
    }, 500);
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!product?.saleEndsAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.saleEndsAt!).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        slug: product.slug,
      });
    }
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
          <Link href="/products" className="text-accent-red hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-accent-red">Sản phẩm</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              {/* Main Image */}
              <div className="relative w-full aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || product.image}
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
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-accent-red' : 'border-gray-200 hover:border-gray-300'
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
                    className={`pb-3 font-semibold transition-colors ${
                      activeTab === 'description'
                        ? 'text-accent-red border-b-2 border-accent-red'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mô tả sản phẩm
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`pb-3 font-semibold transition-colors ${
                      activeTab === 'specifications'
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
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-3 border-b border-gray-100 last:border-0">
                      <span className="font-semibold text-gray-900 w-1/3">{key}:</span>
                      <span className="text-gray-700 w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Price */}
              <div className="mb-4">
                {product.discountPrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-accent-red">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-accent-red">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Sale Countdown */}
              {product.saleEndsAt && discount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-red-800 mb-2">⏰ Ưu đãi kết thúc sau:</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="bg-red-600 text-white rounded py-1 font-bold text-lg">
                        {timeLeft.days}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Ngày</div>
                    </div>
                    <div>
                      <div className="bg-red-600 text-white rounded py-1 font-bold text-lg">
                        {timeLeft.hours}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Giờ</div>
                    </div>
                    <div>
                      <div className="bg-red-600 text-white rounded py-1 font-bold text-lg">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Phút</div>
                    </div>
                    <div>
                      <div className="bg-red-600 text-white rounded py-1 font-bold text-lg">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Giây</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="border-t border-b border-gray-200 py-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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
                  disabled={product.stock === 0}
                  className="w-full bg-accent-red text-white py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  THÊM VÀO GIỎ
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Yêu thích
                  </button>
                  <button className="border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
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
      </div>
    </div>
  );
}
