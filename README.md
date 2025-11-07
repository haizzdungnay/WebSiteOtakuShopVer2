# OTAKU Figure Store - Otaku Shop

Cửa hàng figure anime chính hãng - E-commerce platform

## Công nghệ sử dụng

- **Next.js 15.5.6** - Framework React với App Router
- **React 19** - UI Library
- **TypeScript 5** - Type Safety
- **Tailwind CSS 3** - Styling
- **PostgreSQL 15** - Database
- **Docker** - Containerization

## Yêu cầu hệ thống

- **Node.js** 18.0 trở lên
- **PostgreSQL** 15.0 trở lên
- **Docker** và **Docker Compose** (khuyến nghị)
- **npm** hoặc **yarn**

## Cài đặt chi tiết

### Phương pháp 1: Sử dụng Docker (Khuyến nghị)

Docker giúp đảm bảo môi trường phát triển nhất quán trên mọi hệ điều hành.

#### Bước 1: Cài đặt Docker

**Windows:**
1. Tải Docker Desktop từ https://www.docker.com/products/docker-desktop
2. Chạy file cài đặt
3. Khởi động lại máy tính
4. Mở Docker Desktop và đợi khởi động hoàn tất

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**macOS:**
1. Tải Docker Desktop từ https://www.docker.com/products/docker-desktop
2. Mở file .dmg và kéo Docker vào Applications
3. Khởi động Docker từ Applications

#### Bước 2: Clone repository

**Windows (PowerShell/CMD):**
```cmd
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

**Linux/macOS:**
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

#### Bước 3: Cấu hình môi trường

Tạo file `.env.local` trong thư mục gốc:

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
notepad .env.local
```

**Windows (CMD):**
```cmd
type nul > .env.local
notepad .env.local
```

**Linux/macOS:**
```bash
touch .env.local
nano .env.local
```

Thêm nội dung sau vào file `.env.local`:

```env
# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=otakushop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourStrongPassword123

# JWT Secret (thay đổi thành chuỗi ngẫu nhiên)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Bước 4: Khởi động với Docker

**Windows:**
```cmd
docker-compose up --build
```

**Linux/macOS:**
```bash
docker-compose up --build
```

Đợi 2-3 phút để Docker build và khởi động. Khi thấy:
```
web-1       | ▲ Next.js 15.5.6
web-1       | - Local: http://localhost:3000
```

Truy cập: **http://localhost:3000**

#### Bước 5: Khởi tạo database

Mở terminal/cmd mới và chạy:

**Windows:**
```cmd
docker-compose exec web node scripts/init-db.js
```

**Linux/macOS:**
```bash
docker-compose exec web node scripts/init-db.js
```

---

### Phương pháp 2: Chạy trực tiếp (Development)

Phù hợp khi bạn muốn phát triển và debug code.

#### Bước 1: Cài đặt PostgreSQL

**Windows:**
1. Tải PostgreSQL từ https://www.postgresql.org/download/windows/
2. Chạy installer, chọn port 5432
3. Đặt password cho user postgres
4. Cài đặt pgAdmin (đi kèm trong installer)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Bước 2: Tạo database

**Windows (PowerShell):**
```powershell
# Mở psql
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Trong psql, chạy:
CREATE DATABASE otakushop;
\q
```

**Linux/macOS:**
```bash
sudo -u postgres psql
CREATE DATABASE otakushop;
\q
```

#### Bước 3: Clone và cài đặt

```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
npm install
```

#### Bước 4: Cấu hình môi trường

Tạo file `.env.local`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=otakushop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
JWT_SECRET=your-secret-key-here
```

#### Bước 5: Khởi tạo database

```bash
node scripts/init-db.js
```

#### Bước 6: Chạy development server

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

---

## Các lệnh thường dùng

### Docker Commands

**Khởi động services:**
```bash
docker-compose up
```

**Khởi động ở chế độ background:**
```bash
docker-compose up -d
```

**Dừng services:**
```bash
docker-compose down
```

**Xóa tất cả (bao gồm database):**
```bash
docker-compose down -v
```

**Xem logs:**
```bash
docker-compose logs -f web
docker-compose logs -f postgres
```

**Truy cập container:**
```bash
docker-compose exec web sh
docker-compose exec postgres psql -U postgres
```

**Rebuild container:**
```bash
docker-compose up --build
```

### NPM Commands

```bash
npm run dev          # Chạy development (http://localhost:3000)
npm run build        # Build production
npm start            # Chạy production server
npm run lint         # Kiểm tra linting errors
```

### Database Commands

**Khởi tạo lại database:**

**Windows:**
```cmd
docker-compose exec web node scripts/init-db.js
```

