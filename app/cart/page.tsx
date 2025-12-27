'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, X, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-primary">
                Trang chủ
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-primary font-medium">Giỏ hàng</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Giỏ hàng của bạn ({getTotalItems()} sản phẩm)
          </h1>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {items.length} sản phẩm
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Xóa tất cả
                  </button>
                </div>

                {/* Items List */}
                {items.map((item) => {
                  const displayPrice = item.discountPrice || item.price;
                  const itemTotal = displayPrice * item.quantity;
                  
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <Link href={`/products/${item.slug}`}>
                          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || '/images/placeholder.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/products/${item.slug}`}>
                              <h3 className="font-medium text-gray-900 hover:text-accent-red transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <X size={20} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="mt-2">
                            <span className="text-accent-red font-bold text-lg">
                              {formatPrice(displayPrice)}
                            </span>
                            {item.discountPrice && item.price > item.discountPrice && (
                              <span className="text-gray-400 line-through text-sm ml-2">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-base font-medium w-10 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Thành tiền</p>
                              <p className="font-bold text-accent-red">
                                {formatPrice(itemTotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Tóm tắt đơn hàng
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-accent-red">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href={user ? "/checkout" : "/login?redirect=/checkout"}
                    className="block w-full py-3 text-center bg-accent-red text-white font-semibold rounded-lg hover:bg-red-600 transition-colors mb-3"
                  >
                    TIẾN HÀNH THANH TOÁN
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>

                  {/* Login prompt */}
                  {!user && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                      <Link href="/login" className="text-accent-red hover:underline">
                        Đăng nhập
                      </Link>{' '}
                      để đồng bộ giỏ hàng và nhận ưu đãi
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
