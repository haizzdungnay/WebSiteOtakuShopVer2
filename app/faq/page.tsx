'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'ordering', name: 'Về đặt hàng' },
    { id: 'payment', name: 'Về thanh toán' },
    { id: 'shipping', name: 'Về vận chuyển' },
    { id: 'warranty', name: 'Về bảo hành' },
  ];

  const faqs: FAQ[] = [
    // Về đặt hàng
    {
      id: '1',
      category: 'ordering',
      question: 'Làm thế nào để đặt hàng trên website?',
      answer: `Để đặt hàng trên website DN Figure, bạn làm theo các bước sau:

1. Tìm kiếm và chọn sản phẩm bạn muốn mua
2. Nhấn nút "THÊM VÀO GIỎ"
3. Kiểm tra giỏ hàng và nhấn "THANH TOÁN"
4. Điền thông tin giao hàng và chọn phương thức thanh toán
5. Xác nhận đơn hàng và hoàn tất thanh toán

How to order on the website? Follow these steps:
1. Search and select the product you want to buy
2. Click "ADD TO CART" button
3. Check your cart and click "CHECKOUT"
4. Fill in shipping information and select payment method
5. Confirm order and complete payment`,
    },
    {
      id: '2',
      category: 'ordering',
      question: 'Tôi có thể hủy hoặc thay đổi đơn hàng không?',
      answer: `Bạn có thể hủy hoặc thay đổi đơn hàng trong vòng 24 giờ sau khi đặt hàng bằng cách liên hệ với bộ phận chăm sóc khách hàng qua:
- Hotline: 0389836514
- Email: support@jhfigure.com
- Facebook Messenger

Sau 24 giờ, nếu đơn hàng đã được xử lý, việc hủy có thể phát sinh phí.

Can I cancel or change my order?
You can cancel or change your order within 24 hours after placing it by contacting customer service. After 24 hours, if the order has been processed, cancellation fees may apply.`,
    },
    {
      id: '3',
      category: 'ordering',
      question: 'Pre-order là gì? Tôi có thể pre-order như thế nào?',
      answer: `Pre-order là hình thức đặt hàng trước cho những sản phẩm chưa ra mắt hoặc hàng giới hạn.

Cách pre-order:
1. Chọn sản phẩm có ghi "Pre-order"
2. Đặt cọc 30-50% giá trị sản phẩm
3. Thanh toán phần còn lại khi hàng về
4. Thời gian dự kiến nhận hàng sẽ được thông báo rõ

Lợi ích của pre-order:
- Đảm bảo có hàng (đặc biệt với sản phẩm limited)
- Giá ưu đãi hơn so với mua sau
- Nhận hàng sớm nhất khi về Việt Nam

What is pre-order?
Pre-order allows you to reserve unreleased or limited products in advance by paying a 30-50% deposit. You pay the remaining amount when the product arrives. Benefits include guaranteed stock, better prices, and early delivery.`,
    },

    // Về thanh toán
    {
      id: '4',
      category: 'payment',
      question: 'Các hình thức thanh toán nào được chấp nhận?',
      answer: `DN Figure chấp nhận các hình thức thanh toán sau:

1. Thanh toán khi nhận hàng (COD)
   - Áp dụng cho đơn hàng dưới 10 triệu đồng
   - Phí COD: 30.000đ (miễn phí cho đơn từ 500.000đ)

2. Chuyển khoản ngân hàng
   - Miễn phí
   - Cần chuyển khoản trước khi giao hàng

3. Ví điện tử
   - MoMo
   - ZaloPay
   - Miễn phí giao dịch

4. Thẻ tín dụng/Ghi nợ
   - Visa, Mastercard
   - Phí 2% (nếu có)

What payment methods are accepted?
We accept COD (for orders under 10 million VND), bank transfer, e-wallets (MoMo, ZaloPay), and credit/debit cards (Visa, Mastercard).`,
    },
    {
      id: '5',
      category: 'payment',
      question: 'Tôi có được hóa đơn VAT không?',
      answer: `Có, DN Figure cung cấp hóa đơn VAT theo yêu cầu.

Để nhận hóa đơn VAT:
1. Ghi chú yêu cầu xuất hóa đơn khi đặt hàng
2. Cung cấp đầy đủ thông tin:
   - Tên công ty/cá nhân
   - Mã số thuế
   - Địa chỉ
   - Email nhận hóa đơn điện tử

Lưu ý:
- Hóa đơn được xuất trong vòng 3-5 ngày làm việc
- Hóa đơn điện tử sẽ được gửi qua email
- Không hỗ trợ xuất hóa đơn sau 7 ngày kể từ ngày giao hàng

Do you provide VAT invoice?
Yes, we provide VAT invoices upon request. Please note your requirement when ordering and provide complete company information. Invoices are issued within 3-5 business days.`,
    },

    // Về vận chuyển
    {
      id: '6',
      category: 'shipping',
      question: 'Phí vận chuyển là bao nhiêu?',
      answer: `Chi phí vận chuyển phụ thuộc vào khu vực và trọng lượng đơn hàng:

Nội thành TP.HCM:
- 30.000đ cho đơn dưới 500.000đ
- MIỄN PHÍ cho đơn từ 500.000đ

Ngoại thành TP.HCM và tỉnh lân cận:
- 40.000đ cho đơn dưới 500.000đ
- MIỄN PHÍ cho đơn từ 500.000đ

Các tỉnh thành khác:
- 50.000đ cho đơn dưới 500.000đ
- MIỄN PHÍ cho đơn từ 1.000.000đ

Miễn phí vận chuyển toàn quốc cho đơn từ 2.000.000đ

What are the shipping costs?
Shipping fees vary by location and order value. Free shipping for orders over 500,000 VND (inner city) and 2,000,000 VND (nationwide).`,
    },
    {
      id: '7',
      category: 'shipping',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: `Thời gian giao hàng dự kiến:

Nội thành TP.HCM:
- 1-2 ngày làm việc

Ngoại thành TP.HCM và các tỉnh lân cận:
- 2-3 ngày làm việc

Các tỉnh thành khác:
- 3-5 ngày làm việc

Vùng xa, hải đảo:
- 5-7 ngày làm việc

Lưu ý:
- Thời gian trên không bao gồm thứ 7, Chủ nhật và ngày lễ
- Đơn pre-order có thời gian riêng được thông báo cụ thể
- Bạn có thể tra cứu tình trạng đơn hàng qua mục "Tra cứu đơn hàng"

How long does delivery take?
Delivery time ranges from 1-2 days (inner city) to 5-7 days (remote areas). Excludes weekends and holidays. You can track your order status online.`,
    },
    {
      id: '8',
      category: 'shipping',
      question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
      answer: `Có, bạn có thể thay đổi địa chỉ giao hàng nếu đơn hàng chưa được giao cho đơn vị vận chuyển.

Cách thay đổi:
1. Liên hệ ngay với bộ phận CSKH qua hotline hoặc chat
2. Cung cấp mã đơn hàng và địa chỉ mới
3. Chúng tôi sẽ xác nhận và cập nhật trong hệ thống

Lưu ý:
- Nếu đơn hàng đã được chuyển đi, việc thay đổi địa chỉ có thể phát sinh thêm phí vận chuyển
- Không áp dụng thay đổi địa chỉ sang tỉnh/thành phố khác sau khi đã xuất kho

Can I change the delivery address?
Yes, you can change the delivery address if the order hasn't been shipped yet. Contact customer service immediately with your order code and new address.`,
    },

    // Về bảo hành
    {
      id: '9',
      category: 'warranty',
      question: 'Chính sách bảo hành như thế nào?',
      answer: `DN Figure cam kết bảo hành cho tất cả sản phẩm chính hãng:

Điều kiện bảo hành:
- Sản phẩm còn nguyên tem, hộp
- Lỗi do nhà sản xuất (bể vỡ trong quá trình sản xuất, lỗi sơn, khuyết điểm kỹ thuật)
- Có hóa đơn mua hàng

Không bảo hành:
- Sản phẩm bị rơi, va đập
- Tự ý sửa chữa, thay đổi
- Hết thời hạn bảo hành
- Sản phẩm nhập khẩu không chính hãng

Thời gian bảo hành:
- 7 ngày đổi trả nếu phát hiện lỗi
- 30 ngày bảo hành với các lỗi kỹ thuật

Quy trình bảo hành:
1. Liên hệ CSKH và cung cấp thông tin sản phẩm
2. Gửi sản phẩm về cửa hàng (shop hỗ trợ phí ship)
3. Kiểm tra và xử lý trong 5-7 ngày
4. Đổi sản phẩm mới hoặc hoàn tiền

What is the warranty policy?
We warranty all authentic products for manufacturer defects. 7-day return if defects found, 30-day warranty for technical issues. Products damaged by impact or unauthorized repairs are not covered.`,
    },
    {
      id: '10',
      category: 'warranty',
      question: 'Tôi có thể đổi/trả hàng không?',
      answer: `Chính sách đổi/trả hàng của DN Figure:

Điều kiện đổi/trả:
- Trong vòng 7 ngày kể từ ngày nhận hàng
- Sản phẩm chưa qua sử dụng, còn nguyên tem, hộp
- Có đầy đủ phụ kiện, hóa đơn mua hàng

Các trường hợp được đổi/trả:
1. Sản phẩm bị lỗi do nhà sản xuất
2. Giao sai sản phẩm
3. Sản phẩm bị hư hỏng trong quá trình vận chuyển

Chi phí:
- Miễn phí nếu lỗi do shop
- Khách hàng chịu phí ship nếu đổi ý (không muốn mua nữa)

Quy trình:
1. Liên hệ CSKH trong vòng 7 ngày
2. Cung cấp hình ảnh và mô tả vấn đề
3. Đóng gói sản phẩm cẩn thận
4. Gửi về shop hoặc chờ nhân viên đến lấy (tùy khu vực)
5. Nhận sản phẩm mới hoặc hoàn tiền trong 5-7 ngày

Lưu ý:
- Không chấp nhận đổi/trả sản phẩm đã mở hộp với sản phẩm limited edition
- Sản phẩm sale off không được đổi/trả trừ trường hợp lỗi

Can I return/exchange products?
Yes, within 7 days of receipt if products are unused with original packaging. Free return/exchange for defective items or shipping errors. Customer pays shipping for change of mind.`,
    },
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Câu hỏi thường gặp</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-red rounded-full mb-4">
            <HelpCircle size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Câu hỏi thường gặp</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm câu trả lời cho những thắc mắc thường gặp về đặt hàng, thanh toán, vận chuyển và bảo hành
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-accent-red text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openId === faq.id ? (
                    <ChevronUp className="text-accent-red flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                </button>

                {openId === faq.id && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-primary to-primary-light rounded-lg p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Không tìm thấy câu trả lời?
          </h2>
          <p className="text-gray-700 mb-6">
            Liên hệ với chúng tôi để được hỗ trợ nhanh chóng
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:0389836514"
              className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Gọi: 0389 836 514
            </a>
            <a
              href="mailto:support@jhfigure.com"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email: support@jhfigure.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
