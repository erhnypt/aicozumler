
import { useProtectedRoute } from '../../hooks/useProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import { useEventTracking } from '../../hooks/useAnalytics'
import Header from '../../components/feature/Header'
import Footer from '../../components/feature/Footer'
import EncryptedDataManager from '../../components/feature/EncryptedDataManager'
import { SubscriptionManager } from '../../components/subscription/SubscriptionManager'
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard'
import { TenantManager } from '../../components/tenant/TenantManager'
import { SupabaseTest } from '../../components/SupabaseTest'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  useProtectedRoute()
  const { user, profile } = useAuth()
  const { trackLogin } = useEventTracking()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Track dashboard visit
    trackLogin()
  }, [])

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: '📊' },
    { id: 'data', name: 'Veri Yönetimi', icon: '🔐' },
    { id: 'tenants', name: 'Tenant Yönetimi', icon: '🏢' },
    { id: 'subscription', name: 'Abonelik', icon: '💳' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Ayarlar', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <i className="ri-user-line text-2xl text-white"></i>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Hoş geldiniz, {profile?.first_name || 'Kullanıcı'}!
                    </h1>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <SubscriptionManager compact />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AnalyticsDashboard compact />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EncryptedDataManager
                  dataType="api_keys"
                  title="Son API Anahtarları"
                  placeholder="API anahtarınızı girin..."
                />
                <EncryptedDataManager
                  dataType="personal_notes"
                  title="Son Notlar"
                  placeholder="Özel notlarınızı yazın..."
                  multiline={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EncryptedDataManager
                dataType="api_keys"
                title="API Anahtarları"
                placeholder="API anahtarınızı girin..."
              />
              <EncryptedDataManager
                dataType="personal_notes"
                title="Güvenli Notlar"
                placeholder="Özel notlarınızı yazın..."
                multiline={true}
              />
              <EncryptedDataManager
                dataType="payment_info"
                title="Ödeme Bilgileri"
                placeholder="Kredi kartı/banka bilgileri..."
                multiline={true}
              />
              <EncryptedDataManager
                dataType="passwords"
                title="Güvenli Şifreler"
                placeholder="Şifre bilgilerinizi girin..."
              />
            </div>
          )}

          {activeTab === 'tenants' && <TenantManager />}
          
          {activeTab === 'subscription' && <SubscriptionManager />}
          
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <SupabaseTest />
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <i className="ri-shield-check-line text-amber-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Güvenlik Bilgisi</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      Tüm verileriniz güçlü şifreleme algoritmaları ile korunmaktadır. 
                      Verileriniz sadece sizin hesabınızla erişilebilir ve sunucularımızda şifreli olarak saklanır. 
                      Hassas bilgilerinizi buraya güvenle kaydedebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
