
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';

export default function Home() {
  // SEO optimization
  useSEO();
  const features = [
    {
      icon: 'ri-edit-line',
      title: 'AI İçerik Asistanı',
      description: 'Blog yazıları, sosyal medya içerikleri ve pazarlama metinleri için güçlü AI asistanı.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'ri-share-line',
      title: 'AI Sosyal Medya Yöneticisi',
      description: 'Otomatik paylaşım planlama, içerik üretimi ve etkileşim yönetimi.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'AI Veri Analisti',
      description: 'İş verilerinizi analiz ederek detaylı raporlar ve öngörüler sunar.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'ri-customer-service-line',
      title: 'AI Müşteri Hizmetleri',
      description: '7/24 müşteri sorularını yanıtlayan akıllı chatbot sistemi.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: 'ri-mail-line',
      title: 'AI Pazarlama Otomasyonu',
      description: 'E-posta kampanyaları, lead yönetimi ve pazarlama süreçlerini otomatikleştirin.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: 'ri-brain-line',
      title: 'AI Strateji Danışmanı',
      description: 'İş stratejileriniz için yapay zeka destekli öneriler ve analitik çözümler.',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const testimonials = [
    {
      name: 'Mehmet Yılmaz',
      company: 'E-Ticaret Mağazası Sahibi',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20businessman%20in%20his%2040s%2C%20wearing%20a%20modern%20business%20suit%2C%20confident%20smile%2C%20clean%20office%20background%2C%20high-quality%20corporate%20headshot%20photography%2C%20natural%20lighting%2C%20professional%20appearance&width=80&height=80&seq=test1&orientation=squarish',
      content: 'AI Çözümleri sayesinde müşteri hizmetlerimi 7/24 otomatikleştirdim. Satışlarım %40 arttı!'
    },
    {
      name: 'Ayşe Demir',
      company: 'Dijital Pazarlama Uzmanı',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20businesswoman%20in%20her%2030s%2C%20wearing%20elegant%20business%20attire%2C%20warm%20smile%2C%20modern%20office%20environment%2C%20high-quality%20corporate%20headshot%20photography%2C%20natural%20lighting%2C%20confident%20appearance&width=80&height=80&seq=test2&orientation=squarish',
      content: 'İçerik üretimi artık çok kolay. Sosyal medya hesaplarımı yönetmek hiç bu kadar verimli olmamıştı.'
    },
    {
      name: 'Can Özkan',
      company: 'Startup Kurucusu',
      image: 'https://readdy.ai/api/search-image?query=Young%20Turkish%20entrepreneur%20in%20his%2020s%2C%20casual%20smart%20attire%2C%20energetic%20expression%2C%20modern%20startup%20office%20background%2C%20high-quality%20portrait%20photography%2C%20natural%20lighting%2C%20innovative%20appearance&width=80&height=80&seq=test3&orientation=squarish',
      content: 'Verilerimi analiz etmek ve raporlamak artık saniyeler sürüyor. Gerçekten işimi dönüştürdü.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <main id="main-content" role="main">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-24" aria-labelledby="hero-title">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20artificial%20intelligence%20technology%20background%20with%20neural%20networks%2C%20digital%20brain%20patterns%2C%20futuristic%20blue%20and%20purple%20gradients%2C%20abstract%20geometric%20shapes%2C%20clean%20minimalist%20design%2C%20high-tech%20atmosphere%2C%20professional%20business%20technology%20illustration%2C%20depth%20and%20dimension&width=1920&height=1080&seq=hero1&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              İşinizi Büyütmek İçin
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Yapay Zeka Çözümleri
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              aicozumleri.com ile pazarlama, içerik üretimi, müşteri hizmetleri ve daha fazlası için tek platform. 
              KOBİ'nizi geleceğe taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/kayit"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
              >
                Hemen Ücretsiz Deneyin
              </Link>
              <Link
                to="/fiyatlandirma"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Planları Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Güçlü AI Çözümlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İşinizi otomatikleştiren ve büyüten yapay zeka araçlarımızla tanışın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                <Link
                  to="/cozumler"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Detaylı Bilgi
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600">
              Binlerce memnun kullanıcının deneyimlerini okuyun
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-lg"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            İşinizi Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Bugün başlayın ve AI'ın gücünü işinizde deneyimleyin. 
            İlk 30 gün tamamen ücretsiz!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kayit"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
            >
              30 Gün Ücretsiz Başla
            </Link>
            <Link
              to="/iletisim"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Demo Talep Et
            </Link>
          </div>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  );
}
