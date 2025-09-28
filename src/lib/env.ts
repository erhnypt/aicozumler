/**
 * Environment variables validation and configuration
 */

// Environment variables interface
interface EnvVars {
  // Supabase
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  
  // App configuration
  APP_ENV: 'development' | 'production' | 'staging'
  APP_VERSION: string
  
  // Security
  ENCRYPTION_KEY: string
  
  // Multi-tenant
  MAIN_DOMAIN: string
  ENABLE_SUBDOMAINS: boolean
  TENANT_MODE: string
  DEFAULT_SECTOR: string
  
  // API
  API_BASE_URL: string
  
  // Tables
  TENANT_TABLE: string
  TENANT_SETTINGS_TABLE: string
}

// Load and validate environment variables
const loadEnvVars = (): EnvVars => {
  const env = {
    SUPABASE_URL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
    APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
    MAIN_DOMAIN: import.meta.env.VITE_MAIN_DOMAIN || 'sitem.com',
    ENABLE_SUBDOMAINS: import.meta.env.VITE_ENABLE_SUBDOMAINS === 'true',
    TENANT_MODE: import.meta.env.VITE_TENANT_MODE || 'subdomain-path',
    DEFAULT_SECTOR: import.meta.env.VITE_DEFAULT_SECTOR || 'dentist',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    TENANT_TABLE: import.meta.env.VITE_TENANT_TABLE || 'tenants',
    TENANT_SETTINGS_TABLE: import.meta.env.VITE_TENANT_SETTINGS_TABLE || 'tenant_settings',
  }

  // Validate required environment variables
  const requiredVars: (keyof EnvVars)[] = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'ENCRYPTION_KEY'
  ]

  const missingVars = requiredVars.filter(key => !env[key])
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    )
  }

  // Validate Supabase URL format
  if (!env.SUPABASE_URL.startsWith('https://') || !env.SUPABASE_URL.includes('.supabase.co')) {
    throw new Error('Invalid SUPABASE_URL format. Should be: https://your-project.supabase.co')
  }

  // Validate encryption key length (should be at least 32 characters for security)
  if (env.ENCRYPTION_KEY.length < 32) {
    console.warn('⚠️  Encryption key is too short. Consider using a longer key for better security.')
  }

  // Production environment checks
  if (env.APP_ENV === 'production') {
    if (env.ENCRYPTION_KEY === 'ai-cozumler-2024-secure-key-change-in-production') {
      throw new Error('⚠️  CRITICAL: You must change the default encryption key in production!')
    }
  }

  return env as EnvVars
}

// Export validated environment variables
export const env = loadEnvVars()

// Helper functions
export const isDevelopment = () => env.APP_ENV === 'development'
export const isProduction = () => env.APP_ENV === 'production'
export const isStaging = () => env.APP_ENV === 'staging'

// Log environment info (only in development)
if (isDevelopment()) {
  console.log('🔧 Environment Configuration:')
  console.log('  - App Environment:', env.APP_ENV)
  console.log('  - App Version:', env.APP_VERSION)
  console.log('  - Supabase URL:', env.SUPABASE_URL)
  console.log('  - Multi-tenant enabled:', env.ENABLE_SUBDOMAINS)
  console.log('  - Main domain:', env.MAIN_DOMAIN)
  console.log('  - Default sector:', env.DEFAULT_SECTOR)
}
