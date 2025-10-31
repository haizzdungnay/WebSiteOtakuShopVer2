'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-900">Giỏ hàng của bạn</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Cart Items */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">Giỏ hàng trống</p>
          <p className="text-sm text-gray-500">Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.map((item) => {
              const displayPrice = item.discountPrice || item.price;
              return (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} onClick={onClose}>
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} onClick={onClose}>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-accent-red transition-colors mb-1">
                        {item.name}
                      </h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-red font-bold">
                        {formatPrice(displayPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-accent-red transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">Tổng cộng:</span>
              <span className="text-xl font-bold text-accent-red">
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full py-3 text-center border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                XEM GIỎ HÀNG
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-3 text-center bg-accent-red text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                THANH TOÁN
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
