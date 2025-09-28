import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, type Tenant } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface SectorConfig {
  id: string
  name: string
  displayName: string
  primaryColor: string
  secondaryColor: string
  icon: string
  features: string[]
  defaultLayout: 'clinic' | 'salon' | 'restaurant' | 'retail' | 'service'
  subscriptionPlans: {
    free: { maxUsers: number; maxItems: number; maxStorage: number }
    basic: { maxUsers: number; maxItems: number; maxStorage: number }
    premium: { maxUsers: number; maxItems: number; maxStorage: number }
    enterprise: { maxUsers: number; maxItems: number; maxStorage: number }
  }
}

export interface TenantInfo {
  sector: string | null
  tenantSlug: string | null
  fullDomain: string
  isTenant: boolean
  sectorConfig: SectorConfig | null
  tenant: Tenant | null
  loading: boolean
  error: string | null
}

const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  dentist: {
    id: 'dentist',
    name: 'dentist',
    displayName: 'Diş Hekimliği',
    primaryColor: '#0ea5e9',
    secondaryColor: '#e0f2fe',
    icon: '🦷',
    features: ['appointments', 'patient-records', 'treatments', 'billing'],
    defaultLayout: 'clinic',
    subscriptionPlans: {
      free: { maxUsers: 1, maxItems: 10, maxStorage: 100 },
      basic: { maxUsers: 3, maxItems: 100, maxStorage: 1000 },
      premium: { maxUsers: 10, maxItems: 500, maxStorage: 5000 },
      enterprise: { maxUsers: 50, maxItems: 2000, maxStorage: 20000 }
    }
  },
  beauty: {
    id: 'beauty',
    name: 'beauty',
    displayName: 'Güzellik & Estetik',
    primaryColor: '#ec4899',
    secondaryColor: '#fdf2f8',
    icon: '💄',
    features: ['appointments', 'services', 'products', 'gallery'],
    defaultLayout: 'salon',
    subscriptionPlans: {
      free: { maxUsers: 1, maxItems: 10, maxStorage: 100 },
      basic: { maxUsers: 5, maxItems: 150, maxStorage: 1500 },
      premium: { maxUsers: 15, maxItems: 750, maxStorage: 7500 },
      enterprise: { maxUsers: 75, maxItems: 3000, maxStorage: 30000 }
    }
  },
  restaurant: {
    id: 'restaurant',
    name: 'restaurant',
    displayName: 'Restoran & Cafe',
    primaryColor: '#f59e0b',
    secondaryColor: '#fffbeb',
    icon: '🍽️',
    features: ['menu', 'orders', 'reservations', 'delivery'],
    defaultLayout: 'restaurant',
    subscriptionPlans: {
      free: { maxUsers: 1, maxItems: 10, maxStorage: 100 },
      basic: { maxUsers: 5, maxItems: 200, maxStorage: 2000 },
      premium: { maxUsers: 20, maxItems: 1000, maxStorage: 10000 },
      enterprise: { maxUsers: 100, maxItems: 5000, maxStorage: 50000 }
    }
  },
  fitness: {
    id: 'fitness',
    name: 'fitness',
    displayName: 'Fitness & Spor',
    primaryColor: '#10b981',
    secondaryColor: '#ecfdf5',
    icon: '💪',
    features: ['memberships', 'classes', 'trainers', 'equipment'],
    defaultLayout: 'service',
    subscriptionPlans: {
      free: { maxUsers: 1, maxItems: 10, maxStorage: 100 },
      basic: { maxUsers: 5, maxItems: 100, maxStorage: 1000 },
      premium: { maxUsers: 15, maxItems: 500, maxStorage: 5000 },
      enterprise: { maxUsers: 50, maxItems: 2000, maxStorage: 20000 }
    }
  },
  retail: {
    id: 'retail',
    name: 'retail',
    displayName: 'Perakende & Mağaza',
    primaryColor: '#8b5cf6',
    secondaryColor: '#f5f3ff',
    icon: '🛍️',
    features: ['inventory', 'sales', 'customers', 'analytics'],
    defaultLayout: 'retail',
    subscriptionPlans: {
      free: { maxUsers: 1, maxItems: 10, maxStorage: 100 },
      basic: { maxUsers: 3, maxItems: 100, maxStorage: 1000 },
      premium: { maxUsers: 10, maxItems: 500, maxStorage: 5000 },
      enterprise: { maxUsers: 30, maxItems: 2000, maxStorage: 20000 }
    }
  }
}

