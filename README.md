# 🎌 OtakuShop - Figure Store

Cửa hàng figure anime chính hãng - Next.js E-commerce Platform với Prisma ORM

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

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

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
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
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/            # Đăng nhập
│   │   │   ├── register/         # Đăng ký
│   │   │   ├── logout/           # Đăng xuất
│   │   │   ├── me/               # Lấy thông tin user
│   │   │   ├── profile/          # Cập nhật profile
│   │   │   ├── upload-avatar/    # Upload avatar
│   │   │   ├── change-password/  # Đổi mật khẩu
│   │   │   ├── forgot-password/  # Quên mật khẩu
│   │   │   ├── reset-password/   # Đặt lại mật khẩu
│   │   │   ├── send-otp/         # Gửi mã OTP
│   │   │   ├── verify-otp/       # Xác thực OTP
│   │   │   ├── verify-email/     # Xác thực email
│   │   │   ├── resend-verification/ # Gửi lại email xác thực
│   │   │   └── refresh/          # Refresh token
│   │   ├── admin/                # Admin APIs
│   │   │   ├── login/            # Admin login
│   │   │   ├── dashboard/        # Dashboard stats
│   │   │   ├── products/         # Quản lý sản phẩm
│   │   │   ├── orders/           # Quản lý đơn hàng
│   │   │   ├── users/            # Quản lý người dùng
│   │   │   ├── categories/       # Quản lý danh mục
│   │   │   ├── coupons/          # Quản lý mã giảm giá
│   │   │   ├── reviews/          # Quản lý đánh giá
│   │   │   └── announcements/    # Quản lý thông báo
│   │   ├── products/             # Products API
│   │   ├── categories/           # Categories API
│   │   ├── cart/                 # Shopping cart
│   │   ├── wishlist/             # Wishlist
│   │   ├── orders/               # Orders
│   │   ├── reviews/              # Reviews
│   │   ├── addresses/            # User addresses
│   │   ├── coupons/              # Coupon validation
│   │   ├── location/             # Location services (Tỉnh/Huyện/Xã)
│   │   ├── payment/vnpay/        # VNPAY payment
│   │   ├── search/               # Search API
│   │   ├── announcements/        # Announcements
│   │   ├── uploadthing/          # File upload
│   │   ├── csrf/                 # CSRF token
│   │   └── health/               # Health check
│   ├── admin/                    # Admin Dashboard pages
│   ├── login/                    # Đăng nhập
│   ├── register/                 # Đăng ký
│   ├── forgot-password/          # Quên mật khẩu
│   ├── reset-password/           # Đặt lại mật khẩu
│   ├── verify-email/             # Xác thực email
│   ├── products/                 # Trang sản phẩm
│   ├── cart/                     # Giỏ hàng
│   ├── checkout/                 # Thanh toán
│   ├── search/                   # Tìm kiếm
│   ├── profile/                  # Trang cá nhân
│   │   ├── addresses/            # Quản lý địa chỉ
│   │   ├── orders/               # Lịch sử đơn hàng
│   │   ├── wishlist/             # Danh sách yêu thích
│   │   └── preorders/            # Đơn đặt trước
│   ├── new-releases/             # Sản phẩm mới
│   ├── in-stock/                 # Sản phẩm còn hàng
│   ├── characters/               # Sản phẩm theo nhân vật
│   ├── tin-tuc/                  # Tin tức
│   ├── faq/                      # FAQ
│   ├── giao-hang/                # Chính sách giao hàng
│   ├── tra-cuu/                  # Tra cứu đơn hàng
│   └── tinh-gia/                 # Tính giá ship
├── components/                   # React Components
│   ├── Header.tsx                # Header navigation
│   ├── Footer.tsx                # Footer
│   ├── Sidebar.tsx               # Sidebar
│   ├── ProductCard.tsx           # Card sản phẩm
│   ├── CartDropdown.tsx          # Dropdown giỏ hàng
│   ├── ReviewSection.tsx         # Section đánh giá
│   ├── SearchSuggestions.tsx     # Gợi ý tìm kiếm
│   └── ...
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx           # Auth state management
│   ├── CartContext.tsx           # Cart state management
│   └── WishlistContext.tsx       # Wishlist state management
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Auth helpers
│   ├── admin-auth.ts             # Admin auth
│   ├── email.ts                  # Email service
│   ├── jwt.ts                    # JWT utilities
│   ├── csrf.ts                   # CSRF protection
│   ├── location-service.ts       # Location API
│   ├── validators.ts             # Zod validators
│   └── ...
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── docker-compose.yml            # Docker configuration
├── Dockerfile                    # Docker build
└── ...
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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=otakushop
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/otakushop?schema=public

