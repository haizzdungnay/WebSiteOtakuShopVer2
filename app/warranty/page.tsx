import Link from 'next/link';
import { ArrowLeft, Shield, Wrench, Clock, CheckCircle } from 'lucide-react';

export default function WarrantyPage() {
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
            Chính sách bảo hành
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Cam kết bảo hành chính hãng với dịch vụ chăm sóc khách hàng tận tâm,
            mang đến sự an tâm tuyệt đối cho quý khách hàng.
          </p>
        </div>
      </section>

      {/* Warranty Coverage */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Phạm vi bảo hành</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lỗi nhà sản xuất</h3>
              <p className="text-gray-600 mb-4">
                Bảo hành các lỗi kỹ thuật từ nhà sản xuất.
              </p>
              <div className="text-sm font-medium text-accent-red">✓ Áp dụng</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sửa chữa miễn phí</h3>
              <p className="text-gray-600 mb-4">
                Sửa chữa, thay thế linh kiện miễn phí trong thời hạn bảo hành.
              </p>
              <div className="text-sm font-medium text-accent-red">✓ Miễn phí</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Thời hạn bảo hành</h3>
              <p className="text-gray-600 mb-4">
                Thời hạn bảo hành theo quy định của nhà sản xuất.
              </p>
              <div className="text-sm font-medium text-accent-red">6-24 tháng</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Hỗ trợ tận nơi</h3>
              <p className="text-gray-600 mb-4">
                Hỗ trợ kỹ thuật và bảo hành tận nơi khi cần thiết.
              </p>
              <div className="text-sm font-medium text-accent-red">✓ Tận nơi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Process */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Quy trình bảo hành</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Liên hệ bộ phận bảo hành</h3>
                    <p className="text-gray-600">
                      Gọi hotline hoặc gửi email để thông báo lỗi sản phẩm và nhận hướng dẫn.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Chuẩn bị sản phẩm</h3>
                    <p className="text-gray-600">
                      Đóng gói sản phẩm cẩn thận, điền phiếu bảo hành và gửi về trung tâm.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Tiếp nhận và kiểm tra</h3>
                    <p className="text-gray-600">
                      Trung tâm tiếp nhận và tiến hành kiểm tra, chẩn đoán lỗi sản phẩm.
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
                    <h3 className="font-bold text-lg mb-2">Sửa chữa hoặc thay thế</h3>
                    <p className="text-gray-600">
                      Tiến hành sửa chữa lỗi hoặc thay thế sản phẩm mới nếu cần thiết.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Kiểm tra chất lượng</h3>
                    <p className="text-gray-600">
                      Kiểm tra kỹ lưỡng chất lượng sản phẩm sau khi sửa chữa.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Giao trả sản phẩm</h3>
                    <p className="text-gray-600">
                      Gửi sản phẩm đã sửa chữa về cho khách hàng và xác nhận hoàn tất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Terms */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Điều kiện bảo hành</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-green-800 mb-6">Sản phẩm được bảo hành khi:</h3>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Sản phẩm còn trong thời hạn bảo hành</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Còn tem bảo hành và phiếu bảo hành chính hãng</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Lỗi kỹ thuật do nhà sản xuất (không phải lỗi sử dụng)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Sản phẩm không bị tác động vật lý mạnh, rơi vỡ, vào nước</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-red-800 mb-6">Sản phẩm không được bảo hành khi:</h3>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Sản phẩm bị hư hỏng do sử dụng sai cách, tác động vật lý mạnh</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Sản phẩm bị vào nước, ẩm mốc, cháy nổ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Sản phẩm đã được can thiệp, sửa chữa bởi bên thứ ba</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Hết thời hạn bảo hành</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-accent-red">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Cần hỗ trợ bảo hành?
          </h2>
          <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Đội ngũ kỹ thuật viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn
            về mọi vấn đề liên quan đến bảo hành sản phẩm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ bảo hành
            </Link>
            <Link
              href="tel:0396686826"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors"
            >
              Gọi ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
