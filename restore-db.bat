@echo off
chcp 65001 >nul
REM Script restore database PostgreSQL cho OtakuShop (Windows)

echo =========================================
echo    OtakuShop - Database Restore Script
echo =========================================
echo.

REM Kiểm tra tham số
if "%~1"=="" (
    echo Cach su dung: restore-db.bat ^<backup_file.sql^>
    echo.
    echo Vi du:
    echo   restore-db.bat backups\otakushop_backup_20251212_143000.sql
    echo.
    
    REM Liệt kê các file backup có sẵn
    if exist "backups\*.sql" (
        echo Cac file backup co san:
        echo.
        dir /b backups\*.sql 2>nul
        echo.
    )
    pause
    exit /b 1
)

set BACKUP_FILE=%~1

REM Kiểm tra file có tồn tại không
if not exist "%BACKUP_FILE%" (
    echo ❌ Khong tim thay file: %BACKUP_FILE%
    pause
    exit /b 1
)

REM Kiểm tra container có đang chạy không
docker ps --filter "name=otakushop-db" --format "{{.Names}}" 2>nul | findstr /i "otakushop-db" >nul
if errorlevel 1 (
    echo ❌ Database khong dang chay!
    echo    Vui long chay: start-db.bat
    pause
    exit /b 1
)

echo ⚠️  CANH BAO: Thao tac nay se ghi de toan bo du lieu hien tai!
echo.
set /p CONFIRM="Ban co chac chan muon restore? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Huy thao tac.
    pause
    exit /b 0
)

echo.
echo ⏳ Dang restore database tu: %BACKUP_FILE%
echo.

type "%BACKUP_FILE%" | docker exec -i otakushop-db psql -U postgres -d otakushop

if errorlevel 1 (
    echo ❌ Restore that bai!
    pause
    exit /b 1
)

echo.
echo ✅ Restore thanh cong!
echo.
echo Du lieu da duoc khoi phuc tu: %BACKUP_FILE%
echo.

pause
