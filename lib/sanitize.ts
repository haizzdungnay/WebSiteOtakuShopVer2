// XSS Protection - sanitize user inputs
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  // Replace HTML special characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]) as any
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitizeObject(obj[key])
    } else {
      sanitized[key] = obj[key]
    }
  }
  return sanitized
}
