import nodemailer from 'nodemailer';

// Create transporter lazily to ensure environment variables are loaded
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing: EMAIL_USER or EMAIL_PASS not set');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    return false;
  }

  try {
    console.log('Attempting to send email to:', to);
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    
    // Create transporter on each call to ensure fresh env vars
    const transporter = createTransporter();
    
    const result = await transporter.sendMail({
      from: `"OtakuShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully. Message ID:', result.messageId);
    return true;
  } catch (error: any) {
    console.error('=== EMAIL SENDING ERROR ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    console.error('=== END EMAIL ERROR ===');
    return false;
  }
}

export function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getVerificationEmailTemplate(fullName: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận email - OtakuShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    <span style="color: #fff;">JH</span><span style="color: #333;">FIGURE</span>
                  </h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">OtakuShop - Figure Anime chính hãng</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Xin chào ${fullName}!</h2>
                  <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                    Cảm ơn bạn đã đăng ký tài khoản tại OtakuShop. Để hoàn tất quá trình đăng ký, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);">
                      Xác nhận Email
                    </a>
                  </div>

                  <p style="margin: 0 0 10px; color: #666; font-size: 14px; line-height: 1.6;">
                    Hoặc copy đường link sau vào trình duyệt:
                  </p>
                  <p style="margin: 0 0 20px; padding: 12px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all; font-size: 12px; color: #888;">
                    ${verificationUrl}
                  </p>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      <strong>Lưu ý:</strong> Link xác nhận sẽ hết hạn sau 24 giờ.
                    </p>
                    <p style="margin: 10px 0 0; color: #999; font-size: 13px;">
                      Nếu bạn không đăng ký tài khoản tại OtakuShop, vui lòng bỏ qua email này.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                    © 2025 OtakuShop. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    Hotline: 0389836514 | Email: support@dnfigure.vn
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getOtpEmailTemplate(fullName: string, otpCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác nhận OTP - DN Figure</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    <span style="color: #fff;">DN</span><span style="color: #333;">FIGURE</span>
                  </h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">DN Figure - Figure Anime chính hãng</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Xin chào ${fullName}!</h2>
                  <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                    Đây là mã OTP để xác nhận tài khoản của bạn:
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px; box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);">
                      <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px;">${otpCode}</span>
                    </div>
                  </div>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      <strong>Lưu ý:</strong> Mã OTP sẽ hết hạn sau 10 phút.
                    </p>
                    <p style="margin: 10px 0 0; color: #999; font-size: 13px;">
                      Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                    © 2025 DN Figure. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    Hotline: 0389836514 | Email: support@dnfigure.vn
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getWelcomeEmailTemplate(fullName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Chào mừng đến OtakuShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Chào mừng đến OtakuShop!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333;">Xin chào ${fullName}!</h2>
                  <p style="color: #666; line-height: 1.6;">
                    Email của bạn đã được xác nhận thành công. Bây giờ bạn có thể:
                  </p>
                  <ul style="color: #666; line-height: 2;">
                    <li>Mua sắm các sản phẩm Figure Anime chính hãng</li>
                    <li>Theo dõi đơn hàng của bạn</li>
                    <li>Lưu sản phẩm yêu thích</li>
                    <li>Nhận thông báo về các chương trình khuyến mãi</li>
                  </ul>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Bắt đầu mua sắm
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Map order status to Vietnamese text and colors
const ORDER_STATUS_CONFIG: Record<string, { text: string; color: string; description: string }> = {
  PENDING: { 
    text: 'Chờ xác nhận', 
    color: '#f59e0b', 
    description: 'Đơn hàng của bạn đang chờ được xác nhận.' 
  },
  CONFIRMED: { 
    text: 'Đã xác nhận', 
    color: '#3b82f6', 
    description: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.' 
  },
  PREPARING: { 
    text: 'Đang chuẩn bị', 
    color: '#8b5cf6', 
    description: 'Đơn hàng của bạn đang được đóng gói và chuẩn bị giao.' 
  },
  SHIPPING: { 
    text: 'Đang giao hàng', 
    color: '#06b6d4', 
    description: 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.' 
  },
  DELIVERED: { 
    text: 'Đã giao hàng', 
    color: '#22c55e', 
    description: 'Đơn hàng của bạn đã được giao thành công.' 
  },
  COMPLETED: { 
    text: 'Hoàn thành', 
    color: '#10b981', 
    description: 'Đơn hàng đã hoàn thành. Cảm ơn bạn đã mua sắm tại OtakuShop!' 
  },
  CANCELLED: { 
    text: 'Đã hủy', 
    color: '#ef4444', 
    description: 'Đơn hàng của bạn đã bị hủy.' 
  }
};

interface OrderStatusEmailData {
  customerName: string;
  orderNumber: string;
  newStatus: string;
  trackingCode?: string | null;
  carrier?: string | null;
  adminNote?: string | null;
  orderUrl: string;
}

export function getOrderStatusEmailTemplate(data: OrderStatusEmailData): string {
  const statusConfig = ORDER_STATUS_CONFIG[data.newStatus] || { 
    text: data.newStatus, 
    color: '#6b7280', 
    description: 'Trạng thái đơn hàng đã được cập nhật.' 
  };

  const shippingInfo = data.newStatus === 'SHIPPING' && data.trackingCode ? `
    <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
      <h3 style="margin: 0 0 10px; color: #0369a1; font-size: 16px;">📦 Thông tin vận chuyển</h3>
      <p style="margin: 0 0 5px; color: #475569; font-size: 14px;">
        <strong>Đơn vị vận chuyển:</strong> ${data.carrier || 'Không xác định'}
      </p>
      <p style="margin: 0; color: #475569; font-size: 14px;">
        <strong>Mã vận đơn:</strong> <span style="color: #0284c7; font-weight: bold;">${data.trackingCode}</span>
      </p>
    </div>
  ` : '';

  const adminNoteSection = data.adminNote ? `
    <div style="margin-top: 15px; padding: 12px; background-color: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Ghi chú từ cửa hàng:</strong> ${data.adminNote}
      </p>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cập nhật đơn hàng - OtakuShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    <span style="color: #fff;">JH</span><span style="color: #333;">FIGURE</span>
                  </h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">OtakuShop - Figure Anime chính hãng</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Xin chào ${data.customerName}!</h2>
                  
                  <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                    Đơn hàng <strong style="color: #333;">#${data.orderNumber}</strong> của bạn đã được cập nhật trạng thái.
                  </p>

                  <!-- Status Badge -->
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; padding: 16px 32px; background-color: ${statusConfig.color}; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                      <span style="font-size: 20px; font-weight: bold; color: #ffffff;">${statusConfig.text}</span>
                    </div>
                  </div>

                  <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6; text-align: center;">
                    ${statusConfig.description}
                  </p>

                  ${shippingInfo}
                  ${adminNoteSection}

                  <!-- Order Details Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${data.orderUrl}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);">
                      Xem chi tiết đơn hàng
                    </a>
                  </div>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua hotline hoặc email bên dưới.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                    © 2025 OtakuShop. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    Hotline: 0389836514 | Email: support@dnfigure.vn
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getResetPasswordEmailTemplate(fullName: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt lại mật khẩu - OtakuShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    <span style="color: #fff;">JH</span><span style="color: #333;">FIGURE</span>
                  </h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">OtakuShop - Figure Anime chính hãng</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Xin chào ${fullName}!</h2>
                  <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới:
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);">
                      Đặt lại mật khẩu
                    </a>
                  </div>

                  <p style="margin: 0 0 10px; color: #666; font-size: 14px; line-height: 1.6;">
                    Hoặc copy đường link sau vào trình duyệt:
                  </p>
                  <p style="margin: 0 0 20px; padding: 12px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all; font-size: 12px; color: #888;">
                    ${resetUrl}
                  </p>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      <strong>Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ.
                    </p>
                    <p style="margin: 10px 0 0; color: #999; font-size: 13px;">
                      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                    © 2025 OtakuShop. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    Hotline: 0396686826 | Email: support@otakushop.vn
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
