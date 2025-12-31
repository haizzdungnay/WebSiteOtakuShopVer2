import { Metadata } from 'next';
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | DN Figure',
  description: 'Thông tin về chính sách đổi trả hàng của DN Figure',
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Chính sách đổi trả</h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Highlights */}
          <div className="bg-pink-50 rounded-xl p-6 flex items-center gap-4">
            <RotateCcw className="w-12 h-12 text-pink-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-gray-900">Đổi trả trong 7 ngày</h3>
              <p className="text-gray-600">Đổi trả miễn phí nếu sản phẩm bị lỗi từ nhà sản xuất</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. Điều kiện đổi trả</h2>

            <h3 className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" /> Được đổi trả khi:
            </h3>
            <ul>
              <li>Sản phẩm bị lỗi từ nhà sản xuất (gãy, vỡ, thiếu phụ kiện)</li>
              <li>Sản phẩm không đúng với mô tả trên website</li>
              <li>Sản phẩm giao sai mẫu, sai màu so với đơn đặt hàng</li>
              <li>Bao bì, hộp sản phẩm bị hư hại nghiêm trọng trong quá trình vận chuyển</li>
            </ul>

            <h3 className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Không áp dụng đổi trả khi:
            </h3>
            <ul>
              <li>Quá 7 ngày kể từ ngày nhận hàng</li>
              <li>Sản phẩm đã qua sử dụng, có dấu hiệu tháo lắp</li>
              <li>Sản phẩm không còn nguyên tem, nhãn, bao bì</li>
              <li>Sản phẩm bị hư hại do lỗi người dùng</li>
              <li>Sản phẩm thuộc chương trình khuyến mãi, giảm giá đặc biệt</li>
            </ul>

            <h2>2. Quy trình đổi trả</h2>
            <ol>
              <li>Liên hệ hotline <strong>0389 836 514</strong> hoặc email <strong>tuanduongtempproject@gmail.com</strong></li>
              <li>Cung cấp mã đơn hàng, hình ảnh/video sản phẩm lỗi</li>
              <li>Chờ xác nhận từ nhân viên CSKH (trong vòng 24h)</li>
              <li>Gửi trả sản phẩm theo hướng dẫn</li>
              <li>Nhận sản phẩm thay thế hoặc hoàn tiền (trong 3-5 ngày làm việc)</li>
            </ol>

            <h2>3. Chi phí đổi trả</h2>
            <ul>
              <li><strong>Lỗi từ shop/nhà sản xuất:</strong> DN Figure chịu hoàn toàn chi phí vận chuyển</li>
              <li><strong>Lý do từ khách hàng:</strong> Khách hàng chịu chi phí vận chuyển hai chiều</li>
            </ul>

            <h2>4. Hình thức hoàn tiền</h2>
            <ul>
              <li>Hoàn tiền qua chuyển khoản ngân hàng</li>
              <li>Hoàn tiền về ví điện tử (Momo, ZaloPay)</li>
              <li>Đổi sản phẩm có giá trị tương đương hoặc cao hơn (bù thêm tiền)</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-amber-800">Lưu ý quan trọng</h4>
                <p className="text-amber-700 text-sm">
                  Vui lòng quay video khi mở hộp sản phẩm để làm bằng chứng trong trường hợp cần đổi trả.
                  Video phải thể hiện rõ tình trạng kiện hàng trước khi mở.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
