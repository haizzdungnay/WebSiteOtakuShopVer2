import Link from 'next/link';
import { ArrowLeft, CreditCard, Smartphone, Building, Truck, Shield } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-accent-red transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hướng dẫn thanh toán
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Nhiều phương thức thanh toán linh hoạt và an toàn,
            đảm bảo trải nghiệm mua sắm thuận tiện nhất cho quý khách hàng.
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Phương thức thanh toán</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Online Payment */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent-red rounded-lg flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Thanh toán online</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">V</span>
                  </div>
                  <span className="font-medium">Visa/MasterCard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">M</span>
                  </div>
                  <span className="font-medium">MoMo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">Z</span>
                  </div>
                  <span className="font-medium">ZaloPay</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">V</span>
                  </div>
                  <span className="font-medium">VNPay</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>An toàn & bảo mật:</strong> Tất cả giao dịch được mã hóa SSL 256-bit,
                  thông tin thanh toán được bảo vệ tuyệt đối.
                </p>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent-red rounded-lg flex items-center justify-center">
                  <Truck size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Thanh toán khi nhận hàng</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-red rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Thanh toán bằng tiền mặt</p>
                    <p className="text-gray-600 text-sm">Thanh toán trực tiếp cho shipper khi nhận hàng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-red rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Thanh toán bằng ví điện tử</p>
                    <p className="text-gray-600 text-sm">Quét QR code MoMo/ZaloPay cho shipper</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-red rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium mb-1">Thanh toán bằng thẻ</p>
                    <p className="text-gray-600 text-sm">Shipper mang máy POS đến tận nơi</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Thuận tiện:</strong> Không cần chuẩn bị tiền trước,
                  thanh toán khi đã kiểm tra và hài lòng với sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Process */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Quy trình thanh toán</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Chọn sản phẩm</h3>
                    <p className="text-gray-600">
                      Thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Chọn phương thức thanh toán</h3>
                    <p className="text-gray-600">
                      Chọn thanh toán online hoặc thanh toán khi nhận hàng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Xác nhận thanh toán</h3>
                    <p className="text-gray-600">
                      Nhập thông tin thanh toán và xác nhận đơn hàng.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Xử lý thanh toán</h3>
                    <p className="text-gray-600">
                      Hệ thống xử lý thanh toán và gửi xác nhận.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Giao hàng</h3>
                    <p className="text-gray-600">
                      Đơn hàng được chuẩn bị và giao đến tay khách hàng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Hoàn tất</h3>
                    <p className="text-gray-600">
                      Khách hàng nhận hàng và đơn hàng hoàn tất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Bảo mật thanh toán</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Mã hóa SSL</h3>
              <p className="text-gray-600">
                Tất cả giao dịch được bảo vệ bởi chứng chỉ SSL 256-bit,
                đảm bảo thông tin không bị窃取.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Ngân hàng uy tín</h3>
              <p className="text-gray-600">
                Hợp tác với các ngân hàng và ví điện tử hàng đầu Việt Nam,
                đảm bảo tính hợp pháp và uy tín.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Xác thực 2 lớp</h3>
              <p className="text-gray-600">
                Sử dụng xác thực 2 lớp (OTP) để đảm bảo chỉ chủ tài khoản
                mới có thể thực hiện giao dịch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Thanh toán online có an toàn không?</h3>
              <p className="text-gray-600">
                Hoàn toàn an toàn. Chúng tôi sử dụng công nghệ mã hóa SSL 256-bit và hợp tác với
                các cổng thanh toán uy tín như VNPay, MoMo, ZaloPay. Thông tin thanh toán của bạn
                được bảo vệ tuyệt đối và không được lưu trữ trên hệ thống của chúng tôi.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Có thể thanh toán bằng thẻ tín dụng quốc tế không?</h3>
              <p className="text-gray-600">
                Có, chúng tôi chấp nhận thanh toán bằng thẻ Visa và MasterCard quốc tế.
                Bạn có thể thanh toán bằng thẻ phát hành tại Việt Nam hoặc nước ngoài.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Thanh toán khi nhận hàng có mất phí không?</h3>
              <p className="text-gray-600">
                Không mất phí thêm. Bạn chỉ thanh toán đúng giá trị đơn hàng đã đặt.
                Phương thức này hoàn toàn miễn phí và thuận tiện cho khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-accent-red">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Cần hỗ trợ thanh toán?
          </h2>
          <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Đội ngũ hỗ trợ thanh toán luôn sẵn sàng giải đáp mọi thắc mắc
            và hỗ trợ bạn hoàn tất giao dịch một cách nhanh chóng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              href="tel:0396686826"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors"
            >
              Gọi hotline
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
