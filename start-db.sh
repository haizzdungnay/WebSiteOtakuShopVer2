#!/bin/bash

# Script khởi động PostgreSQL database cho OtakuShop

echo "========================================="
echo "   OtakuShop - Database Startup Script   "
echo "========================================="
echo ""

# Kiểm tra Docker có cài đặt không
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt!"
    echo "   Vui lòng cài đặt Docker từ: https://www.docker.com/products/docker-desktop"
    echo "   Hoặc xem DATABASE_SETUP.md để sử dụng PostgreSQL local"
    exit 1
fi

# Kiểm tra Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose chưa được cài đặt!"
    echo "   Vui lòng cài đặt Docker Compose"
    exit 1
fi

echo "✅ Docker đã được cài đặt"
echo ""

# Kiểm tra xem PostgreSQL container đã tồn tại chưa
if docker ps -a | grep -q otakushop-db; then
    echo "📦 Container PostgreSQL đã tồn tại"

    # Kiểm tra xem đang chạy hay không
    if docker ps | grep -q otakushop-db; then
        echo "✅ PostgreSQL đang chạy"
        echo ""
        echo "Thông tin kết nối:"
        echo "  Host: localhost"
        echo "  Port: 5432"
        echo "  Database: otakushop"
        echo "  Username: postgres"
        echo "  Password: postgres"
    else
        echo "⚙️  Đang khởi động PostgreSQL..."
        docker start otakushop-db

        # Đợi PostgreSQL sẵn sàng
        echo "⏳ Đợi PostgreSQL khởi động..."
        sleep 5

        # Kiểm tra kết nối
        if docker exec otakushop-db pg_isready -U postgres &> /dev/null; then
            echo "✅ PostgreSQL đã sẵn sàng!"
        else
            echo "⚠️  PostgreSQL đang khởi động, vui lòng đợi thêm vài giây..."
        fi
    fi
else
    echo "🚀 Tạo và khởi động PostgreSQL container mới..."
    echo ""

    # Khởi động PostgreSQL với docker-compose
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d postgres
    else
        docker compose up -d postgres
    fi

    # Đợi PostgreSQL sẵn sàng
    echo "⏳ Đợi PostgreSQL khởi động..."
    sleep 10

    # Kiểm tra kết nối
    MAX_TRIES=30
    TRIES=0

    while [ $TRIES -lt $MAX_TRIES ]; do
        if docker exec otakushop-db pg_isready -U postgres &> /dev/null; then
            echo "✅ PostgreSQL đã sẵn sàng!"
            echo ""
            echo "📊 Database đã được khởi tạo với:"
            echo "   - Bảng users"
            echo "   - Bảng products"
            echo "   - 8 sản phẩm mẫu"
            break
        fi

        TRIES=$((TRIES+1))
        echo "   Thử lần $TRIES/$MAX_TRIES..."
        sleep 2
    done

    if [ $TRIES -eq $MAX_TRIES ]; then
        echo "❌ PostgreSQL không thể khởi động sau $MAX_TRIES lần thử"
        echo "   Kiểm tra logs: docker logs otakushop-db"
        exit 1
    fi
fi

echo ""
echo "========================================="
echo "   Database đã sẵn sàng sử dụng!         "
echo "========================================="
echo ""
echo "Bước tiếp theo:"
echo "1. Chạy Next.js: npm run dev"
echo "2. Mở trình duyệt: http://localhost:3000"
echo "3. Đăng nhập admin hoặc đăng ký tài khoản mới"
echo ""
echo "Đăng nhập Admin:"
echo "  Email: admin@otakushop.local"
echo "  Password: ChangeMeNow!"
echo ""
echo "Lệnh hữu ích:"
echo "  - Xem logs: docker logs -f otakushop-db"
echo "  - Dừng DB: docker-compose stop postgres"
echo "  - Vào psql: docker exec -it otakushop-db psql -U postgres -d otakushop"
echo ""
