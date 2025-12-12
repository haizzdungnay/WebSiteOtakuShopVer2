@echo off
chcp 65001 >nul
REM Script dừng PostgreSQL database cho OtakuShop (Windows)
REM DỮ LIỆU SẼ ĐƯỢC GIỮ LẠI

echo =========================================
echo    OtakuShop - Stop Database Script
echo =========================================
echo.

REM Kiểm tra container có đang chạy không
docker ps --filter "name=otakushop-db" --format "{{.Names}}" 2>nul | findstr /i "otakushop-db" >nul
if errorlevel 1 (
    echo ⚠️  Database khong dang chay
    echo.
    pause
    exit /b 0
)

echo ⏳ Dang dung PostgreSQL...
docker-compose stop postgres

if errorlevel 1 (
    echo ❌ Khong the dung database
    pause
    exit /b 1
)

echo.
echo ✅ PostgreSQL da dung thanh cong!
echo.
echo =========================================
echo    DU LIEU DA DUOC GIU LAI!
echo =========================================
echo.
echo Du lieu duoc luu trong Docker volume: otakushop_postgres_data
echo.
echo De khoi dong lai database:
echo   - Chay: start-db.bat
echo   - Hoac: docker-compose up -d postgres
echo.
echo ⚠️  LUU Y:
echo   - KHONG chay "docker-compose down -v" (se XOA du lieu!)
echo   - KHONG chay "docker volume prune" (se XOA du lieu!)
echo.

pause
