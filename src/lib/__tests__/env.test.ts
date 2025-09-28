import { describe, it, expect } from 'vitest'

describe('Environment Configuration', () => {
  it('should have required environment variables', () => {
    // Test that environment variables are properly loaded
    expect(import.meta.env.VITE_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
    expect(import.meta.env.VITE_APP_ENV).toBeDefined()
    expect(import.meta.env.VITE_ENCRYPTION_KEY).toBeDefined()
  })

  it('should have correct test environment values', () => {
    expect(import.meta.env.VITE_APP_ENV).toBe('test')
    expect(import.meta.env.VITE_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
    expect(import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
  })
})
