import { PrismaClient } from '@/app/generated/prisma'
import { Prisma } from '@prisma/client'

// Extend global type để lưu prisma instance
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Nếu chưa có instance thì tạo mới
// Nếu đã có rồi thì tái sử dụng instance cũ
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query','error','warn'], // log query trong development
})

//Lưu instance và global (chỉ dành cho development)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}