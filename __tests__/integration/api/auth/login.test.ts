import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { mockUsers } from '@/__tests__/fixtures'

// Mock modules BEFORE any imports that use them
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ success: true, remaining: 5, resetTime: Date.now() + 900000 })),
  getClientIP: vi.fn(() => '127.0.0.1'),
  RATE_LIMITS: {
    AUTH: { maxRequests: 5, windowMs: 900000 },
  },
  getRateLimitHeaders: vi.fn(() => ({})),
}))

// Import AFTER mocks are defined
import { POST } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

// Type the mocked prisma
const mockPrismaUser = prisma.user as {
  findUnique: ReturnType<typeof vi.fn>
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper to create request
  function createLoginRequest(body: object): NextRequest {
    return new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  describe('Validation', () => {
    it('should return 400 for invalid email format', async () => {
      const request = createLoginRequest({
        email: 'invalid-email',
        password: 'Password123',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Email')
    })

    it('should return 400 for short password', async () => {
      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'short',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('8')
    })

    it('should return 400 for missing email', async () => {
      const request = createLoginRequest({
        password: 'Password123',
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 400 for missing password', async () => {
      const request = createLoginRequest({
        email: 'test@example.com',
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('Authentication', () => {
    it('should return 401 for non-existent user', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null)

      const request = createLoginRequest({
        email: 'nonexistent@example.com',
        password: 'Password123',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Email hoặc mật khẩu không đúng')
    })

    it('should return 401 for wrong password', async () => {
      // Create a user with known password hash
      const hashedPassword = await bcrypt.hash('CorrectPassword123', 10)
      mockPrismaUser.findUnique.mockResolvedValue({
        ...mockUsers.customer,
        passwordHash: hashedPassword,
      })

      const request = createLoginRequest({
        email: mockUsers.customer.email,
        password: 'WrongPassword123',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return 200 and set cookies for valid credentials', async () => {
      const correctPassword = 'Password123'
      const hashedPassword = await bcrypt.hash(correctPassword, 10)

      mockPrismaUser.findUnique.mockResolvedValue({
        ...mockUsers.customer,
        passwordHash: hashedPassword,
      })

      const request = createLoginRequest({
        email: mockUsers.customer.email,
        password: correctPassword,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('thành công')
      expect(data.data.user).toBeDefined()
      expect(data.data.user.email).toBe(mockUsers.customer.email)
      expect(data.data.user.fullName).toBe(mockUsers.customer.fullName)

      // Check that password hash is NOT included in response
      expect(data.data.user.passwordHash).toBeUndefined()
    })

    it('should return user data without sensitive fields', async () => {
      const correctPassword = 'Password123'
      const hashedPassword = await bcrypt.hash(correctPassword, 10)

      mockPrismaUser.findUnique.mockResolvedValue({
        ...mockUsers.customer,
        passwordHash: hashedPassword,
        verificationToken: 'secret-token',
        resetPasswordToken: 'reset-token',
      })

      const request = createLoginRequest({
        email: mockUsers.customer.email,
        password: correctPassword,
      })

      const response = await POST(request)
      const data = await response.json()

      // Verify no sensitive fields are exposed
      expect(data.data.user.passwordHash).toBeUndefined()
      expect(data.data.user.verificationToken).toBeUndefined()
      expect(data.data.user.resetPasswordToken).toBeUndefined()
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit exceeded', async () => {
      // Override rate limit mock for this test
      vi.mocked(checkRateLimit).mockReturnValueOnce({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 900000,
        retryAfter: 900,
      })

      const request = createLoginRequest({
        email: 'test@example.com',
        password: 'Password123',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Quá nhiều lần thử')
    })
  })

  describe('Email normalization', () => {
    it('should normalize email to lowercase', async () => {
      const correctPassword = 'Password123'
      const hashedPassword = await bcrypt.hash(correctPassword, 10)

      mockPrismaUser.findUnique.mockResolvedValue({
        ...mockUsers.customer,
        passwordHash: hashedPassword,
      })

      const request = createLoginRequest({
        email: 'TEST@EXAMPLE.COM',
        password: correctPassword,
      })

      await POST(request)

      // Check that prisma was called with lowercase email
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })
  })

  describe('Admin login', () => {
    it('should work for admin users', async () => {
      const correctPassword = 'AdminPassword123'
      const hashedPassword = await bcrypt.hash(correctPassword, 10)

      mockPrismaUser.findUnique.mockResolvedValue({
        ...mockUsers.admin,
        passwordHash: hashedPassword,
      })

      const request = createLoginRequest({
        email: mockUsers.admin.email,
        password: correctPassword,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.user.role).toBe('ADMIN')
    })
  })
})
