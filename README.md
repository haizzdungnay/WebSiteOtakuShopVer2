# 🎌 OtakuShop - Figure Store

Cửa hàng figure anime chính hãng - Next.js E-commerce Platform với Prisma ORM

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

🌐 **Live Demo**: [web-site-otaku-shop-ver2.vercel.app](https://web-site-otaku-shop-ver2.vercel.app)

---

## 📸 Demo Screenshots

### Trang Chủ
![Homepage](public/demo/homepage.png)

### Danh Sách Sản Phẩm
![Products](public/demo/products.png)

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Cấu trúc Project](#-cấu-trúc-project)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Scripts](#-scripts)
- [API Endpoints](#-api-endpoints)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Deploy lên Internet](#-deploy-lên-internet)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Tính năng

### 🛒 Khách hàng (Frontend)

| Tính năng | Mô tả |
|-----------|-------|
| **Đăng ký & Đăng nhập** | Xác thực email bằng OTP, quên mật khẩu, đặt lại mật khẩu |
| **Duyệt sản phẩm** | Danh sách, chi tiết, tìm kiếm, lọc theo danh mục |
| **Giỏ hàng** | Thêm/xóa sản phẩm, cập nhật số lượng real-time |
| **Wishlist** | Danh sách sản phẩm yêu thích |
| **Đặt hàng** | Checkout với nhiều địa chỉ giao hàng |
| **Thanh toán VNPAY** | Thanh toán trực tuyến qua cổng VNPAY |
| **Quản lý tài khoản** | Cập nhật profile, avatar, mật khẩu |
| **Quản lý địa chỉ** | Thêm/sửa/xóa địa chỉ giao hàng |
| **Lịch sử đơn hàng** | Xem chi tiết, hủy đơn hàng |
| **Đánh giá sản phẩm** | Viết review, vote helpful |
| **Tìm kiếm thông minh** | Gợi ý tìm kiếm, search theo nhiều tiêu chí |

### 👨‍💼 Quản trị viên (Admin Dashboard)

| Tính năng | Mô tả |
|-----------|-------|
| **Dashboard** | Thống kê tổng quan doanh thu, đơn hàng, người dùng |
| **Quản lý sản phẩm** | Thêm/sửa/xóa sản phẩm, upload hình ảnh |
| **Quản lý danh mục** | CRUD categories |
| **Quản lý đơn hàng** | Cập nhật trạng thái, xem chi tiết |
| **Quản lý người dùng** | Xem danh sách, khóa/mở khóa tài khoản |
| **Quản lý mã giảm giá** | Tạo coupon, thiết lập điều kiện |
| **Quản lý đánh giá** | Duyệt/xóa review |
| **Thông báo** | Tạo thông báo cho người dùng |

### 🔧 Hệ thống (Backend)

| Tính năng | Mô tả |
|-----------|-------|
| **RESTful API** | API đầy đủ với Prisma ORM |
| **JWT Authentication** | Xác thực bảo mật với refresh token |
| **Email Service** | Gửi OTP, xác nhận email, thông báo đơn hàng |
| **VNPAY Integration** | Tích hợp thanh toán VNPAY sandbox |
| **File Upload** | Upload ảnh với UploadThing |
| **Location API** | API địa chỉ Việt Nam (Tỉnh/Thành, Quận/Huyện, Phường/Xã) |
| **CSRF Protection** | Bảo vệ chống tấn công CSRF |
| **Rate Limiting** | Giới hạn request để chống spam/brute-force |

### 🆕 Tính năng mới (Ver 2.0)

| Tính năng | Mô tả | Ảnh hưởng |
|-----------|-------|-----------|
| **Server-Side Rendering** | Homepage render trên server, không còn loading spinner | SEO ++, Performance ++ |
| **Dynamic Sitemap** | Tự động generate sitemap từ database | SEO ++ |
| **robots.txt** | Hướng dẫn crawler đúng chuẩn | SEO ++ |
| **Rate Limiting** | Chống brute-force: 5 login/15 phút, 3 OTP/10 phút | Security ++ |
| **Error Pages** | Trang 404 và Error đẹp, user-friendly | UX ++ |
| **Loading Skeletons** | Skeleton loading cho từng route | UX ++ |
| **Google Search Console** | Đã tích hợp verification | SEO ++ |
| **OpenGraph & Twitter Cards** | Meta tags đầy đủ cho social sharing | SEO ++ |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Prisma** | 6.17.1 | ORM for PostgreSQL |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **PostgreSQL** | 15 | Relational database |
| **Zod** | 4.1.12 | Schema validation |
| **bcryptjs** | 3.0.2 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **Nodemailer** | 7.0.12 | Email sending |
| **Lucide React** | 0.548.0 | Icon library |

---

## 📁 Cấu trúc Project

```
WebSiteOtakuShopVer2/
├── app/
│   ├── api/                      # API Routes (18 modules)
│   ├── admin/                    # Admin Dashboard pages
│   ├── products/                 # Trang sản phẩm
│   ├── cart/                     # Giỏ hàng
│   ├── checkout/                 # Thanh toán
│   ├── profile/                  # Trang cá nhân
│   ├── sale/                     # Trang giảm giá
│   ├── sitemap.ts               # Dynamic sitemap (SEO)
│   ├── robots.ts                # robots.txt (SEO)
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404 page
│   └── loading.tsx              # Global loading skeleton
├── components/                   # React Components
│   ├── Header.tsx               # Header navigation
│   ├── Footer.tsx               # Footer
│   ├── ProductCard.tsx          # Card sản phẩm
│   └── ...
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx          # Auth state management
│   ├── CartContext.tsx          # Cart state management
│   └── WishlistContext.tsx      # Wishlist state management
├── lib/                          # Utilities
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # Auth helpers
│   ├── rate-limit.ts            # API rate limiting
│   ├── email.ts                 # Email service
│   └── ...
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
└── docker-compose.yml           # Docker configuration
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** 18.0+ (khuyến nghị 20.x)
- **PostgreSQL** 15+ (local hoặc Docker)
- **npm** hoặc **yarn**

### Bước 1: Clone Repository

```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu hình Environment

Tạo file `.env` trong thư mục gốc (copy từ `.env.example`):

```env
# ===== DATABASE =====
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/otakushop?schema=public

# ===== JWT =====
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# ===== ADMIN =====
ADMIN_USERNAME=admin@otakushop.local
ADMIN_PASSWORD=ChangeMeNow!
ADMIN_DISPLAY_NAME=Quản trị viên

# ===== APPLICATION =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== EMAIL (Gmail App Password) =====
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# ===== UPLOADTHING =====
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### Bước 4: Khởi động PostgreSQL

```bash
# Dùng Docker (Khuyến nghị)
docker-compose up -d postgres

# Hoặc sử dụng script
./start-db.bat          # Windows
./start-db.sh           # Linux/Mac
```

### Bước 5: Khởi tạo Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed    # (Tùy chọn) Seed dữ liệu mẫu
```

### Bước 6: Chạy ứng dụng

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

---

## 👤 Tài khoản mặc định

### Admin

| Field | Value |
|-------|-------|
| Email | `admin@otakushop.local` |
| Password | `ChangeMeNow!` |
| URL | `/admin` |

> ⚠️ **Lưu ý**: Thay đổi mật khẩu trong `.env` cho môi trường production!

---

## 📜 Scripts

```bash
# Development
npm run dev              # Khởi động dev server
npm run build            # Build production
npm start                # Chạy production server

# Database
npm run db:push          # Đẩy schema lên database
npm run db:seed          # Seed dữ liệu mẫu
npm run db:studio        # Mở Prisma Studio (GUI)

# Docker
npm run docker:up        # Khởi động containers
npm run docker:down      # Dừng containers
```

---

## 🌐 Deploy lên Vercel

1. **Push code lên GitHub**
2. **Import project vào Vercel**: https://vercel.com/new
3. **Cấu hình Environment Variables** (như `.env` ở trên)
4. **Build Command**: `npx prisma generate && npm run build`
5. **Deploy** và đợi 3-5 phút

Chi tiết xem tại: [DATABASE_SETUP.md](DATABASE_SETUP.md)

---

## 📄 License

MIT License - Xem [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**haizzdungnay** - [GitHub](https://github.com/haizzdungnay)