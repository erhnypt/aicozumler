
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';

export default function Pricing() {
  // SEO optimization
  useSEO();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Başlangıç',
      description: 'Küçük işletmeler ve bireysel kullanıcılar için',
      monthlyPrice: 299,
      yearlyPrice: 2390,
      popular: false,
      features: [
        'Günlük 100 AI sorgusu',
        '3 proje limiti',
        'Temel raporlama',
        'E-posta desteği',
        'AI İçerik Asistanı',
        'Temel sosyal medya araçları',
        '5 GB depolama alanı'
      ]
    },
    {
      name: 'Profesyonel',
      description: 'Büyüyen işletmeler için en popüler seçim',
      monthlyPrice: 599,
      yearlyPrice: 4792,
      popular: true,
      features: [
        'Günlük 500 AI sorgusu',
        '10 proje limiti',
        'Gelişmiş analitik ve raporlar',
        'Öncelikli e-posta desteği',
        'Tüm AI araçlarına erişim',
        'API entegrasyonu',
        '50 GB depolama alanı',
        'Özel entegrasyonlar',
        'A/B test araçları'
      ]
    },
    {
      name: 'Kurumsal',
      description: 'Büyük şirketler ve kurumsal müşteriler için',
      monthlyPrice: 1299,
      yearlyPrice: 10392,
      popular: false,
      features: [
        'Sınırsız AI sorgusu',
        'Sınırsız proje',
        'Özel raporlama ve dashboard',
        '7/24 telefon ve chat desteği',
        'Tüm premium özellikler',
        'Özel AI model eğitimi',
        '500 GB depolama alanı',
        'Özel hesap yöneticisi',
        'SLA garantisi',
        'Beyaz etiket çözümü',
        'Özel entegrasyonlar'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Ücretsiz deneme süresi var mı?',
      answer: 'Evet! Tüm planlarımızda 30 gün ücretsiz deneme imkanı sunuyoruz. Kredi kartı bilgisi gerektirmez.'
    },
    {
      question: 'Planımı istediğim zaman değiştirebilir miyim?',
      answer: 'Elbette. Planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur.'
    },
    {
      question: 'Ödeme nasıl yapılır?',
      answer: 'Kredi kartı, banka kartı ve havale ile ödeme kabul ediyoruz. Tüm ödemeler güvenli SSL ile şifrelenir.'
    },
    {
      question: 'API limitleri nelerdir?',
      answer: 'Her plan için farklı API limitleri bulunur. Profesyonel planda günlük 10.000 API çağrısı, Kurumsal planda sınırsız kullanım mevcuttur.'
    },
    {
      question: 'Teknik destek sağlanıyor mu?',
      answer: 'Evet! Tüm planlarımızda teknik destek sunuyoruz. Profesyonel planda öncelikli destek, Kurumsal planda 7/24 destek sağlanır.'
    },
    {
      question: 'Verilerim güvende mi?',
      answer: 'Verileriniz en yüksek güvenlik standartlarıyla korunur. SOC 2 Type II uyumlu altyapımız ve end-to-end şifreleme ile güvenlik sağlanır.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            İşinizin büyüklüğüne ve ihtiyaçlarınıza göre tasarlanmış esnek fiyatlandırma seçenekleri
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 text-lg font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Aylık
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                isYearly ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 ${
                  isYearly ? 'translate-x-9' : 'translate-x-1'
                }`}
              ></div>
            </button>
            <span className={`ml-3 text-lg font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yıllık
            </span>
            {isYearly && (
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                %20 İndirim
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-blue-500 transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      En Popüler
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        ₺{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{isYearly ? 'yıl' : 'ay'}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-green-600 mt-1">
                        Aylık ₺{Math.round(plan.yearlyPrice / 12)} (₺{plan.monthlyPrice * 12 - plan.yearlyPrice} tasarruf)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      // PayTR ödeme sayfasına yönlendirme işlemi burada yapılacak
                      window.open('https://www.paytr.com', '_blank');
                    }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.popular ? 'Şimdi Başla' : 'Planı Seç'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plan Karşılaştırması
            </h2>
            <p className="text-xl text-gray-600">
              Tüm planların detaylı özellik karşılaştırması
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Özellik</th>
                    <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">Başlangıç</th>
                    <th className="px-6 py-4 text-center text-lg font-semibold text-blue-600">Profesyonel</th>
                    <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">Kurumsal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Günlük AI Sorgusu</td>
                    <td className="px-6 py-4 text-center text-gray-700">100</td>
                    <td className="px-6 py-4 text-center text-gray-700">500</td>
                    <td className="px-6 py-4 text-center text-gray-700">Sınırsız</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Proje Limiti</td>
                    <td className="px-6 py-4 text-center text-gray-700">3</td>
                    <td className="px-6 py-4 text-center text-gray-700">10</td>
                    <td className="px-6 py-4 text-center text-gray-700">Sınırsız</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Depolama Alanı</td>
                    <td className="px-6 py-4 text-center text-gray-700">5 GB</td>
                    <td className="px-6 py-4 text-center text-gray-700">50 GB</td>
                    <td className="px-6 py-4 text-center text-gray-700">500 GB</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">API Erişimi</td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-close-line text-red-500 text-xl"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-check-line text-green-500 text-xl"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-check-line text-green-500 text-xl"></i>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Özel Hesap Yöneticisi</td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-close-line text-red-500 text-xl"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-close-line text-red-500 text-xl"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="ri-check-line text-green-500 text-xl"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600">
              Fiyatlandırma ile ilgili merak ettikleriniz
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hala Karar Veremediniz mi?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            30 gün ücretsiz deneme ile tüm özelliklerimizi keşfedin.
            Kredi kartı gerektirmez!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kayit"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              30 Gün Ücretsiz Başla
            </Link>
            <Link
              to="/iletisim"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Satış Ekibi ile Görüş
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
