# 🎌 Otaku Shop - Full-Stack E-Commerce Platform

![CI/CD](https://github.com/haizzdungnay/WebSiteOtakuShopVer2/workflows/CI/CD%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

> A modern full-stack web application for anime and manga enthusiasts
> 
> đây là một đồ án môn lập trình web của team Dương - Nguyên - Lâm

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 🛡️ **CSRF/XSS Protection** - Comprehensive security measures
- 💾 **PostgreSQL Database** - Robust relational database backend
- ⚛️ **Next.js 15** - Modern React framework with App Router
- 🎨 **Tailwind CSS** - Beautiful, responsive UI
- 📦 **Context API** - Efficient state management
- 🐳 **Docker Support** - Easy deployment with containerization
- 🔧 **PHP Legacy Integration** - Backward compatibility
- 📝 **Postman Collection** - Ready-to-use API testing
- ⚡ **GitHub Actions CI** - Automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (optional, included in Docker setup)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Start with Docker (Recommended)**
```bash
npm run docker:up
```

Or **run locally**:
```bash
# Start PostgreSQL separately
docker-compose up postgres -d

# Run development server
npm run dev
```

5. **Access the application**
- Main App: http://localhost:3000
- PHP Legacy: http://localhost:8080
- API: http://localhost:3000/api

## 📁 Project Structure

```
WebSiteOtakuShopVer2/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── products/        # Product endpoints
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── products/            # Products listing
│   └── layout.tsx           # Root layout
├── contexts/                 # React Context
│   └── AuthContext.tsx      # Auth state management
├── lib/                      # Utilities
│   ├── db.ts                # Database connection
│   ├── jwt.ts               # JWT utilities
│   ├── csrf.ts              # CSRF protection
│   └── sanitize.ts          # XSS protection
├── public/                   # Static files
│   └── php/                 # PHP legacy pages
├── .github/                  # GitHub Actions
│   └── workflows/           
│       └── ci.yml           # CI/CD pipeline
├── Dockerfile               # Next.js container
├── Dockerfile.php           # PHP container
├── docker-compose.yml       # Docker orchestration
├── init.sql                 # Database schema
├── postman_collection.json  # API tests
├── SECURITY.md              # Security checklist
└── DOCUMENTATION.md         # Full documentation
```

## 🔐 Security Features

- ✅ JWT authentication with secure token handling
- ✅ CSRF token protection for state-changing requests
- ✅ XSS protection through input sanitization
- ✅ SQL injection prevention with parameterized queries
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Password hashing with bcryptjs
- ✅ Secure cookie configuration
- ✅ Environment-based secrets management

See [SECURITY.md](SECURITY.md) for complete security checklist.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (authenticated)

See [DOCUMENTATION.md](DOCUMENTATION.md) for detailed API documentation.

## 🧪 Testing

### Run Tests with Postman

1. Import `postman_collection.json` into Postman
2. Set variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (obtained from login/register)
3. Run the collection

### Manual Testing

```bash
# Test authentication flow
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Test product listing
curl http://localhost:3000/api/products
```

## 🐳 Docker Commands

```bash
# Build images
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Restart services
docker-compose restart
```

## 📚 Documentation

- [Complete Documentation](DOCUMENTATION.md)
- [Security Checklist](SECURITY.md)
- [API Reference](DOCUMENTATION.md#api-documentation)
- [Deployment Guide](DOCUMENTATION.md#deployment)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **Next.js API Routes** - Serverless functions
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **PHP 8.2** - Legacy integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run docker:build # Build Docker images
npm run docker:up    # Start Docker containers
npm run docker:down  # Stop Docker containers
```

## 🌟 Key Highlights

- **Modern Stack**: Built with the latest versions of Next.js and React
- **Secure by Design**: Multiple layers of security protection
- **Production Ready**: Complete with Docker setup and CI/CD
- **Well Documented**: Comprehensive documentation and examples
- **Easy to Extend**: Clean architecture and modular design

## 👥 Team

- **Dương** - Development
- **Nguyên** - Development
- **Lâm** - Development

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- PostgreSQL community
- All contributors and supporters

---

**Made with ❤️ by Team Dương - Nguyên - Lâm**
