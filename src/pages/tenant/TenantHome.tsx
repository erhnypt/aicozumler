import { useTenantContext } from '../../contexts/TenantContext'
import { useSEO } from '../../hooks/useSEO'

export default function TenantHome() {
  const { sectorConfig, tenantSlug } = useTenantContext()
  
  // SEO optimization for tenant pages
  useSEO()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{sectorConfig?.icon}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {tenantSlug?.charAt(0).toUpperCase()}{tenantSlug?.slice(1)}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Hoş geldiniz! {sectorConfig?.displayName} hizmetlerimizi keşfedin.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Kaliteli Hizmet</h3>
            <p className="text-gray-600">Uzman kadromuzla size en iyi hizmeti sunuyoruz.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Modern Teknoloji</h3>
            <p className="text-gray-600">En son teknoloji ile donatılmış ekipmanlarımız.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Müşteri Memnuniyeti</h3>
            <p className="text-gray-600">Müşteri memnuniyeti bizim için öncelik.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
