import { Metadata } from 'next';
import { Shield, Clock, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách bảo hành | DN Figure',
  description: 'Thông tin về chính sách bảo hành sản phẩm của DN Figure',
};

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Chính sách bảo hành</h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Bảo hành chính hãng</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Hỗ trợ trọn đời</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <Phone className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Tư vấn 24/7</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. Thời hạn bảo hành</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Loại sản phẩm</th>
                  <th>Thời hạn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Figure Scale (1/4, 1/6, 1/7, 1/8)</td>
                  <td>30 ngày</td>
                </tr>
                <tr>
                  <td>Nendoroid, Figma</td>
                  <td>30 ngày</td>
                </tr>
                <tr>
                  <td>Prize Figure, Pop Up Parade</td>
                  <td>15 ngày</td>
                </tr>
                <tr>
                  <td>Mô hình lắp ráp (Gundam, etc.)</td>
                  <td>7 ngày (lỗi thiếu part)</td>
                </tr>
              </tbody>
            </table>

            <h2>2. Điều kiện bảo hành</h2>
            <ul>
              <li>Sản phẩm còn trong thời hạn bảo hành</li>
              <li>Lỗi phát sinh từ nhà sản xuất</li>
              <li>Sản phẩm chưa qua sửa chữa, can thiệp từ bên thứ ba</li>
              <li>Có hóa đơn mua hàng hoặc thông tin đơn hàng trên hệ thống</li>
            </ul>

            <h2>3. Không áp dụng bảo hành</h2>
            <ul>
              <li>Hư hỏng do tác động ngoại lực, rơi vỡ</li>
              <li>Phai màu do tiếp xúc ánh nắng trực tiếp</li>
              <li>Hư hỏng do bảo quản không đúng cách</li>
              <li>Các bộ phận tiêu hao: keo dán, miếng dán, v.v.</li>
            </ul>

            <h2>4. Hình thức bảo hành</h2>
            <ul>
              <li><strong>Thay thế linh kiện:</strong> Nếu có sẵn linh kiện thay thế</li>
              <li><strong>Đổi sản phẩm mới:</strong> Nếu không thể sửa chữa</li>
              <li><strong>Hoàn tiền:</strong> Nếu không còn hàng thay thế</li>
            </ul>

            <h2>5. Quy trình bảo hành</h2>
            <ol>
              <li>Liên hệ hotline <strong>0389 836 514</strong></li>
              <li>Mô tả lỗi và gửi hình ảnh/video</li>
              <li>Nhân viên xác nhận và hướng dẫn gửi hàng</li>
              <li>Kiểm tra và xử lý (3-7 ngày làm việc)</li>
              <li>Gửi trả sản phẩm đã bảo hành</li>
            </ol>

            <h2>6. Hỗ trợ sau bảo hành</h2>
            <p>
              Đối với sản phẩm hết hạn bảo hành, DN Figure vẫn hỗ trợ tư vấn và kết nối với
              các dịch vụ sửa chữa figure chuyên nghiệp (chi phí do khách hàng chi trả).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