**Linux/macOS:**
```bash
docker-compose exec web node scripts/init-db.js
```

---

## Cấu trúc thư mục

```
WebSiteOtakuShopVer2/
├── app/                       # Next.js App Router
│   ├── page.tsx              # Trang chủ
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/                # Trang đăng nhập
│   ├── register/             # Trang đăng ký
│   ├── products/             # Danh sách & chi tiết sản phẩm
│   │   ├── page.tsx
│   │   └── [slug]/          # Dynamic route
│   ├── faq/                  # Câu hỏi thường gặp
│   ├── tin-tuc/              # Tin tức/Blog
│   ├── tinh-gia/             # Tính giá gom hàng
│   ├── tra-cuu/              # Tra cứu đơn hàng
│   ├── giao-hang/            # Chính sách giao hàng
│   └── api/                  # API Routes
│       ├── auth/             # Authentication
│       └── products/         # Products
├── components/                # React Components
│   ├── Header.tsx            # Header với menu dropdown
│   ├── Footer.tsx            # Footer
│   ├── Sidebar.tsx           # Sidebar menu
│   ├── ProductCard.tsx       # Product card component
│   ├── CartDropdown.tsx      # Shopping cart dropdown
│   └── FloatingButtons.tsx   # Floating action buttons
├── contexts/                  # React Contexts
│   ├── AuthContext.tsx       # Authentication state
│   └── CartContext.tsx       # Shopping cart state
├── lib/                       # Utilities
│   ├── db.ts                 # Database connection
│   └── auth.ts               # Auth utilities
├── public/                    # Static files
│   └── images/               # Images
├── scripts/                   # Utility scripts
│   └── init-db.js            # Database initialization
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Docker build
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## Tính năng

### Đã hoàn thành ✅
- Xác thực người dùng (Register/Login/Logout)
- Quản lý giỏ hàng (Add/Remove/Update quantity)
- Danh sách sản phẩm với filter
- Trang chi tiết sản phẩm (gallery, countdown, tabs)
- Tin tức/Blog với sidebar và pagination
- FAQ với accordion
- Tính giá gom hàng (JPY to VND calculator)
- Tra cứu đơn hàng với search và filter
- Chính sách giao hàng & bảo hành
- User account dropdown
- Menu dropdown với categories
- Responsive design

### Đang phát triển 🚧
- Payment integration
- Order management
- Admin dashboard
- Social login (Google, Facebook)

---

## API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "username": "username",
  "password": "password123"
}
```

**POST** `/api/auth/logout`
- No body required
- Returns: `{ success: true }`

**GET** `/api/auth/me`
- Headers: `Cookie: token=<jwt_token>`
- Returns: User info

### Products

**GET** `/api/products`
- Returns: List of all products

---

## Troubleshooting

### 1. Docker build fails

**Lỗi**: `Cannot connect to Docker daemon`

**Windows:**
- Mở Docker Desktop
- Đảm bảo Docker đang chạy (icon ở taskbar màu xanh)
- Chạy lại `docker-compose up`

**Linux:**
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# Đăng xuất và đăng nhập lại
```

### 2. Port đã được sử dụng

**Lỗi**: `Port 3000 is already in use`

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
lsof -ti:3000 | xargs kill -9
```

Hoặc đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay 3000 bằng port khác
```

### 3. Database connection error

**Lỗi**: `ECONNREFUSED` hoặc `Connection refused`

**Kiểm tra PostgreSQL đang chạy:**
```bash
docker-compose ps
```

**Restart PostgreSQL:**
```bash
docker-compose restart postgres
```

**Xem logs:**
```bash
docker-compose logs postgres
```

### 4. Hydration error

**Lỗi**: `Hydration failed` hoặc `Text content did not match`

**Giải pháp:**
```bash
# Xóa cache và rebuild
rm -rf .next
npm run build
```

### 5. npm install fails

**Windows:**
```cmd
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

**Linux/macOS:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 6. Build errors after git pull

**Xóa build cache:**

**Windows:**
```cmd
rmdir /s /q .next
rmdir /s /q node_modules
npm install
npm run build
```

**Linux/macOS:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## Development Tips

### Hot Reload không hoạt động

Restart dev server:
```bash
# Dừng (Ctrl+C)
npm run dev
```

### Thay đổi database schema

```bash
# Xóa database và tạo lại
docker-compose down -v
docker-compose up -d postgres
docker-compose exec web node scripts/init-db.js
```

### Debug trong Docker

```bash
# Truy cập container
docker-compose exec web sh

# Xem biến môi trường
docker-compose exec web env

# Xem logs real-time
docker-compose logs -f web
```

---

## Team

- Dương
- Nguyên
- Lâm

## License

MIT License
