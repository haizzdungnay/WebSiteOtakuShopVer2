'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Package, TrendingUp, Users, Info, DollarSign, Weight } from 'lucide-react';

export default function ShippingCalculatorPage() {
  const [jpyPrice, setJpyPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{
    productCost: number;
    shippingCost: number;
    serviceFee: number;
    total: number;
    exchangeRate: number;
  } | null>(null);

  const stats = {
    customers: 2263,
    orders: 17767,
  };

  // Current exchange rate (mock)
  const EXCHANGE_RATE = 170; // 1 JPY = 170 VND
  const SERVICE_FEE_RATE = 0.1; // 10%
  const SHIPPING_RATE_PER_KG = 150000; // 150k VND per kg

  const calculateShipping = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(jpyPrice);
    const weightKg = parseFloat(weight);

    if (isNaN(price) || isNaN(weightKg) || price <= 0 || weightKg <= 0) {
      alert('Vui lòng nhập số hợp lệ!');
      return;
    }

    const productCost = price * EXCHANGE_RATE;
    const shippingCost = weightKg * SHIPPING_RATE_PER_KG;
    const serviceFee = (productCost + shippingCost) * SERVICE_FEE_RATE;
    const total = productCost + shippingCost + serviceFee;

    setResult({
      productCost,
      shippingCost,
      serviceFee,
      total,
      exchangeRate: EXCHANGE_RATE,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Tính giá gom hàng</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-red rounded-full mb-4">
            <Calculator size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tính giá gom hàng</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tính toán chi phí order và ship hàng từ Nhật Bản về Việt Nam
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <div className="text-sm opacity-90">Khách hàng</div>
                <div className="text-3xl font-bold">{stats.customers.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <div className="text-sm opacity-90">Đơn hàng</div>
                <div className="text-3xl font-bold">{stats.orders.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator size={24} className="text-accent-red" />
              Máy tính chi phí
            </h2>

            <form onSubmit={calculateShipping} className="space-y-6">
              {/* JPY Price Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nhập giá Yên sau thuế (¥)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={jpyPrice}
                    onChange={(e) => setJpyPrice(e.target.value)}
                    placeholder="Ví dụ: 5000"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Tỷ giá hiện tại: 1¥ = {EXCHANGE_RATE.toLocaleString()}đ
                </p>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cân nặng kiện hàng (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ví dụ: 0.5"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Phí ship: {SHIPPING_RATE_PER_KG.toLocaleString()}đ/kg
                </p>
              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp size={20} />
                Tính giá
              </button>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-6 p-6 bg-gradient-to-br from-accent-red to-red-600 rounded-lg text-white">
                <h3 className="text-lg font-bold mb-4">Kết quả tính toán:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Giá sản phẩm:</span>
                    <span className="font-semibold">{formatPrice(result.productCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Phí vận chuyển:</span>
                    <span className="font-semibold">{formatPrice(result.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Phí dịch vụ (10%):</span>
                    <span className="font-semibold">{formatPrice(result.serviceFee)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Tổng cộng:</span>
                      <span className="font-bold text-2xl">{formatPrice(result.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions & Formula */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Hướng dẫn sử dụng</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Nhập giá sản phẩm bằng Yên Nhật (đã bao gồm thuế)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Nhập cân nặng ước tính của kiện hàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Nhấn &quot;Tính giá&quot; để xem chi phí dự kiến</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Kết quả chỉ mang tính chất tham khảo</span>
                </li>
              </ul>
            </div>

            {/* Formula */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator size={20} className="text-accent-red" />
                Công thức tính
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-2">1. Giá sản phẩm (VND)</div>
                  <code className="text-accent-red">= Giá JPY × Tỷ giá ({EXCHANGE_RATE}đ)</code>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-2">2. Phí vận chuyển (VND)</div>
                  <code className="text-accent-red">
                    = Cân nặng (kg) × {SHIPPING_RATE_PER_KG.toLocaleString()}đ/kg
                  </code>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-2">3. Phí dịch vụ (VND)</div>
                  <code className="text-accent-red">= (Giá SP + Phí ship) × 10%</code>
                </div>

                <div className="bg-accent-red text-white p-4 rounded-lg">
                  <div className="font-bold mb-2">Tổng chi phí</div>
                  <code className="text-white">= Giá SP + Phí ship + Phí dịch vụ</code>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Lưu ý:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Tỷ giá có thể thay đổi theo thời gian thực</li>
                <li>• Phí ship thực tế phụ thuộc vào kích thước và trọng lượng</li>
                <li>• Một số sản phẩm có thể phát sinh phí đặc biệt</li>
                <li>• Liên hệ CSKH để được tư vấn chi tiết</li>
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Cần tư vấn thêm?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Liên hệ với chúng tôi để được hỗ trợ chi tiết
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:0396686826"
                  className="bg-accent-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Hotline: 0396 686 826
                </a>
                <a
                  href="mailto:support@jhfigure.com"
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Email: support@jhfigure.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
