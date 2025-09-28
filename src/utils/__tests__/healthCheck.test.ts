import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runHealthChecks } from '../healthCheck'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
  },
}))

// Mock environment
vi.mock('../../lib/env', () => ({
  env: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    ENCRYPTION_KEY: 'test-encryption-key-32-characters',
  },
}))

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => 100),
    getEntriesByType: vi.fn(() => [
      {
        fetchStart: 0,
        loadEventEnd: 1000,
      },
    ]),
  },
  writable: true,
})

describe('runHealthChecks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return health check results', async () => {
    const results = await runHealthChecks()
    
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  it('should include application status check', async () => {
    const results = await runHealthChecks()
    
    const appCheck = results.find(result => result.service === 'application')
    expect(appCheck).toBeDefined()
    expect(appCheck?.status).toBe('pass')
    expect(appCheck?.message).toBe('Application is running')
  })

  it('should include database connection check', async () => {
    const results = await runHealthChecks()
    
    const dbCheck = results.find(result => result.service === 'database')
    expect(dbCheck).toBeDefined()
    expect(dbCheck?.status).toBe('pass')
  })

  it('should include environment variables check', async () => {
    const results = await runHealthChecks()
    
    const envCheck = results.find(result => result.service === 'environment')
    expect(envCheck).toBeDefined()
    expect(envCheck?.status).toBe('pass')
  })

  it('should include performance check', async () => {
    const results = await runHealthChecks()
    
    const perfCheck = results.find(result => result.service === 'performance')
    expect(perfCheck).toBeDefined()
    expect(['pass', 'warn', 'fail']).toContain(perfCheck?.status)
  })

  it('should include auth API check', async () => {
    const results = await runHealthChecks()
    
    const authCheck = results.find(result => result.service === 'auth_api')
    expect(authCheck).toBeDefined()
    expect(authCheck?.status).toBe('pass')
  })

  it('should handle database connection failure', async () => {
    const { supabase } = await import('../../lib/supabase')
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn(() => Promise.resolve({ data: null, error: new Error('Connection failed') })),
    } as any)

    const results = await runHealthChecks()
    const dbCheck = results.find(result => result.service === 'database')
    
    expect(dbCheck?.status).toBe('fail')
    expect(dbCheck?.message).toContain('Connection failed')
  })
})