# ===== JWT =====
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# ===== ADMIN =====
# ⚠️ QUAN TRỌNG: Thay đổi trong production!
ADMIN_USERNAME=admin@otakushop.local
ADMIN_PASSWORD=ChangeMeNow!
ADMIN_DISPLAY_NAME=Quản trị viên

# ===== APPLICATION =====
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== EMAIL (Gmail App Password) =====
# Hướng dẫn tạo App Password:
# 1. Bật 2-Step Verification: https://myaccount.google.com/security
# 2. Tạo App Password: https://myaccount.google.com/apppasswords
# 3. Copy mật khẩu 16 ký tự (không có dấu cách)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# ===== UPLOADTHING (File Upload) =====
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# ===== VNPAY (Sandbox) =====
VNP_TMN_CODE=your-vnpay-tmn-code
VNP_HASH_SECRET=your-vnpay-hash-secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/api/payment/vnpay/return
VNP_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn
```

### Bước 4: Khởi động PostgreSQL

**Cách 1: Dùng Docker (Khuyến nghị)**

```bash
# Khởi động PostgreSQL
docker-compose up -d postgres

# Hoặc sử dụng script
./start-db.bat          # Windows
./start-db.sh           # Linux/Mac
```

**Cách 2: PostgreSQL Local**

Đảm bảo PostgreSQL đang chạy và tạo database:

```sql
CREATE DATABASE otakushop;
```

### Bước 5: Khởi tạo Database

```bash
# Generate Prisma Client
npx prisma generate

# Đẩy schema lên database
npx prisma db push

# (Tùy chọn) Seed dữ liệu mẫu
npm run db:seed
```

### Bước 6: Chạy ứng dụng

```bash
# Development mode
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

### Khách hàng
Đăng ký tài khoản mới tại `/register`

---

## 📜 Scripts

### Development

```bash
npm run dev              # Khởi động dev server (port 3000)
npm run build            # Build production
npm start                # Chạy production server
npm run lint             # Kiểm tra lỗi ESLint
```

### Database (Prisma)

```bash
npm run db:push          # Đẩy schema lên database
npm run db:migrate       # Chạy migrations
npm run db:seed          # Seed dữ liệu mẫu
npm run db:studio        # Mở Prisma Studio (GUI)
```

### Docker

```bash
npm run docker:up        # Khởi động containers
npm run docker:down      # Dừng containers
npm run docker:build     # Build Docker image
```

### Database Backup (Windows)

```bash
./backup-db.bat          # Backup database
./restore-db.bat         # Restore database
./stop-db.bat            # Dừng PostgreSQL
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/login` | Đăng nhập |
| POST | `/register` | Đăng ký |
| POST | `/logout` | Đăng xuất |
| GET | `/me` | Lấy thông tin user hiện tại |
| POST | `/profile` | Cập nhật profile |
| POST | `/upload-avatar` | Upload avatar |
| POST | `/change-password` | Đổi mật khẩu |
| POST | `/forgot-password` | Gửi email quên mật khẩu |
| POST | `/reset-password` | Đặt lại mật khẩu |
| POST | `/send-otp` | Gửi mã OTP |
| POST | `/verify-otp` | Xác thực OTP |
| GET | `/verify-email` | Xác thực email (qua link) |
| POST | `/resend-verification` | Gửi lại email xác thực |
| POST | `/refresh` | Refresh access token |

