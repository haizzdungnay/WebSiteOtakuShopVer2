@echo off
chcp 65001 >nul
REM Script backup database PostgreSQL cho OtakuShop (Windows)

echo =========================================
echo    OtakuShop - Database Backup Script
echo =========================================
echo.

REM Tạo thư mục backup nếu chưa có
if not exist "backups" mkdir backups

REM Tạo tên file backup với timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BACKUP_FILE=backups\otakushop_backup_%datetime:~0,8%_%datetime:~8,6%.sql

REM Kiểm tra container có đang chạy không
docker ps --filter "name=otakushop-db" --format "{{.Names}}" 2>nul | findstr /i "otakushop-db" >nul
if errorlevel 1 (
    echo ❌ Database khong dang chay!
    echo    Vui long chay: start-db.bat
    pause
    exit /b 1
)

echo ⏳ Dang backup database...
echo    File: %BACKUP_FILE%
echo.

docker exec otakushop-db pg_dump -U postgres -d otakushop --clean --if-exists > %BACKUP_FILE%

if errorlevel 1 (
    echo ❌ Backup that bai!
    pause
    exit /b 1
)

echo.
echo ✅ Backup thanh cong!
echo.
echo File backup: %BACKUP_FILE%
echo.
echo De restore database:
echo   restore-db.bat %BACKUP_FILE%
echo.

pause
