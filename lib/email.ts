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
