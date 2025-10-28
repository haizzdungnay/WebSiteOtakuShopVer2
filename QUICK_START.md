# 🚀 Quick Start Guide - Otaku Shop

Hướng dẫn nhanh để chạy dự án Otaku Shop trong 5 phút!

## 📋 Yêu Cầu

- **Node.js** 18+ ([Tải tại đây](https://nodejs.org/))
- **Docker Desktop** ([Tải tại đây](https://www.docker.com/products/docker-desktop))
- **Git**

Kiểm tra cài đặt:
```bash
node --version   # Cần >= v18.x
docker --version # Cần >= 20.x
git --version
```

---

## ⚡ Phương Án 1: Docker (KHUYẾN NGHỊ - ĐƠN GIẢN NHẤT)

### Chỉ 3 Bước!

**Bước 1: Clone dự án**
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

**Bước 2: Build Docker images**
```bash
npm run docker:build
```

**Bước 3: Khởi động tất cả services**
```bash
npm run docker:up
```

**✅ Xong! Truy cập:**
- **Website**: http://localhost:3000
- **PHP Legacy**: http://localhost:8080
- **Database**: localhost:5432

### Lệnh Docker Hữu Ích

```bash
# Xem logs
npm run docker:logs

# Dừng services
npm run docker:down

# Reset hoàn toàn (xóa database)
npm run docker:clean
npm run docker:build
npm run docker:up

# Restart một service
docker-compose restart nextjs
docker-compose restart postgres

# Vào database shell
npm run db:studio
```

---

## 💻 Phương Án 2: Local Development (Hot Reload Nhanh)

### 4 Bước!

**Bước 1: Clone và cài đặt**
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
npm install
```

**Bước 2: Chạy PostgreSQL bằng Docker**
```bash
docker-compose up postgres -d
```

**Bước 3: Environment đã được tạo sẵn**
File `.env.local` đã có sẵn với cấu hình mặc định:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=otakushop
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters-required
JWT_EXPIRES_IN=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Bước 4: Chạy development server**
```bash
npm run dev
```

**✅ Xong! Truy cập:** http://localhost:3000

---

## 🧪 Test Nhanh

### 1. Test Authentication

**Đăng ký tài khoản:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

**Đăng nhập:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Products API

```bash
# Lấy danh sách products
curl http://localhost:3000/api/products

# Lấy products theo category
curl http://localhost:3000/api/products?category=nendoroid
```

### 3. Test Trong Browser

1. Mở http://localhost:3000
2. Click "Register" → Đăng ký tài khoản
3. Đăng nhập với tài khoản vừa tạo
4. Vào http://localhost:3000/products xem sản phẩm

---

## 🛠️ Commands Thường Dùng

### Development
```bash
npm run dev           # Chạy dev server (port 3000)
npm run dev:turbo     # Chạy với Turbopack (nhanh hơn)
npm run build         # Build production
npm run start         # Chạy production build
```

### Code Quality
```bash
npm run lint          # Check linting errors
npm run lint:fix      # Tự động fix linting errors
npm run format        # Format code với Prettier
npm run type-check    # Check TypeScript errors
npm run validate      # Chạy tất cả checks (lint + format + type-check)
```

### Docker
```bash
npm run docker:build  # Build images
npm run docker:up     # Start containers
npm run docker:down   # Stop containers
npm run docker:logs   # Xem logs
npm run docker:clean  # Xóa containers và volumes
npm run docker:restart # Restart tất cả services
```

### Database
```bash
npm run db:studio     # Mở PostgreSQL shell
npm run db:logs       # Xem PostgreSQL logs
```

---

## ❌ Troubleshooting

### Port đã được sử dụng

**Cách 1: Tắt process đang dùng port**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:5432 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5432).OwningProcess | Stop-Process
```

**Cách 2: Đổi port trong docker-compose.yml**
```yaml
services:
  nextjs:
    ports:
      - "3001:3000"  # Đổi thành port khác
```

### Database connection error

```bash
# Reset database
npm run docker:down
docker volume rm websiteotakushopver2_postgres_data
npm run docker:up
```

### Build errors

```bash
# Xóa cache và rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Docker không chạy

1. Mở Docker Desktop
2. Đảm bảo Docker đang chạy: `docker ps`
3. Restart Docker Desktop nếu cần

---

## 📚 Tài Liệu Chi Tiết

- **[SETUP.md](SETUP.md)** - Hướng dẫn setup chi tiết
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Best practices cho development
- **[README.md](README.md)** - Tài liệu tổng quan dự án
- **[SECURITY.md](SECURITY.md)** - Bảo mật và best practices

---

## 🎯 Next Steps

Sau khi chạy được dự án:

1. ✅ Đọc [DEVELOPMENT.md](DEVELOPMENT.md) để hiểu code structure
2. ✅ Xem [README.md](README.md) để biết features và API
3. ✅ Check [SECURITY.md](SECURITY.md) trước khi deploy production
4. ✅ Customize và phát triển theo ý bạn!

---

## 💡 Tips

- **Hot Reload**: Dùng `npm run dev` cho development, code thay đổi tự động reload
- **Debug**: Check logs với `npm run docker:logs` hoặc `docker-compose logs -f nextjs`
- **Database**: Dùng `npm run db:studio` để truy cập PostgreSQL shell
- **Code Quality**: Chạy `npm run validate` trước khi commit
- **Performance**: Dùng `npm run dev:turbo` cho build nhanh hơn với Turbopack

---

## 🆘 Cần Trợ Giúp?

- 📖 Đọc tài liệu trong thư mục `docs/`
- 🐛 Báo lỗi tại [GitHub Issues](https://github.com/haizzdungnay/WebSiteOtakuShopVer2/issues)
- 💬 Hỏi team: Dương - Nguyên - Lâm

**Happy Coding! 🎌**
