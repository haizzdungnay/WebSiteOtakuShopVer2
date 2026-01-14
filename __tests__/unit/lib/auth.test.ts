import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { verifyToken, getTokenFromRequest, getUserFromRequest, JWTPayLoad } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Test secret - same as in setup.ts
const TEST_SECRET = 'test-jwt-secret-key-for-testing-only'

describe('Auth Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('verifyToken', () => {
    it('should return payload for valid token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      }

      const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' })
      const result = verifyToken(token)

      expect(result).not.toBeNull()
      expect(result?.userId).toBe('user-123')
      expect(result?.email).toBe('test@example.com')
      expect(result?.role).toBe('CUSTOMER')
    })

    it('should return null for expired token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      }

      // Create an already expired token
      const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '-1s' })
      const result = verifyToken(token)

      expect(result).toBeNull()
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid.token.here')
      expect(result).toBeNull()
    })

    it('should return null for token signed with wrong secret', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      }

      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' })
      const result = verifyToken(token)

      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = verifyToken('')
      expect(result).toBeNull()
    })
  })

  describe('getTokenFromRequest', () => {
    it('should extract token from Authorization header with Bearer prefix', () => {
      const token = 'test-token-123'
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = getTokenFromRequest(request)
      expect(result).toBe(token)
    })

    it('should extract token from cookies if no Authorization header', () => {
      const token = 'cookie-token-456'
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Cookie': `token=${token}`,
        },
      })

      const result = getTokenFromRequest(request)
      expect(result).toBe(token)
    })

    it('should return null if no token in header or cookies', () => {
      const request = new NextRequest('http://localhost:3000/api/test')

      const result = getTokenFromRequest(request)
      expect(result).toBeNull()
    })

    it('should prefer Authorization header over cookies', () => {
      const headerToken = 'header-token'
      const cookieToken = 'cookie-token'

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': `Bearer ${headerToken}`,
          'Cookie': `token=${cookieToken}`,
        },
      })

      const result = getTokenFromRequest(request)
      expect(result).toBe(headerToken)
    })

    it('should return null for Authorization header without Bearer prefix', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': 'Basic some-basic-auth',
        },
      })

      const result = getTokenFromRequest(request)
      expect(result).toBeNull()
    })
  })

  describe('getUserFromRequest', () => {
    it('should return user payload for valid token in header', () => {
      const payload = {
        userId: 'user-789',
        email: 'user@test.com',
        role: 'ADMIN',
      }

      const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' })
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = getUserFromRequest(request)

      expect(result).not.toBeNull()
      expect(result?.userId).toBe('user-789')
      expect(result?.email).toBe('user@test.com')
      expect(result?.role).toBe('ADMIN')
    })

    it('should return user payload for valid token in cookie', () => {
      const payload = {
        userId: 'user-cookie',
        email: 'cookie@test.com',
        role: 'CUSTOMER',
      }

      const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' })
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Cookie': `token=${token}`,
        },
      })

      const result = getUserFromRequest(request)

      expect(result).not.toBeNull()
      expect(result?.userId).toBe('user-cookie')
    })

    it('should return null for request without token', () => {
      const request = new NextRequest('http://localhost:3000/api/test')

      const result = getUserFromRequest(request)
      expect(result).toBeNull()
    })

    it('should return null for request with invalid token', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      })

      const result = getUserFromRequest(request)
      expect(result).toBeNull()
    })

    it('should return null for request with expired token', () => {
      const payload = {
        userId: 'user-expired',
        email: 'expired@test.com',
        role: 'CUSTOMER',
      }

      const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '-1h' })
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = getUserFromRequest(request)
      expect(result).toBeNull()
    })
  })
})
