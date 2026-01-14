import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeString,
  validateAndSanitizeEmail,
  validatePasswordWithFeedback,
} from '@/lib/validators'

describe('Validators Module', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@gmail.com')).toBe(true)
      expect(validateEmail('a@b.co')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user@domain')).toBe(false)
      expect(validateEmail('user @domain.com')).toBe(false)
    })

    it('should return false for non-string inputs', () => {
      expect(validateEmail(null as unknown as string)).toBe(false)
      expect(validateEmail(undefined as unknown as string)).toBe(false)
      expect(validateEmail(123 as unknown as string)).toBe(false)
    })

    it('should handle whitespace correctly', () => {
      expect(validateEmail('  test@example.com  ')).toBe(true)
      expect(validateEmail('test @example.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('Password1')).toBe(true)
      expect(validatePassword('MyP@ssw0rd')).toBe(true)
      expect(validatePassword('Abcdefg1')).toBe(true)
      expect(validatePassword('VeryLongPassword123')).toBe(true)
    })

    it('should return false for passwords without uppercase', () => {
      expect(validatePassword('password1')).toBe(false)
      expect(validatePassword('abcdefg1')).toBe(false)
    })

    it('should return false for passwords without lowercase', () => {
      expect(validatePassword('PASSWORD1')).toBe(false)
      expect(validatePassword('ABCDEFG1')).toBe(false)
    })

    it('should return false for passwords without numbers', () => {
      expect(validatePassword('Passwordd')).toBe(false)
      expect(validatePassword('ABCdefgh')).toBe(false)
    })

    it('should return false for passwords shorter than 8 characters', () => {
      expect(validatePassword('Pass1')).toBe(false)
      expect(validatePassword('Ab1')).toBe(false)
      expect(validatePassword('Abcdef1')).toBe(false)
    })

    it('should return false for non-string inputs', () => {
      expect(validatePassword(null as unknown as string)).toBe(false)
      expect(validatePassword(undefined as unknown as string)).toBe(false)
      expect(validatePassword(123 as unknown as string)).toBe(false)
    })
  })

  describe('validateUsername', () => {
    it('should return true for valid usernames', () => {
      expect(validateUsername('john')).toBe(true)
      expect(validateUsername('john_doe')).toBe(true)
      expect(validateUsername('john-doe')).toBe(true)
      expect(validateUsername('JohnDoe123')).toBe(true)
      expect(validateUsername('abc')).toBe(true) // minimum 3 chars
      expect(validateUsername('12345678901234567890')).toBe(true) // max 20 chars
    })

    it('should return false for usernames with invalid characters', () => {
      expect(validateUsername('john doe')).toBe(false) // space
      expect(validateUsername('john@doe')).toBe(false) // @
      expect(validateUsername('john.doe')).toBe(false) // .
      expect(validateUsername('john!doe')).toBe(false) // !
    })

    it('should return false for usernames that are too short', () => {
      expect(validateUsername('')).toBe(false)
      expect(validateUsername('ab')).toBe(false)
      expect(validateUsername('a')).toBe(false)
    })

    it('should return false for usernames that are too long', () => {
      expect(validateUsername('abcdefghijklmnopqrstuvwxyz')).toBe(false) // > 20 chars
    })

    it('should return false for non-string inputs', () => {
      expect(validateUsername(null as unknown as string)).toBe(false)
      expect(validateUsername(undefined as unknown as string)).toBe(false)
    })
  })

  describe('sanitizeString', () => {
    it('should remove potentially dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script')
      expect(sanitizeString('normal text')).toBe('normal text')
      expect(sanitizeString('text with "quotes"')).toBe('text with quotes')
      expect(sanitizeString("text with 'single' quotes")).toBe('text with single quotes')
    })

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world')
    })

    it('should limit length to 1000 characters', () => {
      const longString = 'a'.repeat(2000)
      expect(sanitizeString(longString).length).toBe(1000)
    })

    it('should return empty string for non-string inputs', () => {
      expect(sanitizeString(null as unknown as string)).toBe('')
      expect(sanitizeString(undefined as unknown as string)).toBe('')
      expect(sanitizeString(123 as unknown as string)).toBe('')
    })
  })

  describe('validateAndSanitizeEmail', () => {
    it('should return valid result for valid email', () => {
      const result = validateAndSanitizeEmail('Test@Example.COM')
      expect(result.valid).toBe(true)
      expect(result.email).toBe('test@example.com') // lowercase
      expect(result.error).toBeUndefined()
    })

    it('should return invalid result for invalid email', () => {
      const result = validateAndSanitizeEmail('invalid-email')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid email format')
    })

    it('should sanitize email and convert to lowercase', () => {
      const result = validateAndSanitizeEmail('  USER@DOMAIN.COM  ')
      expect(result.email).toBe('user@domain.com')
    })
  })

  describe('validatePasswordWithFeedback', () => {
    it('should return valid for strong passwords', () => {
      const result = validatePasswordWithFeedback('Password123')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error for empty password', () => {
      const result = validatePasswordWithFeedback('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password is required')
    })

    it('should return error for short password', () => {
      const result = validatePasswordWithFeedback('Pass1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters')
    })

    it('should return error for password without lowercase', () => {
      const result = validatePasswordWithFeedback('PASSWORD123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one lowercase letter')
    })

    it('should return error for password without uppercase', () => {
      const result = validatePasswordWithFeedback('password123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one uppercase letter')
    })

    it('should return error for password without number', () => {
      const result = validatePasswordWithFeedback('Passworddd')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one number')
    })
  })
})
