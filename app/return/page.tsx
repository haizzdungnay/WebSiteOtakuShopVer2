import Link from 'next/link';
import { ArrowLeft, RotateCcw, Clock, Shield, CheckCircle } from 'lucide-react';

export default function ReturnPage() {
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
            Chính sách đổi trả
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm an tâm với chính sách
            đổi trả linh hoạt và minh bạch.
          </p>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Điều kiện đổi trả</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Thời hạn đổi trả</h3>
              <p className="text-gray-600 mb-4">
                Trong vòng 30 ngày kể từ ngày nhận hàng.
              </p>
              <div className="text-2xl font-bold text-accent-red">30 ngày</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Tình trạng sản phẩm</h3>
              <p className="text-gray-600 mb-4">
                Sản phẩm còn nguyên tem mác, bao bì và phụ kiện đi kèm.
              </p>
              <div className="text-sm font-medium text-accent-red">Nguyên vẹn</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Hình thức đổi trả</h3>
              <p className="text-gray-600 mb-4">
                Đổi sản phẩm cùng loại hoặc hoàn tiền 100%.
              </p>
              <div className="text-sm font-medium text-accent-red">Linh hoạt</div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Quy trình đổi trả</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Liên hệ với chúng tôi</h3>
                    <p className="text-gray-600">
                      Gọi hotline hoặc gửi email để thông báo ý định đổi trả và nhận hướng dẫn.
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
                      Đóng gói sản phẩm cẩn thận theo hướng dẫn, điền phiếu đổi trả.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Gửi hàng về</h3>
                    <p className="text-gray-600">
                      Gửi sản phẩm về kho theo địa chỉ được cung cấp. Phí ship đổi về chúng tôi chịu.
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
                    <h3 className="font-bold text-lg mb-2">Kiểm tra sản phẩm</h3>
                    <p className="text-gray-600">
                      Chúng tôi kiểm tra tình trạng sản phẩm trong vòng 1-2 ngày làm việc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Xử lý yêu cầu</h3>
                    <p className="text-gray-600">
                      Duyệt yêu cầu và tiến hành đổi sản phẩm mới hoặc hoàn tiền.
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
                      Gửi sản phẩm mới về cho bạn hoặc chuyển khoản hoàn tiền trong 1-3 ngày.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Not Eligible */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Trường hợp không áp dụng đổi trả</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-red-800 mb-6">Lưu ý quan trọng</h3>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do tác động bên ngoài</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Sản phẩm không còn nguyên tem mác, bao bì, phụ kiện đi kèm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Sản phẩm nằm trong danh sách không áp dụng đổi trả</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Đơn hàng đã giao quá 30 ngày kể từ ngày nhận hàng</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Sản phẩm bị lỗi do tác động của thiên tai, hỏa hoạn, lũ lụt</span>
                </li>
              </ul>
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
              <h3 className="font-bold text-lg mb-3">Tôi có thể đổi trả sản phẩm đã mở bao bì không?</h3>
              <p className="text-gray-600">
                Có, bạn có thể đổi trả sản phẩm đã mở bao bì trong vòng 30 ngày nếu sản phẩm còn nguyên vẹn
                và không có dấu hiệu sử dụng. Tuy nhiên, một số sản phẩm đặc biệt có thể không áp dụng.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Phí vận chuyển đổi trả được tính như thế nào?</h3>
              <p className="text-gray-600">
                Chúng tôi sẽ chịu 100% phí vận chuyển đổi trả về kho. Bạn chỉ cần chịu phí ship khi nhận
                sản phẩm mới (nếu áp dụng) hoặc chúng tôi sẽ chuyển khoản hoàn tiền về tài khoản của bạn.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Thời gian xử lý đổi trả mất bao lâu?</h3>
              <p className="text-gray-600">
                Sau khi nhận được hàng đổi trả, chúng tôi sẽ kiểm tra và xử lý trong vòng 1-2 ngày làm việc.
                Sản phẩm mới sẽ được gửi về trong vòng 3-5 ngày hoặc tiền sẽ được hoàn trong vòng 1-3 ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-accent-red">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Cần hỗ trợ về đổi trả?
          </h2>
          <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn về mọi vấn đề
            liên quan đến đổi trả sản phẩm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
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
