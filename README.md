# OtakuShop - Figure Store

Cửa hàng figure anime chính hãng - Next.js E-commerce Platform với Prisma ORM

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## Tính năng

### Frontend
- **Authentication** - Đăng ký, đăng nhập user + Admin login
- **Shopping Cart** - Giỏ hàng với quản lý số lượng real-time
- **Product Catalog** - Danh sách, chi tiết, tìm kiếm, filter sản phẩm
- **User Profile** - Profile, lịch sử đơn hàng, wishlist
- **Responsive Design** - Mobile-first với Tailwind CSS

### Backend (Prisma ORM)
- **Full API** - RESTful API với Prisma ORM
- **Order Management** - Quản lý đơn hàng đầy đủ
- **Cart & Wishlist** - Giỏ hàng và danh sách yêu thích
- **Reviews System** - Đánh giá sản phẩm với vote helpful
- **Admin Dashboard** - Quản lý products, orders, users, coupons
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

## Cấu trúc Project

```
WebSiteOtakuShopVer2/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/            # User login
│   │   │   ├── register/         # User registration
│   │   │   ├── me/               # Get current user
│   │   │   ├── profile/          # Update profile
│   │   │   └── change-password/  # Change password
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
│   ├── products/                 # Product pages
│   ├── checkout/                 # Checkout
│   └── ...                       # Other pages
├── components/                   # React Components
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx           # Auth state
│   └── CartContext.tsx           # Cart state
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Auth helpers
│   ├── admin-auth.ts             # Admin auth
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

Tạo file `.env` trong thư mục gốc:

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
```

### Bước 4: Khởi động PostgreSQL

**Dùng Docker:**
```bash
docker-compose up -d postgres
```

**Hoặc đảm bảo PostgreSQL local đang chạy.**

### Bước 5: Khởi tạo Database với Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed sample data
npm run db:seed
```

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
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
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