### Admin (`/api/admin`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/login` | Admin đăng nhập |
| GET | `/dashboard/stats` | Thống kê dashboard |
| GET/POST | `/products` | Quản lý sản phẩm |
| GET/PUT/DELETE | `/products/[id]` | Chi tiết/Sửa/Xóa sản phẩm |
| GET/POST | `/orders` | Quản lý đơn hàng |
| GET/PUT | `/orders/[id]` | Chi tiết/Cập nhật đơn hàng |
| GET/POST | `/users` | Quản lý người dùng |
| GET/POST | `/categories` | Quản lý danh mục |
| GET/POST | `/coupons` | Quản lý mã giảm giá |
| GET/DELETE | `/reviews` | Quản lý đánh giá |
| GET/POST | `/announcements` | Quản lý thông báo |

### Products & Categories

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/products/[slug]` | Chi tiết sản phẩm |
| GET | `/api/categories` | Danh sách danh mục |
| GET | `/api/search` | Tìm kiếm sản phẩm |

### Cart & Wishlist

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart` | Thêm vào giỏ |
| PUT | `/api/cart/[id]` | Cập nhật số lượng |
| DELETE | `/api/cart/[id]` | Xóa khỏi giỏ |
| GET | `/api/wishlist` | Lấy wishlist |
| POST | `/api/wishlist` | Thêm vào wishlist |
| DELETE | `/api/wishlist/[id]` | Xóa khỏi wishlist |

### Orders

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Danh sách đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| GET | `/api/orders/[id]` | Chi tiết đơn hàng |
| POST | `/api/orders/[id]/cancel` | Hủy đơn hàng |

### Reviews

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/reviews` | Danh sách reviews |
| POST | `/api/reviews` | Viết review |
| GET | `/api/products/[slug]/reviews` | Reviews của sản phẩm |
| POST | `/api/reviews/[id]/vote` | Vote helpful |

### Payment

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/payment/vnpay/create` | Tạo URL thanh toán VNPAY |
| GET | `/api/payment/vnpay/return` | VNPAY return URL |
| POST | `/api/payment/vnpay/ipn` | VNPAY IPN callback |

### Location

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/location/provinces` | Danh sách Tỉnh/Thành phố |
| GET | `/api/location/districts?provinceCode=...` | Danh sách Quận/Huyện |
| GET | `/api/location/wards?districtCode=...` | Danh sách Phường/Xã |

### Other

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET/POST | `/api/addresses` | Quản lý địa chỉ |
| POST | `/api/coupons/validate` | Kiểm tra mã giảm giá |
| GET | `/api/announcements` | Danh sách thông báo |
| GET | `/api/csrf` | Lấy CSRF token |
| GET | `/api/health` | Health check |

---

## 📖 Hướng dẫn sử dụng

### Cấu hình Email (Gmail)

Để gửi email xác thực OTP, bạn cần cấu hình Gmail App Password:

1. **Bật xác thực 2 bước**:
   - Truy cập: https://myaccount.google.com/security
   - Bật "2-Step Verification"

2. **Tạo App Password**:
   - Truy cập: https://myaccount.google.com/apppasswords
   - Chọn "Mail" → "Windows Computer" (hoặc Other)
   - Copy mật khẩu 16 ký tự

3. **Cập nhật `.env`**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # Bỏ dấu cách
   ```

4. **Khởi động lại server**

### Quản lý sản phẩm (Admin)

1. Đăng nhập Admin tại `/admin`
2. Vào tab **"Sản phẩm"**
3. Click **"Thêm sản phẩm"**
4. Điền thông tin và upload hình ảnh
5. Lưu sản phẩm

