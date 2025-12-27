# OtakuShop - Figure Store

Cửa hàng figure anime chính hãng - Next.js E-commerce Platform với Prisma ORM

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## Tính năng

### Frontend
- **Authentication** - Đăng ký, đăng nhập với xác nhận email
- **Email Verification** - Xác nhận email qua link gửi tới hộp thư
- **Forgot Password** - Quên mật khẩu với email reset link
- **Shopping Cart** - Giỏ hàng với quản lý số lượng real-time
- **Product Catalog** - Danh sách, chi tiết, tìm kiếm, filter sản phẩm
- **Search Suggestions** - Gợi ý tìm kiếm real-time khi nhập
- **User Profile** - Profile, lịch sử đơn hàng, wishlist
- **Wishlist** - Danh sách yêu thích với sync server
- **Responsive Design** - Mobile-first với Tailwind CSS

### Backend (Prisma ORM)
- **Full API** - RESTful API với Prisma ORM
- **Order Management** - Quản lý đơn hàng đầy đủ
- **VNPay Payment** - Thanh toán online qua VNPay
- **Cart & Wishlist** - Giỏ hàng và danh sách yêu thích
- **Reviews System** - Đánh giá sản phẩm với vote helpful
- **Admin Dashboard** - Quản lý products, orders, users, coupons
- **Email Service** - Gửi email xác nhận qua Nodemailer/Gmail
- **Location Services** - API địa chỉ Việt Nam
- **File Upload** - Upload ảnh với UploadThing

## Tech Stack

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
| **nodemailer** | 6.x | Email sending (Gmail SMTP) |

## Cấu trúc Project

```
WebSiteOtakuShopVer2/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/            # User login
│   │   │   ├── register/         # User registration
│   │   │   ├── verify-email/     # Email verification
│   │   │   ├── resend-verification/ # Resend verification email
│   │   │   ├── forgot-password/  # Request password reset
│   │   │   ├── reset-password/   # Reset password with token
│   │   │   ├── me/               # Get current user
│   │   │   ├── profile/          # Update profile
│   │   │   └── change-password/  # Change password
│   │   ├── payment/              # Payment APIs
│   │   │   └── vnpay/            # VNPay integration
│   │   ├── admin/                # Admin APIs
│   │   │   ├── login/            # Admin login
│   │   │   ├── dashboard/        # Dashboard stats
│   │   │   ├── products/         # Product management
│   │   │   ├── orders/           # Order management
│   │   │   ├── users/            # User management
│   │   │   ├── categories/       # Category management
│   │   │   ├── coupons/          # Coupon management
│   │   │   └── reviews/          # Review moderation
│   │   ├── products/             # Products API
│   │   ├── categories/           # Categories API
│   │   ├── cart/                 # Shopping cart
│   │   ├── wishlist/             # Wishlist
│   │   ├── orders/               # Orders
│   │   ├── reviews/              # Reviews
│   │   ├── addresses/            # User addresses
│   │   ├── coupons/              # Coupon validation
│   │   └── location/             # Location services
│   ├── admin/                    # Admin Dashboard pages
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── verify-email/             # Email verification page
│   ├── forgot-password/          # Forgot password page
│   ├── reset-password/           # Reset password page
│   ├── products/                 # Product pages
│   ├── cart/                     # Cart page
│   ├── checkout/                 # Checkout pages
│   │   └── success/              # Checkout success page
│   ├── profile/                  # User profile pages
│   │   ├── orders/               # Order history
│   │   └── wishlist/             # Wishlist page
│   └── ...                       # Other pages
├── components/                   # React Components
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx           # Auth state
│   ├── CartContext.tsx           # Cart state
│   └── WishlistContext.tsx       # Wishlist state
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Auth helpers
│   ├── admin-auth.ts             # Admin auth
│   ├── email.ts                  # Email utilities (nodemailer)
│   └── ...                       # Other utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
└── ...
```

## Quick Start

### Yêu cầu

- **Node.js** 18.0+
- **PostgreSQL** 15+ (local hoặc Docker)

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

Tạo file `.env` trong thư mục gốc (tham khảo `.env.example`):

```env
# Database - Prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/otakushop?schema=public

# JWT Secret (generate với: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin Credentials (cho development)
ADMIN_USERNAME=admin@otakushop.local
ADMIN_PASSWORD=ChangeMeNow!
ADMIN_DISPLAY_NAME=Quản trị viên

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (Gmail SMTP)
# Để gửi email, bạn cần:
# 1. Bật 2-Factor Authentication cho Gmail
# 2. Tạo App Password tại: https://myaccount.google.com/apppasswords
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# VNPay Configuration (Sandbox)
VNP_TMN_CODE=your-vnpay-terminal-code
VNP_HASH_SECRET=your-vnpay-hash-secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/api/payment/vnpay/return
VNP_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn
```

### Bước 4: Khởi động PostgreSQL

