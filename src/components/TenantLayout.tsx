import { type ReactNode } from 'react'
import { useTenantContext } from '../contexts/TenantContext'
import { Navigate, Outlet } from 'react-router-dom'

interface TenantLayoutProps {
  children?: ReactNode
}

export function TenantLayout({ children }: TenantLayoutProps) {
  const { isTenant, isValidTenant, sectorConfig, tenantSlug, sector } = useTenantContext()

  if (!isTenant) {
    return <Navigate to="/" replace />
  }

  if (!isValidTenant) {
    return <TenantNotFound sector={sector} tenantSlug={tenantSlug} />
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        '--primary-color': sectorConfig?.primaryColor,
        '--secondary-color': sectorConfig?.secondaryColor
      } as React.CSSProperties}
    >
      <TenantHeader />
      <main className="tenant-main">
        {children || <Outlet />}
      </main>
      <TenantFooter />
    </div>
  )
}

function TenantHeader() {
  const { sectorConfig, tenantSlug } = useTenantContext()
  
  return (
    <header 
      className="bg-white shadow-sm border-b"
      style={{ borderBottomColor: sectorConfig?.primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{sectorConfig?.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {tenantSlug?.charAt(0).toUpperCase()}{tenantSlug?.slice(1)}
              </h1>
              <p className="text-sm text-gray-600">{sectorConfig?.displayName}</p>
            </div>
          </div>
          
          <nav className="flex space-x-6">
            <TenantNavigation />
          </nav>
        </div>
      </div>
    </header>
  )
}

function TenantNavigation() {
  const { sectorConfig } = useTenantContext()
  
  const getNavigationItems = () => {
    if (!sectorConfig) return []
    
    const baseItems = [
      { href: '', label: 'Ana Sayfa' },
      { href: 'hakkimda', label: 'Hakkımda' },
      { href: 'iletisim', label: 'İletişim' }
    ]
    
    switch (sectorConfig.id) {
      case 'dentist':
        return [
          ...baseItems,
          { href: 'randevu', label: 'Randevu Al' },
          { href: 'tedaviler', label: 'Tedaviler' },
          { href: 'galeri', label: 'Galeri' }
        ]
      case 'beauty':
        return [
          ...baseItems,
          { href: 'hizmetler', label: 'Hizmetler' },
          { href: 'randevu', label: 'Randevu Al' },
          { href: 'galeri', label: 'Galeri' },
          { href: 'fiyatlar', label: 'Fiyatlar' }
        ]
      case 'restaurant':
        return [
          ...baseItems,
          { href: 'menu', label: 'Menü' },
          { href: 'rezervasyon', label: 'Rezervasyon' },
          { href: 'galeri', label: 'Galeri' }
        ]
      default:
        return baseItems
    }
  }
  
  return (
    <>
      {getNavigationItems().map(item => (
        <a
          key={item.href}
          href={item.href}
          className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
        >
          {item.label}
        </a>
      ))}
    </>
  )
}

function TenantFooter() {
  const { sectorConfig, tenantSlug } = useTenantContext()
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">
            © 2024 {tenantSlug?.charAt(0).toUpperCase()}{tenantSlug?.slice(1)} - {sectorConfig?.displayName}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by AI Çözümler
          </p>
        </div>
      </div>
    </footer>
  )
}

function TenantNotFound({ sector, tenantSlug }: { sector: string | null, tenantSlug: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Tenant bulunamadı</p>
        <p className="text-gray-500">
          {sector && tenantSlug ? `${sector}.sitem.com/${tenantSlug}` : 'Geçersiz tenant'}
        </p>
        <a 
          href="/" 
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  )
}