### Prisma Studio (Database GUI)

```bash
npm run db:studio
# Mở http://localhost:5555
```

---

## 🌐 Deploy lên Internet

Dưới đây là hướng dẫn deploy OtakuShop lên các nền tảng hosting phổ biến.

### 🚀 Deploy lên Vercel (Khuyến nghị)

Vercel là nền tảng tốt nhất cho Next.js applications với free tier hào phóng.

#### Bước 1: Chuẩn bị Database (Neon/Supabase)

**Option A: Neon (Khuyến nghị - Free tier tốt)**

1. Đăng ký tại https://neon.tech
2. Tạo project mới, chọn region gần nhất (Singapore)
3. Copy connection string:
   ```
   postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

**Option B: Supabase**

1. Đăng ký tại https://supabase.com
2. Tạo project mới
3. Vào **Settings → Database → Connection string**
4. Copy connection string (chọn URI)

#### Bước 2: Deploy lên Vercel

1. **Push code lên GitHub** (nếu chưa có)

2. **Import project vào Vercel**:
   - Truy cập https://vercel.com/new
   - Kết nối GitHub repository
   - Chọn repository `WebSiteOtakuShopVer2`

3. **Cấu hình Environment Variables**:
   
   Trong Vercel Dashboard → Settings → Environment Variables, thêm:

   ```env
   # Database
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   
   # JWT (Tạo secret mới, ít nhất 32 ký tự)
   JWT_SECRET=your-super-secret-production-key-min-32-chars
   JWT_EXPIRES_IN=7d
   
   # Admin
   ADMIN_USERNAME=admin@yourdomain.com
   ADMIN_PASSWORD=YourStrongPassword123!
   ADMIN_DISPLAY_NAME=Administrator
   
   # Application
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   
   # Email (Gmail App Password)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   
   # UploadThing
   UPLOADTHING_SECRET=sk_live_xxx
   UPLOADTHING_APP_ID=xxx
   
   # VNPAY (Production keys)
   VNP_TMN_CODE=your-production-code
   VNP_HASH_SECRET=your-production-secret
   VNP_URL=https://pay.vnpay.vn/vpcpay.html
   VNP_RETURN_URL=https://your-app.vercel.app/api/payment/vnpay/return
   VNP_IPN_URL=https://your-app.vercel.app/api/payment/vnpay/ipn
   ```

4. **Cấu hình Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npx prisma generate && npm run build`
   - Output Directory: `.next`

5. **Deploy**:
   - Click "Deploy"
   - Đợi build hoàn tất (3-5 phút)

#### Bước 3: Khởi tạo Database

Sau khi deploy thành công:

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Kết nối project
vercel link

# Push schema lên database production
vercel env pull .env.production.local

npx prisma db push

# (Tùy chọn) Seed data
npx prisma db seed
```

#### Bước 4: Cấu hình Domain (Tùy chọn)

1. Vào Vercel Dashboard → Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

---

### 🚂 Deploy lên Railway

Railway là alternative tốt với PostgreSQL built-in.

#### Bước 1: Tạo Project

1. Đăng ký tại https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Chọn repository

#### Bước 2: Thêm PostgreSQL

1. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway tự động tạo `DATABASE_URL`

#### Bước 3: Cấu hình Variables

Trong tab **Variables**, thêm các biến như Vercel ở trên.

> **Lưu ý**: `DATABASE_URL` đã được Railway tự động thêm.

#### Bước 4: Deploy

1. Railway tự động detect Next.js
2. Build command: `npx prisma generate && npx prisma db push && npm run build`
3. Start command: `npm start`

---

### 🐳 Deploy với Docker (VPS/Cloud)

Phù hợp cho AWS EC2, DigitalOcean, Google Cloud, hoặc VPS riêng.

#### Bước 1: Chuẩn bị Server

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose git

# Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Bước 2: Clone và Cấu hình

```bash
# Clone repository
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2

