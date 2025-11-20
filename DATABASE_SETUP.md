# Hướng dẫn Khởi động Database

## Vấn đề hiện tại
- ✅ Đăng nhập Admin hoạt động (không cần database)
- ❌ Đăng nhập User thường không hoạt động (cần PostgreSQL)
- ❌ Đăng ký tài khoản mới không hoạt động (cần PostgreSQL)

## Giải pháp: Khởi động PostgreSQL

### Phương án 1: Sử dụng Docker (Khuyến nghị)

**Bước 1: Cài đặt Docker**
- Windows/Mac: Tải Docker Desktop từ https://www.docker.com/products/docker-desktop
- Linux: `sudo apt install docker.io docker-compose` hoặc `sudo yum install docker docker-compose`

**Bước 2: Khởi động Database**
```bash
# Trong thư mục gốc của project
docker-compose up -d postgres

# Kiểm tra PostgreSQL đã chạy
docker ps | grep otakushop-db

# Xem logs nếu cần
docker logs otakushop-db
```

**Bước 3: Kiểm tra kết nối**
```bash
# Kiểm tra PostgreSQL có sẵn sàng không
docker exec otakushop-db pg_isready -U postgres
# Kết quả mong đợi: postgres:5432 - accepting connections
```

**Bước 4: Khởi động lại Next.js**
```bash
npm run dev
```

### Phương án 2: PostgreSQL Local (Nếu không dùng Docker)

**Windows:**
1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt với các thông số:
   - Username: `postgres`
   - Password: `postgres`
   - Port: `5432`
3. Khởi động service:
   ```cmd
   net start postgresql-x64-15
   ```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database
sudo -u postgres psql -c "CREATE DATABASE otakushop;"

# Chạy init.sql
sudo -u postgres psql -d otakushop -f init.sql
```

**macOS:**
```bash
# Sử dụng Homebrew
brew install postgresql@15
brew services start postgresql@15

# Tạo database
createdb otakushop

# Chạy init.sql
psql -d otakushop -f init.sql
```

### Phương án 3: Chỉ dùng Admin (Tạm thời)

Nếu chỉ cần kiểm tra chức năng Admin mà không cần database:

**Đăng nhập Admin:**
- URL: http://localhost:3000/login
- Email: `admin@otakushop.local`
- Password: `ChangeMeNow!`

**Thay đổi Admin Credentials:**
Chỉnh sửa file `.env.local`:
```env
ADMIN_USERNAME=your-email@domain.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_DISPLAY_NAME=Your Name
```

## Kiểm tra Database hoạt động

### Kiểm tra từ Command Line:
```bash
# Nếu dùng Docker
docker exec -it otakushop-db psql -U postgres -d otakushop -c "SELECT COUNT(*) FROM users;"

# Nếu dùng PostgreSQL local
psql -U postgres -d otakushop -c "SELECT COUNT(*) FROM users;"
```

### Kiểm tra từ Code:
```bash
# Trong terminal, chạy Next.js dev server
npm run dev

# Mở http://localhost:3000 và kiểm tra console logs
# Không còn thấy "ECONNREFUSED" error = thành công!
```

## Các lệnh Docker hữu ích

```bash
# Dừng database
docker-compose stop postgres

# Khởi động lại database
docker-compose restart postgres

# Xóa database và data (CẢNH BÁO: Mất toàn bộ dữ liệu)
docker-compose down -v

# Xem logs real-time
docker logs -f otakushop-db

# Vào PostgreSQL shell
docker exec -it otakushop-db psql -U postgres -d otakushop
```

## Troubleshooting

### Lỗi: "port 5432 already in use"
```bash
# Tìm process đang dùng port 5432
# Linux/Mac:
sudo lsof -i :5432

# Windows:
netstat -ano | findstr :5432

# Dừng PostgreSQL service nếu đang chạy
# Windows:
net stop postgresql-x64-15

# Linux:
sudo systemctl stop postgresql
```

### Lỗi: "role 'postgres' does not exist"
```bash
# Tạo user postgres
docker exec -it otakushop-db psql -U postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"
```

### Lỗi: "database 'otakushop' does not exist"
```bash
# Tạo database
docker exec -it otakushop-db psql -U postgres -c "CREATE DATABASE otakushop;"

# Chạy init script
docker exec -i otakushop-db psql -U postgres -d otakushop < init.sql
```

## Tạo User Test

Sau khi database chạy, bạn có thể tạo user test:

### Cách 1: Qua Web UI
1. Mở http://localhost:3000/register
2. Nhập thông tin:
   - Email: test@example.com
   - Username: testuser
   - Password: password123
3. Click "Đăng ký"

### Cách 2: Qua SQL
```sql
-- Kết nối vào database
docker exec -it otakushop-db psql -U postgres -d otakushop

-- Tạo user (password đã hash cho 'password123')
INSERT INTO users (email, username, password)
VALUES (
  'test@example.com',
  'testuser',
  '$2a$10$YourHashedPasswordHere'
);
```

## Kết luận

Sau khi khởi động PostgreSQL, tất cả chức năng sẽ hoạt động:
- ✅ Đăng nhập Admin
- ✅ Đăng nhập User thường
- ✅ Đăng ký tài khoản mới
- ✅ Truy cập Admin workspace

Nếu vẫn gặp vấn đề, vui lòng kiểm tra logs:
- Next.js: Terminal chạy `npm run dev`
- PostgreSQL: `docker logs otakushop-db`
