import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Validation schema

const createReviewSchema = z.object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
    rating: z.number()
        .min(1, 'Đánh giá thấp nhất là 1 sao')
        .max(5, 'Đánh giá cao nhất là 5 sao'),
    title: z.string()
        .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
        .max(100, 'Tiêu đề quá dài (tối đa 100 ký tự)'),
    comment: z.string()
        .min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự')
        .max(1000, 'Nội dung quá dài (tối đa 1000 ký tự)'),
    images: z.array(z.string().url('Link ảnh không hợp lệ')).max(5, 'Tối đa 5 ảnh').optional()
})