import { createContext, useContext, type ReactNode } from 'react'
import { useTenant, type TenantInfo } from '../hooks/useTenant'

interface TenantContextType extends TenantInfo {
  isValidTenant: boolean
  tenantData: any | null
  loading: boolean
  error: string | null
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenantInfo = useTenant()
  
  const isValidTenant = tenantInfo.isTenant && !!tenantInfo.sectorConfig
  
  const value: TenantContextType = {
    ...tenantInfo,
    isValidTenant,
    tenantData: null,
    loading: false,
    error: null
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider')
  }
  return context
}
