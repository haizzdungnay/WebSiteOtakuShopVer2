/**
 * Input validation utilities
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate password strength
 * Requires: minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number
 */
export function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false

  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * Validate username
 * Alphanumeric, underscores, hyphens only, 3-20 characters
 */
export function validateUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false

  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username.trim())
}

/**
 * Sanitize string input (basic XSS prevention)
 * Note: This is a basic implementation. For production, use a library like DOMPurify
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 1000) // Limit length
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email: string): { valid: boolean; email: string; error?: string } {
  const sanitized = sanitizeString(email).toLowerCase()

  if (!validateEmail(sanitized)) {
    return {
      valid: false,
      email: sanitized,
      error: 'Invalid email format'
    }
  }

  return {
    valid: true,
    email: sanitized
  }
}

/**
 * Validate password and provide feedback
 */
export function validatePasswordWithFeedback(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }

  return { valid: true }
}
