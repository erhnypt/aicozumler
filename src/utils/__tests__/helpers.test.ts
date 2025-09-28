import { describe, it, expect } from 'vitest'

// Simple utility functions to test
export const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format Turkish Lira correctly', () => {
      expect(formatCurrency(1000)).toBe('₺1.000,00')
      expect(formatCurrency(1234.56)).toBe('₺1.234,56')
    })

    it('should handle zero values', () => {
      expect(formatCurrency(0)).toBe('₺0,00')
    })

    it('should format USD when specified', () => {
      expect(formatCurrency(100, 'USD')).toContain('100')
    })
  })

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test Clinic Name')).toBe('test-clinic-name')
    })

    it('should remove special characters', () => {
      expect(slugify('Test@Clinic#123')).toBe('testclinic123')
    })

    it('should handle Turkish characters', () => {
      expect(slugify('Güzellik Salonu')).toBe('gzellik-salonu')
    })

    it('should handle empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe('Exactly twenty chars')
    })
  })
})
