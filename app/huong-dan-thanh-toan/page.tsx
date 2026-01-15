import { Metadata } from 'next';
import { CreditCard, Wallet, Building, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hướng dẫn thanh toán | DN Figure',
  description: 'Các phương thức thanh toán được hỗ trợ tại DN Figure',
};

export default function PaymentGuidePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Hướng dẫn thanh toán</h1>

        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>

            <div className="space-y-6">
              {/* VNPAY */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">VNPAY - Thanh toán online</h3>
                    <p className="text-gray-500 text-sm">Nhanh chóng, an toàn, tiện lợi</p>
                  </div>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p>Hỗ trợ thanh toán qua:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Thẻ ATM nội địa (Vietcombank, Techcombank, BIDV...)</li>
                    <li>Thẻ quốc tế (Visa, Mastercard, JCB)</li>
                    <li>QR Code (VNPay QR)</li>
                    <li>Ví điện tử liên kết VNPay</li>
                  </ul>
                </div>
              </div>

              {/* E-Wallet */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Ví điện tử</h3>
                    <p className="text-gray-500 text-sm">Momo, ZaloPay</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Quét mã QR hoặc chuyển tiền trực tiếp đến ví điện tử của shop.
                  Liên hệ hotline để nhận thông tin ví.
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Chuyển khoản ngân hàng</h3>
                    <p className="text-gray-500 text-sm">Hỗ trợ tất cả ngân hàng</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Thông tin chuyển khoản:</p>
                  <ul className="text-sm space-y-1">
                    <li><strong>Ngân hàng:</strong> Vietcombank</li>
                    <li><strong>Số tài khoản:</strong> 1234567890</li>
                    <li><strong>Chủ tài khoản:</strong> NGUYEN VAN A</li>
                    <li><strong>Nội dung:</strong> [Mã đơn hàng] - [SĐT]</li>
                  </ul>
                </div>
              </div>

              {/* COD */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Thanh toán khi nhận hàng (COD)</h3>
                    <p className="text-gray-500 text-sm">Nhận hàng rồi mới thanh toán</p>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>Áp dụng cho đơn hàng dưới 5.000.000đ.</p>
                  <p className="text-sm text-amber-600 mt-2">
                    * Lưu ý: Đơn hàng COD có thể yêu cầu đặt cọc 30-50% với sản phẩm pre-order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lưu ý quan trọng</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán thành công.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Với chuyển khoản thủ công, vui lòng gửi ảnh chụp biên lai để được xác nhận nhanh hơn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Mọi thắc mắc về thanh toán, vui lòng liên hệ hotline: <strong>0389 836 514</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
