# 🎌 Otaku Shop - Figure Store

> Cửa hàng figure anime - Next.js + PostgreSQL
> Đồ án môn Lập trình Web

## 🚀 Chạy nhanh (5 phút)

### Yêu cầu

- Node.js 18+
- Docker Desktop (cho database)

### Cài đặt

```bash
# 1. Clone project
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2

# 2. Cài dependencies
npm install

# 3. Tạo file .env
cp .env.example .env.local

# 4. Chạy database với Docker
docker-compose up postgres -d

# 5. Chạy development server
npm run dev
```

**Xong!** Mở http://localhost:3000

## 📦 Hoặc chạy toàn bộ bằng Docker

```bash
# Build và chạy tất cả
docker-compose up -d

# Xem logs
docker-compose logs -f nextjs
```

## 📁 Cấu trúc project

```
├── app/              # Next.js pages & API routes
│   ├── api/         # REST API endpoints
│   ├── login/       # Trang đăng nhập
│   ├── register/    # Trang đăng ký
│   └── products/    # Trang sản phẩm
├── components/       # React components
├── lib/             # Database, JWT, utilities
├── public/          # Static files
└── types/           # TypeScript types
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user

### Products
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm (cần auth)

## 🛠️ Công nghệ

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Auth**: JWT, bcrypt
- **DevOps**: Docker, Docker Compose

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm start            # Start production
npm run lint         # Lint code

# Docker
npm run docker:build # Build images
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
```

## 👥 Team

- **Dương** - Full-Stack
- **Nguyên** - Backend
- **Lâm** - Frontend

## 📜 License

ISC License © 2025 Team Dương - Nguyên - Lâm
