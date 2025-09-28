import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { TenantProvider } from '../contexts/TenantContext'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}))

// Mock environment variables
vi.mock('../lib/env', () => ({
  env: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    APP_ENV: 'test',
    APP_VERSION: '1.0.0-test',
    ENCRYPTION_KEY: 'test-encryption-key-32-characters',
  },
  isDevelopment: () => true,
}))

// Mock crypto-js
vi.mock('crypto-js', () => ({
  default: {
    AES: {
      encrypt: () => ({ toString: () => 'encrypted-data' }),
      decrypt: () => ({ toString: () => 'decrypted-data' }),
    },
    SHA256: () => ({ toString: () => 'hashed-key' }),
    PBKDF2: () => ({ toString: () => 'pbkdf2-hash' }),
    lib: {
      WordArray: {
        random: () => ({ concat: () => ({ toString: () => 'random-iv' }) }),
        create: () => ({ words: [1, 2, 3, 4] }),
      },
    },
    mode: { CBC: {} },
    pad: { Pkcs7: {} },
    enc: {
      Base64: {
        parse: () => ({ words: [1, 2, 3, 4] }),
      },
      Utf8: {},
    },
  },
}))

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

const AllTheProviders: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({ 
  children, 
  initialEntries = ['/'] 
}) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          {children}
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialEntries, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialEntries={initialEntries}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: '2025-01-01T00:00:00.000Z',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  confirmation_sent_at: '2025-01-01T00:00:00.000Z',
}

export const mockProfile = {
  id: 'test-user-id',
  tenant_id: 'test-tenant-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  avatar_url: null,
  role: 'owner' as const,
  permissions: {},
  subscription_plan: 'free' as const,
  subscription_status: 'active',
  subscription_expires_at: null,
  usage_stats: {},
  preferences: {},
  is_active: true,
  email_verified: true,
  last_login_at: '2025-01-01T00:00:00.000Z',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
}

export const mockTenant = {
  id: 'test-tenant-id',
  name: 'Test Tenant',
  slug: 'test-tenant',
  sector: 'dentist',
  domain: 'test-tenant.example.com',
  custom_domain: null,
  owner_id: 'test-user-id',
  settings: {},
  subscription_plan: 'basic' as const,
  subscription_status: 'active',
  subscription_expires_at: '2025-12-31T23:59:59.000Z',
  is_active: true,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