export function useTenant(): TenantInfo {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({
    sector: null,
    tenantSlug: null,
    fullDomain: '',
    isTenant: false,
    sectorConfig: null,
    tenant: null,
    loading: true,
    error: null
  })
  
  const location = useLocation()

  // Load tenant data from database
  const loadTenantData = async (sector: string, slug: string) => {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('sector', sector)
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Tenant not found:', error)
        return null
      }

      return tenant as Tenant
    } catch (error) {
      console.error('Error loading tenant:', error)
      return null
    }
  }

  useEffect(() => {
    const detectTenant = async () => {
      setTenantInfo(prev => ({ ...prev, loading: true, error: null }))
      
      const hostname = window.location.hostname
      const pathname = window.location.pathname
      
      let sector: string | null = null
      let tenantSlug: string | null = null
      let tenant: Tenant | null = null

      // Development mode - URL parameters or path-based routing
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const urlParams = new URLSearchParams(window.location.search)
        const sectorParam = urlParams.get('sector')
        const tenantParam = urlParams.get('tenant')
        
        if (sectorParam && tenantParam) {
          sector = sectorParam
          tenantSlug = tenantParam
        } else {
          // Path-based routing: /sector/tenant-slug
          const pathParts = pathname.split('/').filter(Boolean)
          if (pathParts.length >= 2 && SECTOR_CONFIGS[pathParts[0]]) {
            sector = pathParts[0]
            tenantSlug = pathParts[1]
          }
        }
      } else {
        // Production mode - subdomain routing
        const parts = hostname.split('.')
        if (parts.length > 2) {
          const subdomain = parts[0]
          const sectorConfig = SECTOR_CONFIGS[subdomain]
          
          if (sectorConfig) {
            sector = subdomain
            const pathParts = pathname.split('/').filter(Boolean)
            tenantSlug = pathParts[0] || null
          }
        }
      }

      // Load tenant data if we have both sector and slug
      if (sector && tenantSlug && SECTOR_CONFIGS[sector]) {
        tenant = await loadTenantData(sector, tenantSlug)
        
        if (!tenant) {
          setTenantInfo(prev => ({
            ...prev,
            loading: false,
            error: `Tenant '${tenantSlug}' not found in sector '${sector}'`
          }))
          return
        }
      }

      setTenantInfo({
        sector,
        tenantSlug,
        fullDomain: hostname,
        isTenant: !!(sector && tenantSlug),
        sectorConfig: sector ? SECTOR_CONFIGS[sector] || null : null,
        tenant,
        loading: false,
        error: null
      })
    }

    detectTenant()
  }, [location.pathname, location.search])

  return tenantInfo
}

// Tenant management functions
export function useTenantManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create new tenant
  const createTenant = async (tenantData: {
    name: string
    slug: string
    sector: string
    domain?: string
    subdomain?: string
  }): Promise<{ success: boolean; tenant?: Tenant; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    setLoading(true)
    setError(null)

    try {
      // Check if slug is available
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', tenantData.slug)
        .single()

      if (existingTenant) {
        return { success: false, error: 'Bu slug zaten kullanımda' }
      }

      // Create tenant
      const { data: tenant, error: createError } = await supabase
        .from('tenants')
        .insert([{
          name: tenantData.name,
          slug: tenantData.slug,
          sector: tenantData.sector,
          domain: tenantData.domain || null,
          subdomain: tenantData.subdomain || null,
          subscription_plan: 'free',
          max_users: SECTOR_CONFIGS[tenantData.sector]?.subscriptionPlans.free.maxUsers || 1,
          max_encrypted_items: SECTOR_CONFIGS[tenantData.sector]?.subscriptionPlans.free.maxItems || 10,
          max_storage_mb: SECTOR_CONFIGS[tenantData.sector]?.subscriptionPlans.free.maxStorage || 100
        }])
        .select()
        .single()

      if (createError) {
        return { success: false, error: createError.message }
      }

      // Update user profile with tenant_id
      await supabase
        .from('profiles')
        .update({ tenant_id: tenant.id, role: 'owner' })
        .eq('id', user.id)

      return { success: true, tenant: tenant as Tenant }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Get user's tenants
  const getUserTenants = async (): Promise<{ tenants: Tenant[]; error?: string }> => {
    if (!user) {
      return { tenants: [], error: 'User not authenticated' }
    }

    try {
      // Get tenants where user is owner or member
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select(`
          *,
          tenant_members!inner(user_id, role)
        `)
        .or(`tenant_members.user_id.eq.${user.id},profiles.id.eq.${user.id}`)
        .eq('status', 'active')

      if (error) {
        return { tenants: [], error: error.message }
      }

      return { tenants: tenants as Tenant[] }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { tenants: [], error: errorMessage }
    }
  }

  // Update tenant
  const updateTenant = async (
    tenantId: string,
    updates: Partial<Tenant>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', tenantId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createTenant,
    getUserTenants,
    updateTenant
  }
}

// Utility functions
export function generateTenantUrl(sector: string, tenantSlug: string, path: string = '/') {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}/${sector}/${tenantSlug}${path}`
  } else {
    const baseDomain = hostname.split('.').slice(1).join('.')
    return `${protocol}//${sector}.${baseDomain}/${tenantSlug}${path}`
  }
}

export function redirectToTenant(sector: string, tenantSlug: string, path: string = '/') {
  const url = generateTenantUrl(sector, tenantSlug, path)
  window.location.href = url
}

export function getSectorList() {
  return Object.values(SECTOR_CONFIGS)
}

export function getSectorConfig(sectorId: string): SectorConfig | null {
  return SECTOR_CONFIGS[sectorId] || null
}