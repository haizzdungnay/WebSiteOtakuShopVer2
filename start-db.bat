@echo off
chcp 65001 >nul
REM Script khởi động PostgreSQL database cho OtakuShop (Windows)

echo =========================================
echo    OtakuShop - Database Startup Script
echo =========================================
echo.

REM Kiểm tra Docker có cài đặt không
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker chua duoc cai dat!
    echo    Vui long cai dat Docker Desktop tu: https://www.docker.com/products/docker-desktop
    echo    Hoac xem DATABASE_SETUP.md de su dung PostgreSQL local
    pause
    exit /b 1
)

echo ✅ Docker da duoc cai dat

REM Kiểm tra Docker Desktop có chạy không
docker ps >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  QUAN TRONG: Docker Desktop chua chay!
    echo.
    echo Vui long:
    echo 1. Mo Docker Desktop
    echo 2. Doi Docker Desktop khoi dong xong
    echo 3. Chay lai script nay
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Desktop dang chay
echo.

REM Kiểm tra xem PostgreSQL container đã tồn tại chưa
docker ps -a | findstr otakushop-db >nul 2>&1
if errorlevel 1 (
    echo 🚀 Tao va khoi dong PostgreSQL container moi...
    echo.

    docker-compose up -d postgres

    echo ⏳ Doi PostgreSQL khoi dong...
    timeout /t 10 /nobreak >nul

    REM Kiểm tra kết nối
    docker exec otakushop-db pg_isready -U postgres >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  PostgreSQL dang khoi dong, vui long doi them vai giay...
    ) else (
        echo ✅ PostgreSQL da san sang!
        echo.
        echo 📊 Database da duoc khoi tao voi:
        echo    - Bang users
        echo    - Bang products
        echo    - 8 san pham mau
    )
) else (
    echo 📦 Container PostgreSQL da ton tai

    REM Kiểm tra xem đang chạy hay không
    docker ps | findstr otakushop-db >nul 2>&1
    if errorlevel 1 (
        echo ⚙️  Dang khoi dong PostgreSQL...
        docker start otakushop-db

        echo ⏳ Doi PostgreSQL khoi dong...
        timeout /t 5 /nobreak >nul

        docker exec otakushop-db pg_isready -U postgres >nul 2>&1
        if errorlevel 1 (
            echo ⚠️  PostgreSQL dang khoi dong, vui long doi them vai giay...
        ) else (
            echo ✅ PostgreSQL da san sang!
        )
    ) else (
        echo ✅ PostgreSQL dang chay
        echo.
        echo Thong tin ket noi:
        echo   Host: localhost
        echo   Port: 5432
        echo   Database: otakushop
        echo   Username: postgres
        echo   Password: postgres
    )
)

echo.
echo =========================================
echo    Database da san sang su dung!
echo =========================================
echo.
echo Buoc tiep theo:
echo 1. Chay Next.js: npm run dev
echo 2. Mo trinh duyet: http://localhost:3000
echo 3. Dang nhap admin hoac dang ky tai khoan moi
echo.
echo Dang nhap Admin:
echo   Email: admin@otakushop.local
echo   Password: ChangeMeNow!
echo.
echo Lenh huu ich:
echo   - Xem logs: docker logs -f otakushop-db
echo   - Dung DB: docker-compose stop postgres
echo   - Vao psql: docker exec -it otakushop-db psql -U postgres -d otakushop
echo.

pause
