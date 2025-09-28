import { useTenantContext } from '../../contexts/TenantContext'

export default function TenantContact() {
  const { tenantSlug } = useTenantContext()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">İletişim</h1>
        <p className="text-gray-600">Bize ulaşın, size yardımcı olmaktan mutluluk duyarız.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📞</span>
              <div>
                <p className="font-medium text-gray-900">Telefon</p>
                <p className="text-gray-600">+90 (555) 123 45 67</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <p className="font-medium text-gray-900">E-posta</p>
                <p className="text-gray-600">{tenantSlug}@sitem.com</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl mr-3">📍</span>
              <div>
                <p className="font-medium text-gray-900">Adres</p>
                <p className="text-gray-600">
                  Örnek Mahallesi, Test Sokak No:123<br />
                  İstanbul, Türkiye
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl mr-3">🕒</span>
              <div>
                <p className="font-medium text-gray-900">Çalışma Saatleri</p>
                <p className="text-gray-600">
                  Pazartesi - Cuma: 09:00 - 18:00<br />
                  Cumartesi: 09:00 - 16:00
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mesaj Gönder</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınızı ve soyadınızı girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E-posta adresinizi girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Telefon numaranızı girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mesajınızı yazın..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Mesaj Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