**Dùng Docker:**
```bash
docker-compose up -d postgres
```

**Hoặc đảm bảo PostgreSQL local đang chạy.**

> **Lưu ý dữ liệu PostgreSQL**
> - Container postgres dùng bind mount `./data/postgres` nên dữ liệu sẽ được giữ lại dù bạn xóa container.
> - Thư mục `data/postgres` đã được ignore khỏi git; chỉ có file `.gitkeep` được commit để giữ cấu trúc thư mục.
> - Đừng `git add` dữ liệu thật của Postgres. Nếu cần reset sạch, hãy dừng container rồi xóa thư mục `data/postgres` (hoặc rename) trước khi chạy lại `docker-compose up -d postgres`.

### Bước 5: Khởi tạo Database với Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed sample data
npm run db:seed
```

> Seed sẽ tạo admin theo biến môi trường `.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_DISPLAY_NAME`). Nếu không đặt, giá trị mặc định: `admin@otakushop.com` / `admin123`.

### Bước 6: Chạy Development Server

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

## Tài khoản mặc định

### Admin Account
- **Email**: `admin@otakushop.local`
- **Password**: `ChangeMeNow!`
- **Note**: Thay đổi trong file `.env` cho production!

### Test User
Đăng ký tài khoản mới tại `/register`

> **Lưu ý**: Sau khi đăng ký, bạn cần xác nhận email trước khi đăng nhập. Check email để nhấn link xác nhận.

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database (Prisma)
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start PostgreSQL
npm run docker:down      # Stop PostgreSQL
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login (requires verified email) |
| POST | `/api/auth/register` | User registration (sends verification email) |
| GET | `/api/auth/verify-email?token=xxx` | Verify email address |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/forgot-password` | Request password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/profile` | Update profile |
| POST | `/api/auth/change-password` | Change password |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET/POST | `/api/admin/products` | Product management |
| GET/POST | `/api/admin/orders` | Order management |
| GET/POST | `/api/admin/users` | User management |

### Products & Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/[slug]` | Product detail |
| GET | `/api/categories` | List categories |

### Cart & Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/cart` | Cart operations |
| DELETE | `/api/cart/[id]` | Remove from cart |
| GET/POST | `/api/wishlist` | Wishlist operations |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/orders` | Order operations |
| GET | `/api/orders/[id]` | Order detail |
| POST | `/api/orders/[id]/cancel` | Cancel order |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/reviews` | Review operations |
| GET | `/api/products/[slug]/reviews` | Product reviews |
| GET | `/api/reviews/can-review?productId=xxx` | Check if user can review |
| POST | `/api/reviews/[id]/vote` | Vote review helpful/unhelpful |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/vnpay/create` | Create VNPay payment URL |
| GET | `/api/payment/vnpay/return` | VNPay return URL handler |
| POST | `/api/payment/vnpay/ipn` | VNPay IPN callback |

## Hướng dẫn Quản lý Sản phẩm

### Thêm sản phẩm qua Admin Dashboard

1. **Đăng nhập Admin**:
   - Truy cập `/admin` và đăng nhập với tài khoản admin
   - Mặc định: `admin@otakushop.local` / `ChangeMeNow!`

2. **Thêm sản phẩm mới**:
   - Chọn tab **"Sản phẩm"**
   - Click nút **"Thêm sản phẩm"**
   - Điền thông tin:
     - **Tên sản phẩm** (bắt buộc): Ví dụ "Figure Gojo Satoru 1/7"
     - **Mô tả** (bắt buộc): Mô tả chi tiết sản phẩm (≥20 ký tự)
     - **Giá bán** (bắt buộc): Giá VND (ví dụ: 1500000)
     - **Giá gốc**: Nếu có giảm giá, nhập giá gốc cao hơn
     - **Tồn kho** (bắt buộc): Số lượng còn hàng
     - **Danh mục** (bắt buộc): Chọn từ danh sách
     - **Hình ảnh**: Thêm URL hình ảnh

3. **Thêm hình ảnh sản phẩm**:
   - Nhập URL hình ảnh (HTTPS)
   - Click nút **"+"** để thêm vào danh sách
   - Có thể thêm nhiều hình, hình đầu tiên làm thumbnail
   - **Nguồn hình ảnh gợi ý**:
     - Upload lên [ImgBB](https://imgbb.com/)
     - Upload lên [Cloudinary](https://cloudinary.com/)
     - Sử dụng [UploadThing](https://uploadthing.com/) (tích hợp sẵn)

4. **Tùy chọn**:
   - ☑ **Hiển thị sản phẩm**: Bật/tắt hiển thị trên shop
   - ☑ **Sản phẩm nổi bật**: Hiển thị ở trang chủ

### Thêm sản phẩm qua Database (Prisma)

**Bước 1: Mở Prisma Studio**
```bash
npm run db:studio
# hoặc
npx prisma studio
```

**Bước 2: Thêm sản phẩm**
- Mở bảng **Product**
- Click **"Add record"**
- Điền các field:
  - `name`: Tên sản phẩm
  - `slug`: URL-friendly name (vd: `figure-gojo-satoru`)
  - `description`: Mô tả
  - `price`: Giá (Decimal)
  - `categoryId`: ID của category
  - `stockQuantity`: Số lượng
  - `images`: Array JSON `["url1", "url2"]`
  - `isActive`: true/false
- Click **"Save"**

**Hoặc sử dụng Prisma Client trong code:**
```typescript
import { prisma } from '@/lib/prisma';