# Tạo file .env.production
cp .env.example .env.production
nano .env.production  # Sửa các biến cần thiết
```

#### Bước 3: Docker Compose Production

Tạo file `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: otakushop
      POSTGRES_PASSWORD: your_strong_password
      POSTGRES_DB: otakushop
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://otakushop:your_strong_password@postgres:5432/otakushop
    env_file:
      - .env.production
    depends_on:
      - postgres
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
```

#### Bước 4: Build và Chạy

```bash
# Build image
docker-compose -f docker-compose.prod.yml build

# Chạy containers
docker-compose -f docker-compose.prod.yml up -d

# Khởi tạo database
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f app
```

#### Bước 5: Cấu hình SSL (Let's Encrypt)

```bash
# Cài đặt Certbot
sudo apt install certbot

# Tạo certificate
sudo certbot certonly --standalone -d yourdomain.com

# Tự động renew
sudo crontab -e
# Thêm: 0 0 * * * certbot renew --quiet
```

---

### ☁️ Deploy lên Render

#### Bước 1: Tạo Database

1. Đăng ký tại https://render.com
2. Dashboard → **New** → **PostgreSQL**
3. Chọn Free tier
4. Copy **Internal Database URL**

#### Bước 2: Tạo Web Service

1. Dashboard → **New** → **Web Service**
2. Kết nối GitHub repository
3. Cấu hình:
   - **Name**: otakushop
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`

4. Thêm Environment Variables (như Vercel)

5. Click **Create Web Service**

---

### 📋 Checklist Production

Trước khi go-live, kiểm tra:

- [ ] **Security**
  - [ ] Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên (32+ ký tự)
  - [ ] Đổi `ADMIN_PASSWORD` mạnh
  - [ ] Bật HTTPS
  - [ ] Cấu hình CORS đúng domain

- [ ] **Database**
  - [ ] Backup tự động đã bật
  - [ ] Connection pooling đã cấu hình (Neon/Supabase tự động)

- [ ] **Environment**
  - [ ] `NODE_ENV=production`
  - [ ] `NEXT_PUBLIC_APP_URL` đúng domain production
  - [ ] VNPAY đã chuyển sang production keys

- [ ] **Email**
  - [ ] Test gửi email xác thực
  - [ ] Test email thông báo đơn hàng

- [ ] **Payment**
  - [ ] VNPAY callback URLs đúng
  - [ ] Test thanh toán end-to-end

### 💰 Chi phí ước tính

| Nền tảng | Database | Web Hosting | Tổng/tháng |
|----------|----------|-------------|------------|
| **Vercel + Neon** | Free (0.5GB) | Free (100GB bandwidth) | **$0** |
| **Railway** | $5 (1GB) | Free (500 giờ) | **$5** |
| **Render** | Free (1GB, sleep after 15min) | Free | **$0** |
| **VPS (DigitalOcean)** | Included | $4-6/tháng | **$4-6** |

> 💡 **Khuyến nghị**: Bắt đầu với **Vercel + Neon** (miễn phí hoàn toàn), sau đó upgrade khi cần.

---

## 🔧 Troubleshooting

### Lỗi: "Email không gửi được"

**Nguyên nhân**: App Password chưa cấu hình đúng

**Giải pháp**:
1. Đảm bảo đã bật 2-Step Verification
2. Tạo App Password mới tại https://myaccount.google.com/apppasswords
3. Cập nhật `EMAIL_PASS` trong `.env` (16 ký tự, không dấu cách)
4. **Khởi động lại server** (`npm run dev`)

### Lỗi: "DATABASE_URL not found"

