import { useState, useEffect } from 'react'
import { useTenantManagement, getSectorList } from '../../hooks/useTenant'
import { type Tenant } from '../../lib/supabase'

export function TenantManager() {
  const { createTenant, getUserTenants, loading, error } = useTenantManagement()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    sector: 'dentist',
    domain: '',
    subdomain: ''
  })

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    const result = await getUserTenants()
    if (result.tenants) {
      setTenants(result.tenants)
    }
  }

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!createForm.name || !createForm.slug) {
      alert('İsim ve slug gerekli')
      return
    }

    const result = await createTenant({
      name: createForm.name,
      slug: createForm.slug,
      sector: createForm.sector,
      domain: createForm.domain || undefined,
      subdomain: createForm.subdomain || undefined
    })

    if (result.success) {
      setShowCreateForm(false)
      setCreateForm({
        name: '',
        slug: '',
        sector: 'dentist',
        domain: '',
        subdomain: ''
      })
      await loadTenants()
      alert('Tenant başarıyla oluşturuldu!')
    } else {
      alert(`Hata: ${result.error}`)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setCreateForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  if (loading && tenants.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tenant Yönetimi</h2>
          <p className="text-gray-600">İşletmelerinizi yönetin ve yeni tenant oluşturun</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yeni Tenant Oluştur
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Hata: {error}</p>
        </div>
      )}

      {/* Tenant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map(tenant => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
        
        {tenants.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz tenant yok</h3>
            <p className="text-gray-600 mb-4">İlk tenant'ınızı oluşturarak başlayın</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tenant Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Create Tenant Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Yeni Tenant Oluştur</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: Güzel Diş Kliniği"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="guzel-dis-klinigi"
                    pattern="^[a-z0-9-]+$"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sadece küçük harf, rakam ve tire kullanın
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sektör *
                  </label>
                  <select
                    value={createForm.sector}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {getSectorList().map(sector => (
                      <option key={sector.id} value={sector.id}>
                        {sector.icon} {sector.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özel Domain (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={createForm.domain}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, domain: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="www.guzeldisklinigi.com"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TenantCard({ tenant }: { tenant: Tenant }) {
  const sectorConfig = getSectorList().find(s => s.id === tenant.sector)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTenantUrl = () => {
    if (tenant.domain) {
      return `https://${tenant.domain}`
    }
    return `https://${tenant.sector}.sitem.com/${tenant.slug}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
               style={{ backgroundColor: sectorConfig?.secondaryColor }}>
            <span className="text-2xl">{sectorConfig?.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
            <p className="text-sm text-gray-600">{sectorConfig?.displayName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
          {tenant.status === 'active' ? 'Aktif' : tenant.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Kullanıcılar:</span>
          <span className="font-medium">{tenant.current_users}/{tenant.max_users}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Öğeler:</span>
          <span className="font-medium">{tenant.current_encrypted_items}/{tenant.max_encrypted_items}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium capitalize">{tenant.subscription_plan}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <a
          href={getTenantUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium text-center rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ziyaret Et
        </a>
        <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Düzenle
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Oluşturulma: {new Date(tenant.created_at).toLocaleDateString('tr-TR')}
        </p>
      </div>
    </div>
  )
}
