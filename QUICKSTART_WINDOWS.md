# 🚀 Hướng dẫn Nhanh cho Windows

## Lỗi bạn đang gặp

### ❌ Lỗi: "500 Internal Server Error for API route"
**Nguyên nhân:** Docker Desktop chưa được khởi động hoàn toàn

**Giải pháp:**
1. Mở **Docker Desktop** (tìm trong Start Menu)
2. Đợi cho đến khi Docker Desktop hiển thị "Engine running"
3. Sau đó chạy lại script

### ❌ Lỗi: "The system cannot find the path specified" khi chạy .sh file
**Nguyên nhân:** Windows không có `/bin/bash`, file `.sh` chỉ chạy được trên Linux/Mac

**Giải pháp:** Dùng file `.bat` thay vì `.sh`
```cmd
start-db.bat
```

### ❌ Lỗi: "Cannot find module init-db.js"
**Nguyên nhân:** File chưa được tạo

**Giải pháp:** File đã được tạo trong commit này

---

## 📋 Các bước khởi động (Windows)

### Bước 1: Cài đặt Docker Desktop

1. Tải Docker Desktop: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. **QUAN TRỌNG:** Đợi Docker Desktop khởi động hoàn toàn (biểu tượng Docker ở taskbar không còn animation)

### Bước 2: Khởi động PostgreSQL

**Cách 1: Dùng script tự động (Khuyến nghị)**
```cmd
start-db.bat
```

**Cách 2: Thủ công**
```cmd
docker-compose up -d postgres
```

### Bước 3: Khởi tạo Database (Chỉ lần đầu)

```cmd
node scripts/init-db.js
```

Script sẽ:
- ✅ Tạo bảng `users` và `products`
- ✅ Tạo 8 sản phẩm mẫu
- ✅ Tạo user test: `test@otakushop.local` / `password123`

### Bước 4: Khởi động Next.js

```cmd
npm run dev
```

### Bước 5: Mở trình duyệt

Truy cập: http://localhost:3000

---

## 🔧 Khắc phục sự cố Docker

### Docker Desktop không khởi động được

1. **Mở Windows PowerShell (Admin)**
2. **Chạy lệnh sau:**
```powershell
wsl --install
wsl --update
```

3. **Restart máy tính**

4. **Mở Docker Desktop lại**

### Docker Desktop bị treo

1. **Thoát Docker Desktop hoàn toàn:**
   - Right-click biểu tượng Docker ở taskbar
   - Chọn "Quit Docker Desktop"

2. **Mở Task Manager** (Ctrl+Shift+Esc)

3. **Kết thúc các process Docker:**
   - Docker Desktop
   - com.docker.backend
   - com.docker.service

4. **Khởi động lại Docker Desktop**

### Port 5432 đã được sử dụng

```cmd
REM Tìm process đang dùng port 5432
netstat -ano | findstr :5432

REM Dừng PostgreSQL local nếu có
net stop postgresql-x64-15
```

Hoặc:
1. Mở **Services** (services.msc)
2. Tìm "postgresql"
3. Right-click → Stop

### Xóa Docker containers và volumes (Reset hoàn toàn)

```cmd
REM Dừng tất cả containers
docker-compose down

REM Xóa cả volumes (CẢNH BÁO: Mất dữ liệu!)
docker-compose down -v

REM Xóa images
docker rmi websiteotakushopver2-php websiteotakushopver2-nextjs postgres:15-alpine

REM Khởi động lại
start-db.bat
```

---

## 📝 Các lệnh hữu ích

### Kiểm tra Docker

```cmd
REM Kiểm tra Docker version
docker --version

REM Kiểm tra Docker có chạy không
docker ps

REM Kiểm tra containers
docker ps -a

REM Xem logs
docker logs otakushop-db
docker logs -f otakushop-db  REM real-time
```

### Quản lý Database

```cmd
REM Kiểm tra PostgreSQL
docker exec otakushop-db pg_isready -U postgres

REM Vào PostgreSQL shell
docker exec -it otakushop-db psql -U postgres -d otakushop

REM Backup database
docker exec otakushop-db pg_dump -U postgres otakushop > backup.sql

REM Restore database
type backup.sql | docker exec -i otakushop-db psql -U postgres -d otakushop
```

### Trong PostgreSQL shell

```sql
-- Xem tất cả bảng
\dt

-- Xem users
SELECT * FROM users;

-- Xem products
SELECT * FROM products;

-- Thoát
\q
```

### Dừng và Khởi động lại

```cmd
REM Dừng database
docker-compose stop postgres

REM Khởi động lại
docker-compose start postgres

REM Dừng tất cả
docker-compose down

REM Khởi động tất cả
docker-compose up -d
```

---

## 🎯 Kiểm tra mọi thứ hoạt động

### 1. Kiểm tra Docker Desktop
- Mở Docker Desktop
- Kiểm tra tab "Containers" có container `otakushop-db` đang chạy (màu xanh)

### 2. Kiểm tra Database
```cmd
docker exec otakushop-db pg_isready -U postgres
```
Kết quả mong đợi: `postgres:5432 - accepting connections`

### 3. Test đăng nhập

**Admin Login:**
- URL: http://localhost:3000/login
- Email: `admin@otakushop.local`
- Password: `ChangeMeNow!`
- Kết quả: Redirect đến `/admin`

**User Login:**
- URL: http://localhost:3000/login
- Email: `test@otakushop.local`
- Password: `password123`
- Kết quả: Redirect đến `/` (home)

### 4. Test đăng ký
- URL: http://localhost:3000/register
- Nhập email, username, password
- Kết quả: Đăng ký thành công, tự động login

---

## ⚠️ Lưu ý quan trọng

1. **Luôn khởi động Docker Desktop trước**
   - Đợi Docker Desktop hiển thị "Engine running"
   - Không chạy lệnh khi Docker đang khởi động

2. **Không dùng bash script trên Windows**
   - ❌ KHÔNG chạy: `./start-db.sh`
   - ✅ CHẠY: `start-db.bat`

3. **Check logs nếu có lỗi**
   ```cmd
   docker logs otakushop-db
   ```

4. **Restart Docker nếu gặp 500 Error**
   - Quit Docker Desktop
   - Mở lại Docker Desktop
   - Đợi hoàn toàn khởi động
   - Chạy lại script

---

## 📞 Nếu vẫn không được

1. **Copy log lỗi đầy đủ** từ terminal
2. **Kiểm tra Docker Desktop logs:**
   - Mở Docker Desktop
   - Click biểu tượng "Bug" (Troubleshoot)
   - Xem logs

3. **Thử reset Docker:**
   - Docker Desktop Settings
   - Troubleshoot
   - Reset to factory defaults (CẢNH BÁO: Mất tất cả containers và images)

4. **Cài đặt lại Docker Desktop** nếu cần thiết

---

## 🎉 Khi mọi thứ hoạt động

Bạn sẽ thấy:
```
✅ Docker Desktop dang chay
✅ PostgreSQL da san sang!
📊 Database da duoc khoi tao voi:
   - Bang users
   - Bang products
   - 8 san pham mau
```

Giờ có thể:
- ✅ Đăng nhập admin
- ✅ Đăng nhập user thường
- ✅ Đăng ký tài khoản mới
- ✅ Truy cập admin workspace

Happy coding! 🚀
