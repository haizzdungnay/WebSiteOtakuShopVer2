# 🎌 OtakuShop - Figure Store

Cửa hàng figure anime chính hãng - Next.js E-commerce Platform với Admin Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## ✨ Tính năng

- 🔐 **Authentication System** - Đăng ký, đăng nhập user + Admin login tự động phát hiện
- 🛒 **Shopping Cart** - Giỏ hàng với quản lý số lượng real-time
- 📦 **Product Catalog** - Danh sách, chi tiết, tìm kiếm, filter sản phẩm
- 👤 **User Management** - Profile, lịch sử đơn hàng, preorders
- 🎯 **Admin Dashboard** - Quản lý sản phẩm, đơn hàng, thông báo, doanh thu
- 🔒 **Security Features** - JWT authentication, CSRF protection, input validation, XSS prevention
- 🐳 **Docker Support** - Full containerized stack (PostgreSQL + Next.js)
- 📱 **Responsive Design** - Mobile-first với Tailwind CSS
- 🌐 **API Routes** - RESTful API với validation và error handling
- ⚡ **Health Checks** - Endpoint monitoring cho database và API

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **PostgreSQL** | 15-alpine | Relational database |
| **Docker** | Latest | Containerization |
| **bcryptjs** | 3.0.2 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **Lucide React** | Latest | Icon library |

## 📁 Cấu trúc Project

```
WebSiteOtakuShopVer2/
├── app/                          # Next.js App Router
│   ├── admin/                    # 🔐 Admin Dashboard
│   │   └── page.tsx             # Admin management interface
│   ├── api/                      # API Routes
│   │   ├── admin/               # Admin endpoints
│   │   │   └── login/           # Admin authentication
│   │   ├── auth/                # User authentication
│   │   │   ├── login/           # User login
│   │   │   ├── register/        # User registration
│   │   │   ├── logout/          # Logout endpoint
│   │   │   └── me/              # Get current user
│   │   ├── csrf/                # CSRF token generation
│   │   ├── health/              # 🆕 Health check endpoint
│   │   └── products/            # Products API
│   ├── login/                    # Login page (auto-detects admin)
│   ├── register/                 # Registration page
│   ├── products/                 # Product catalog
│   │   ├── page.tsx             # Products list
│   │   └── [slug]/              # Product detail
│   ├── characters/               # Character pages
│   ├── profile/                  # User profile
│   ├── checkout/                 # Checkout process
│   ├── search/                   # Search results
│   ├── tin-tuc/                  # News/Blog
│   ├── tinh-gia/                 # Price calculator
│   ├── tra-cuu/                  # Order tracking
│   ├── giao-hang/                # Shipping info
│   ├── faq/                      # FAQ
│   ├── new-releases/             # New products
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Homepage
├── components/                   # Reusable Components
│   ├── Header.tsx                # Main navigation
│   ├── Footer.tsx                # Footer
│   ├── Sidebar.tsx               # Category sidebar
│   ├── MenuSidebar.tsx           # Mobile menu
│   ├── ProductCard.tsx           # Product card
│   ├── CartDropdown.tsx          # Shopping cart
│   └── FloatingButtons.tsx       # Floating action buttons
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx           # Auth state management
│   └── CartContext.tsx           # Cart state management
├── lib/                          # Utilities & Helpers
│   ├── db.ts                     # PostgreSQL connection
│   ├── jwt.ts                    # JWT generation/verification
│   ├── csrf.ts                   # CSRF token utilities
│   ├── sanitize.ts               # XSS prevention
│   └── validators.ts             # 🆕 Input validation
├── types/                        # TypeScript Types
│   └── product.ts                # Product types
├── public/                       # Static Assets
│   └── images/                   # Images directory
├── scripts/                      # Utility Scripts
│   └── init-db.js                # Database initialization
├── docker-compose.yml            # Docker services config
├── Dockerfile                    # Next.js Docker image
├── middleware.ts                 # Route protection middleware
├── init.sql                      # Database schema
├── start-db.bat                  # 🪟 Database startup (Windows)
├── start-db.sh                   # 🐧 Database startup (Linux/Mac)
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── .env.local                    # Local config (gitignored)
├── DATABASE_SETUP.md             # Database setup guide
├── QUICKSTART_WINDOWS.md         # Windows quick start
└── README.md                     # This file
```

## 🚀 Quick Start

### Yêu cầu

- **Node.js** 18.0+
- **Docker** & **Docker Desktop** (khuyến nghị)
- **PostgreSQL** 15+ (nếu không dùng Docker)

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

```bash
# Copy template
cp .env.example .env.local

# Generate strong JWT secret
openssl rand -base64 32
```

**Chỉnh sửa `.env.local`:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=otakushop
DB_USER=postgres
DB_PASSWORD=your_strong_password

# JWT (⚠️ REQUIRED - generate với openssl rand -base64 32)
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=7d

# Admin Credentials (⚠️ CHANGE IN PRODUCTION)
ADMIN_USERNAME=admin@yourdomain.com
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_DISPLAY_NAME=Admin Name

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Bước 4: Khởi động Database

**Windows:**
```cmd
start-db.bat
```

