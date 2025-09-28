import { createClient } from '@supabase/supabase-js'
import { env } from './env'

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export type Profile = {
  id: string
  tenant_id: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  avatar_url: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: Record<string, any>
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise'
  subscription_status: string | null
  subscription_expires_at: string | null
  usage_stats: Record<string, any>
  preferences: Record<string, any>
  is_active: boolean
  email_verified: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export type Tenant = {
  id: string
  name: string
  slug: string
  sector: string
  domain: string | null
  subdomain: string | null
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise'
  subscription_status: string
  subscription_expires_at: string | null
  max_users: number
  max_encrypted_items: number
  max_storage_mb: number
  current_users: number
  current_encrypted_items: number
  current_storage_mb: number
  settings: Record<string, any>
  branding: Record<string, any>
  status: 'active' | 'suspended' | 'inactive'
  created_at: string
  updated_at: string
}

export type EncryptedData = {
  id: string
  user_id: string
  tenant_id: string | null
  data_type: string
  title: string | null
  description: string | null
  encrypted_content: string
  tags: string[] | null
  category: string | null
  is_favorite: boolean
  is_shared: boolean
  shared_with: string[] | null
  access_level: 'private' | 'shared' | 'team'
  file_name: string | null
  file_size: number | null
  file_type: string | null
  created_at: string
  updated_at: string
  last_accessed_at: string
}

// Auth helper types
export type AuthUser = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export type AuthSession = {
  access_token: string
  refresh_token: string
  expires_at: number
  user: AuthUser
}

// Database helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const createProfile = async (profile: Omit<Profile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single()
  
  return { data, error }
}