**Giải pháp**: Tạo file `.env` với:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/otakushop?schema=public
```

### Lỗi: "Can't reach database server"

**Giải pháp**:
1. Kiểm tra PostgreSQL đang chạy
2. Chạy: `docker-compose up -d postgres`
3. Kiểm tra connection string trong `.env`

### Lỗi: "Prisma Client could not be initialized"

**Giải pháp**:
```bash
npx prisma generate
```

### Lỗi: "Port 3000 already in use"

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

---

## 📊 Database Schema

Các models chính trong `prisma/schema.prisma`:

| Model | Mô tả |
|-------|-------|
| **User** | Người dùng |
| **Admin** | Quản trị viên |
| **Product** | Sản phẩm |
| **Category** | Danh mục |
| **Order** | Đơn hàng |
| **OrderItem** | Chi tiết đơn hàng |
| **CartItem** | Giỏ hàng |
| **Wishlist** | Danh sách yêu thích |
| **Review** | Đánh giá |
| **ReviewVote** | Vote helpful |
| **Address** | Địa chỉ giao hàng |
| **Coupon** | Mã giảm giá |
| **Payment** | Thông tin thanh toán |
| **Shipping** | Thông tin vận chuyển |
| **Announcement** | Thông báo |

---

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License

---

## 👥 Team

- **Dương** - Developer
- **Nguyên** - Developer  
- **Lâm** - Developer

---

**Made with ❤️ in Vietnam 🇻🇳**

---

## 🔄 Sau khi Merge Branch Cải Thiện

Nếu bạn merge branch `claude/improve-codebase-nSSTt`, cần thực hiện các bước sau:

### 1. Chạy Migration cho AdminAuditLog

```bash
# Tạo migration cho bảng admin_audit_logs mới
npx prisma migrate dev --name add_admin_audit_log

# Hoặc đẩy trực tiếp (không tạo migration file)
npx prisma db push
```

### 2. Các cải thiện đã thực hiện

| Loại | Mô tả | File |
|------|-------|------|
| **Performance** | Thêm composite indexes cho queries thường dùng | `prisma/schema.prisma` |
| **Performance** | Tối ưu tính rating review bằng aggregate | `api/reviews/route.ts` |
| **Security** | Thêm Admin Audit Log để theo dõi hành động admin | `prisma/schema.prisma` |
| **Security** | Ghi log khi admin thay đổi trạng thái đơn hàng | `api/admin/orders/[id]/status/route.ts` |
| **Clean Code** | Xóa console.log debug trong production | Nhiều files |
| **Clean Code** | Xóa file test thừa | `route-new.ts` |

### 3. Database Indexes đã thêm

```prisma
// Order - tìm đơn hàng của user theo status
@@index([userId, status])

// Review - lọc reviews đã duyệt của sản phẩm
@@index([productId, isApproved])
@@index([userId, productId])
```

### 4. Admin Audit Log Model

Model mới để theo dõi hành động của admin:

```prisma
model AdminAuditLog {
  id          String   @id @default(cuid())
  adminId     String
  action      String   // VD: "UPDATE_ORDER_STATUS"
  entityType  String   // VD: "Order", "Product"
  entityId    String
  oldValue    Json?    // Trạng thái cũ
  newValue    Json?    // Trạng thái mới
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

### 5. Xem Audit Logs (Prisma Studio)

```bash
npm run db:studio
# Mở bảng admin_audit_logs để xem lịch sử hành động admin
```

---

## 🚀 Các tính năng cần phát triển thêm

| Ưu tiên | Tính năng | Mô tả |
|---------|-----------|-------|
| HIGH | Rate Limiting | Giới hạn số request login, OTP |
| HIGH | Bật Email Verification | Yêu cầu xác thực email trước khi login |
| MEDIUM | OAuth Login | Đăng nhập bằng Google/Facebook |
| MEDIUM | Chương trình khách hàng thân thiết | Tích điểm, đổi quà |
| MEDIUM | Thông báo đẩy | Push notifications cho đơn hàng |
| LOW | API Documentation | Swagger/OpenAPI docs |
| LOW | Structured Logging | Thay console.log bằng Winston/Pino |