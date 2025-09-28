import { useTenantContext } from '../../contexts/TenantContext'

export default function TenantAbout() {
  const { sectorConfig, tenantSlug } = useTenantContext()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hakkımda</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">{sectorConfig?.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {tenantSlug?.charAt(0).toUpperCase()}{tenantSlug?.slice(1)}
            </h2>
            <p className="text-gray-600">{sectorConfig?.displayName} Uzmanı</p>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Merhaba! Ben {tenantSlug}, {sectorConfig?.displayName.toLowerCase()} alanında uzman bir profesyonelim. 
            Yılların verdiği deneyim ve sürekli gelişen teknoloji ile size en iyi hizmeti sunmaya çalışıyorum.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Deneyimim</h3>
          <p className="text-gray-700 mb-4">
            {sectorConfig?.displayName} alanında 10+ yıllık deneyimim bulunmaktadır. 
            Bu süre zarfında binlerce müşteriye hizmet verdim ve onların memnuniyetini kazandım.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Hizmetlerim</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            {sectorConfig?.features.map(feature => (
              <li key={feature} className="mb-1">
                {getFeatureDisplayName(feature)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function getFeatureDisplayName(feature: string): string {
  const featureMap: Record<string, string> = {
    'appointments': 'Randevu Sistemi',
    'patient-records': 'Hasta Kayıtları',
    'treatments': 'Tedavi Planları',
    'billing': 'Faturalama',
    'services': 'Hizmetler',
    'products': 'Ürünler',
    'gallery': 'Galeri',
    'menu': 'Menü',
    'orders': 'Sipariş',
    'reservations': 'Rezervasyon',
    'delivery': 'Teslimat',
    'memberships': 'Üyelikler',
    'classes': 'Dersler',
    'trainers': 'Eğitmenler',
    'equipment': 'Ekipmanlar',
    'inventory': 'Envanter',
    'sales': 'Satış',
    'customers': 'Müşteriler',
    'analytics': 'Analizler'
  }
  return featureMap[feature] || feature
}