**Linux/Mac:**
```bash
./start-db.sh
```

Hoặc thủ công:
```bash
docker-compose up -d postgres
```

### Bước 5: Khởi tạo Database (lần đầu)

```bash
node scripts/init-db.js
```

Output:
```
🚀 Starting database initialization...
✅ Database connection successful!
✅ Users table created
✅ Products table created
✅ Sample products inserted
✅ Test user created
   Email: test@otakushop.local
   Password: password123
🎉 Database initialization completed!
```

### Bước 6: Khởi động Development Server

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

## 🔑 Tài khoản mặc định

### Admin Account
- **URL**: http://localhost:3000/login
- **Email**: `admin@otakushop.local` (hoặc theo `.env.local`)
- **Password**: `ChangeMeNow!` (⚠️ **Thay đổi trong production!**)
- **Redirect**: Sau login → `/admin` (Admin Dashboard)

### Test User Account
- **URL**: http://localhost:3000/login
- **Email**: `test@otakushop.local`
- **Password**: `password123`
- **Redirect**: Sau login → `/` (Homepage)

### Đăng ký mới
- **URL**: http://localhost:3000/register
- Nhập email, username, password
- Tự động login sau đăng ký

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Docker
npm run docker:build     # Build Docker images
npm run docker:up        # Start all services
npm run docker:down      # Stop all services

# Database
start-db.bat             # Start PostgreSQL (Windows)
./start-db.sh            # Start PostgreSQL (Linux/Mac)
node scripts/init-db.js  # Initialize database
```

## 🐳 Docker Deployment

### Start Full Stack

```bash
docker-compose up -d
```

Services:
- **PostgreSQL**: `localhost:5432`
- **Next.js**: `localhost:3000`

### Stop Services

```bash
docker-compose down
```

### Reset Database (⚠️ Xóa dữ liệu)

```bash
docker-compose down -v
docker-compose up -d postgres
node scripts/init-db.js
```

### View Logs

```bash
docker logs -f otakushop-db     # PostgreSQL logs
docker logs -f otakushop-app    # Next.js logs
```

## 🔒 Security Features

### Implemented

✅ **JWT Authentication** - Token-based auth với secure secret
✅ **CSRF Protection** - Token validation cho state-changing requests
✅ **Password Hashing** - bcrypt với salt rounds
✅ **Input Validation** - Email, password, username validation
✅ **XSS Prevention** - Input sanitization
✅ **SQL Injection Prevention** - Parameterized queries
✅ **Route Protection** - Middleware cho admin routes
✅ **Secure Cookies** - httpOnly, sameSite, secure flags
✅ **Environment Secrets** - No hardcoded credentials

### Security Checklist for Production

- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Change `DB_PASSWORD` from default
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (secure cookies)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable database SSL
- [ ] Set up error logging (Sentry, etc.)
- [ ] Regular security audits

## 🧪 API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "healthy",
    "api": "healthy"
  }
}
```

### Authentication

#### User Login
```
POST /api/auth/login
Content-Type: application/json
X-CSRF-Token: <token>

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Admin Login
```
POST /api/admin/login
Content-Type: application/json
X-CSRF-Token: <token>

{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json
X-CSRF-Token: <token>

{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123"
}
```

#### Get Current User
```
GET /api/auth/me
Cookie: token=<jwt_token>
```

#### Logout
```
POST /api/auth/logout
Cookie: token=<jwt_token>
```

### CSRF Token
```
GET /api/csrf
```

Response:
```json
{
  "token": "csrf_token_here"
}
```

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: `ECONNREFUSED` hoặc `Connection refused`

**Solution**:
1. Kiểm tra Docker Desktop đang chạy
2. Kiểm tra PostgreSQL container:
   ```bash
   docker ps | grep otakushop-db
   ```
3. Restart database:
   ```bash
   docker-compose restart postgres
   ```
4. Xem logs:
   ```bash
   docker logs otakushop-db
   ```

### JWT Secret Error

**Error**: `JWT_SECRET environment variable is required`

**Solution**:
1. Generate secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to `.env.local`:
   ```env
   JWT_SECRET=your_generated_secret
   ```

### Admin Cannot Access Dashboard

**Solution**:
1. Clear browser cookies
2. Login lại với admin credentials
3. Check middleware logs in terminal
4. Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`

### Port Already in Use

**Error**: `Port 3000 already in use`

**Windows**:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac**:
```bash
lsof -ti:3000 | xargs kill -9
```

### Docker Build Fails

**Solution**:
1. Ensure Docker Desktop is running
2. Clear Docker cache:
   ```bash
   docker system prune -a
   ```
3. Rebuild:
   ```bash
   docker-compose build --no-cache
   ```

## 📚 Documentation

- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Chi tiết setup database
- **[QUICKSTART_WINDOWS.md](QUICKSTART_WINDOWS.md)** - Hướng dẫn Windows
- **[.env.example](.env.example)** - Environment variables

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Team

- Dương
- Nguyên
- Lâm

## 🙏 Acknowledgments

- Next.js team
- React team
- PostgreSQL community
- All contributors

---

**Made with ❤️ in Vietnam**