await prisma.product.create({
  data: {
    name: 'Figure Gojo Satoru 1/7',
    slug: 'figure-gojo-satoru-1-7',
    description: 'Figure chính hãng Gojo Satoru từ Jujutsu Kaisen...',
    price: 1500000,
    categoryId: 'category-id-here',
    stockQuantity: 10,
    images: ['https://example.com/image1.jpg'],
    isActive: true,
    featured: false,
  },
});
```

### Thêm Category mới

**Qua Prisma Studio:**
- Mở bảng **Category**
- Thêm record với `name`, `slug`, `description`, `imageUrl`

**Qua code:**
```typescript
await prisma.category.create({
  data: {
    name: 'Figure Scale',
    slug: 'figure-scale',
    description: 'Figure tỉ lệ cao cấp',
    imageUrl: 'https://example.com/category.jpg',
  },
});
```

## Hướng dẫn Database Operations

### Prisma Commands

```bash
# Xem database trong trình duyệt
npx prisma studio

# Tạo Prisma Client từ schema
npx prisma generate

# Push schema changes (không tạo migration)
npx prisma db push

# Tạo migration mới
npx prisma migrate dev --name <migration-name>

# Reset database (XÓA TẤT CẢ DATA!)
npx prisma migrate reset

# Seed data mẫu
npm run db:seed
```

### Thêm field mới vào Database

**Bước 1: Sửa schema**

Edit file `prisma/schema.prisma`:
```prisma
model Product {
  // ... existing fields
  newField String? // Thêm field mới
}
```

**Bước 2: Tạo migration**
```bash
npx prisma migrate dev --name add_new_field
```

**Bước 3: Generate lại Client**
```bash
npx prisma generate
```

### Backup & Restore Database

**Backup:**
```bash
# Export toàn bộ database
pg_dump -U postgres -d otakushop > backup.sql

# Hoặc chỉ data
pg_dump -U postgres -d otakushop --data-only > data.sql
```

**Restore:**
```bash
psql -U postgres -d otakushop < backup.sql
```

### Seed Sample Data

File `prisma/seed.ts` chứa data mẫu. Chạy:
```bash
npm run db:seed
```

Data mẫu bao gồm:
- 3 Categories (Figure Scale, Nendoroid, Plush)
- 10 Products mẫu
- 1 Admin account
- 1 Test user

## Database Schema (Prisma)

Các models chính:
- **User** - Người dùng
- **Product** - Sản phẩm
- **Category** - Danh mục
- **Order** / **OrderItem** - Đơn hàng
- **CartItem** - Giỏ hàng
- **Wishlist** - Danh sách yêu thích
- **Review** / **ReviewVote** - Đánh giá
- **Address** - Địa chỉ
- **Coupon** - Mã giảm giá
- **Payment** / **Shipping** - Thanh toán & Vận chuyển
- **Admin** - Quản trị viên

Xem chi tiết: `prisma/schema.prisma`

## Troubleshooting

### Lỗi DATABASE_URL not found

```
error: Environment variable not found: DATABASE_URL
```

**Giải pháp**: Tạo file `.env` với DATABASE_URL:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/otakushop?schema=public
```

### Lỗi kết nối database

```
Can't reach database server
```

**Giải pháp**:
1. Đảm bảo PostgreSQL đang chạy
2. Kiểm tra connection string trong `.env`
3. Thử: `docker-compose up -d postgres`

### Lỗi Prisma Client

```
Prisma Client could not be initialized
```

**Giải pháp**:
```bash
npx prisma generate
```

### Lỗi gửi email

```
Error sending email: Invalid login
```

**Giải pháp**:
1. Đảm bảo đã bật 2-Factor Authentication cho Gmail
2. Tạo App Password tại: https://myaccount.google.com/apppasswords
3. Sử dụng App Password thay vì mật khẩu Gmail trong `EMAIL_PASS`
4. Kiểm tra email và mật khẩu trong file `.env`

### Lỗi VNPay

```
VNPay payment failed: Invalid checksum
```

**Giải pháp**:
1. Kiểm tra `VNP_HASH_SECRET` đúng với tài khoản VNPay
2. Đảm bảo `VNP_TMN_CODE` chính xác
3. Với môi trường test, sử dụng Sandbox credentials

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License

## Team

- Dương
- Nguyên
- Lâm

---

**Made with love in Vietnam**
