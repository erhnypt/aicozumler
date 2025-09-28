import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signUp: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.session).toBe(null)
  })

  it('should provide auth functions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(typeof result.current.signIn).toBe('function')
    expect(typeof result.current.signUp).toBe('function')
    expect(typeof result.current.signOut).toBe('function')
    expect(typeof result.current.updateProfile).toBe('function')
  })

  it('should handle sign in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'password')
      expect(response).toHaveProperty('error')
    })
  })

  it('should handle sign up', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      const response = await result.current.signUp('test@example.com', 'password', {
        firstName: 'Test',
        lastName: 'User'
      })
      expect(response).toHaveProperty('error')
    })
  })
})
