
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';

export default function Solutions() {
  // SEO optimization
  useSEO();
  const solutions = [
    {
      id: 1,
      icon: 'ri-edit-line',
      title: 'AI İçerik Asistanı',
      shortDesc: 'Blog yazıları, sosyal medya içerikleri ve pazarlama metinleri için güçlü AI asistanı.',
      features: [
        'SEO optimizasyonlu blog yazıları',
        'Sosyal medya içerik üretimi',
        'E-posta pazarlama metinleri',
        'Ürün açıklamaları',
        '50+ dil desteği',
        'Marka tonuna uygun içerik'
      ],
      benefits: [
        'Günde 10 kat daha hızlı içerik üretimi',
        'Tutarlı marka sesi',
        'SEO dostu içerikler',
        'Yaratıcılık ve verimliliğin artması'
      ],
      image: 'https://readdy.ai/api/search-image?query=Modern%20AI%20content%20creation%20interface%20with%20text%20generation%2C%20blog%20writing%20tools%2C%20social%20media%20content%20creator%20dashboard%2C%20clean%20minimalist%20design%2C%20blue%20and%20white%20colors%2C%20professional%20software%20interface%2C%20high-tech%20typography%20elements%2C%20creative%20writing%20workspace&width=600&height=400&seq=content1&orientation=landscape',
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 2,
      icon: 'ri-share-line',
      title: 'AI Sosyal Medya Yöneticisi',
      shortDesc: 'Otomatik paylaşım planlama, içerik üretimi ve etkileşim yönetimi.',
      features: [
        'Otomatik içerik planlama',
        'Çoklu platform yönetimi',
        'Optimal paylaşım zamanları',
        'Hashtag önerileri',
        'Etkileşim analizi',
        'Görsel içerik üretimi'
      ],
      benefits: [
        'Günlük 2 saat zaman tasarrufu',
        '%300 daha fazla etkileşim',
        'Tutarlı sosyal medya varlığı',
        'Profesyonel görsel içerikler'
      ],
      image: 'https://readdy.ai/api/search-image?query=Social%20media%20management%20dashboard%20with%20multiple%20platform%20interfaces%2C%20scheduling%20calendar%2C%20analytics%20charts%2C%20content%20creation%20tools%2C%20modern%20UI%20design%2C%20vibrant%20colors%2C%20professional%20social%20media%20workspace%2C%20engagement%20metrics%20visualization&width=600&height=400&seq=social1&orientation=landscape',
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 3,
      icon: 'ri-bar-chart-line',
      title: 'AI Veri Analisti',
      shortDesc: 'İş verilerinizi analiz ederek detaylı raporlar ve öngörüler sunar.',
      features: [
        'Otomatik veri görselleştirme',
        'Trend analizi ve öngörüler',
        'Özelleştirilebilir raporlar',
        'Gerçek zamanlı dashboard',
        'KPI takibi',
        'Performans önerileri'
      ],
      benefits: [
        'Veri tabanlı karar verme',
        'Gelecek tahminleri',
        'Zaman ve maliyet tasarrufu',
        'Rekabetçi avantaj'
      ],
      image: 'https://readdy.ai/api/search-image?query=Business%20intelligence%20dashboard%20with%20data%20visualization%20charts%2C%20graphs%2C%20analytics%20interfaces%2C%20modern%20corporate%20design%2C%20blue%20and%20teal%20colors%2C%20professional%20data%20analysis%20workspace%2C%20financial%20metrics%2C%20KPI%20indicators%2C%20clean%20minimal%20UI&width=600&height=400&seq=analytics1&orientation=landscape',
      color: 'from-green-500 to-emerald-500',
      popular: false
    },
    {
      id: 4,
      icon: 'ri-customer-service-line',
      title: 'AI Müşteri Hizmetleri',
      shortDesc: '7/24 müşteri sorularını yanıtlayan akıllı chatbot sistemi.',
      features: [
        '7/24 otomatik yanıt',
        'Çoklu dil desteği',
        'Özelleştirilebilir chatbot',
        'Canlı destek entegrasyonu',
        'Müşteri memnuniyet analizi',
        'Sık sorulan sorular yönetimi'
      ],
      benefits: [
        '%80 daha hızlı yanıt süreleri',
        'Müşteri memnuniyetinde artış',
        'Destek maliyetlerinde %60 azalma',
        '24/7 kesintisiz hizmet'
      ],
      image: 'https://readdy.ai/api/search-image?query=Customer%20service%20chatbot%20interface%20with%20conversation%20bubbles%2C%20AI%20assistant%20avatar%2C%20modern%20chat%20UI%20design%2C%20helpful%20customer%20support%20dashboard%2C%20blue%20and%20white%20colors%2C%20professional%20service%20interface%2C%20friendly%20communication%20tools&width=600&height=400&seq=customer1&orientation=landscape',
      color: 'from-orange-500 to-red-500',
      popular: false
    },
    {
      id: 5,
      icon: 'ri-mail-line',
      title: 'AI Pazarlama Otomasyonu',
      shortDesc: 'E-posta kampanyaları, lead yönetimi ve pazarlama süreçlerini otomatikleştirin.',
      features: [
        'Otomatik e-posta kampanyaları',
        'Lead scoring ve segmentasyon',
        'Kişiselleştirilmiş içerik',
        'A/B test otomasyonu',
        'Conversion tracking',
        'CRM entegrasyonu'
      ],
      benefits: [
        'Conversion oranlarında %250 artış',
        'Pazarlama ROI\'sinin iyileşmesi',
        'Kişiselleştirilmiş müşteri deneyimi',
        'Otomatik lead nurturing'
      ],
      image: 'https://readdy.ai/api/search-image?query=Email%20marketing%20automation%20dashboard%20with%20campaign%20management%20tools%2C%20lead%20tracking%20interface%2C%20conversion%20analytics%2C%20modern%20marketing%20software%20design%2C%20professional%20purple%20and%20blue%20colors%2C%20email%20templates%2C%20automation%20workflows&width=600&height=400&seq=marketing1&orientation=landscape',
      color: 'from-indigo-500 to-blue-500',
      popular: true
    },
    {
      id: 6,
      icon: 'ri-brain-line',
      title: 'AI Strateji Danışmanı',
      shortDesc: 'İş stratejileriniz için yapay zeka destekli öneriler ve analitik çözümler.',
      features: [
        'Rekabet analizi',
        'Pazar fırsatları tespiti',
        'Strateji optimizasyonu',
        'Risk analizi',
        'Performans öngörüleri',
        'Eylem planı önerileri'
      ],
      benefits: [
        'Stratejik karar verme desteği',
        'Pazar avantajı yakalama',
        'Risk yönetimi',
        'Sürdürülebilir büyüme'
      ],
      image: 'https://readdy.ai/api/search-image?query=Business%20strategy%20consulting%20dashboard%20with%20AI%20recommendations%2C%20strategic%20planning%20tools%2C%20market%20analysis%20charts%2C%20professional%20business%20intelligence%20interface%2C%20teal%20and%20cyan%20colors%2C%20corporate%20strategy%20workspace%2C%20data-driven%20insights&width=600&height=400&seq=strategy1&orientation=landscape',
      color: 'from-teal-500 to-cyan-500',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Çözümlerimiz
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              İşinizi dönüştüren yapay zeka araçlarımızla tanışın. Her bir çözüm, 
              verimliliğinizi artırmak ve rekabet avantajı sağlamak için tasarlandı.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {solutions.map((solution) => (
              <div key={solution.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {solution.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    En Popüler Çözüm
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center`}>
                      <i className={`${solution.icon} text-2xl text-white`}></i>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{solution.shortDesc}</p>

                  <div className="mb-6">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Özellikler</h4>
                      <ul className="space-y-2">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <i className="ri-check-line text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Faydalar</h4>
                      <ul className="space-y-2">
                        {solution.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <i className="ri-star-line text-yellow-500 mt-1 mr-2 flex-shrink-0"></i>
                            <span className="text-sm text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/kayit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center cursor-pointer whitespace-nowrap"
                    >
                      Hemen Başla
                    </Link>
                    <Link
                      to="/fiyatlandirma"
                      className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-center cursor-pointer whitespace-nowrap"
                    >
                      Fiyatları Gör
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Hangi Çözümün Size Uygun Olduğundan Emin Değil misiniz?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Uzmanlarımızla görüşün ve işiniz için en uygun AI çözümünü keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Ücretsiz Danışmanlık
            </Link>
            <Link
              to="/kayit"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Tüm Çözümleri Dene
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
