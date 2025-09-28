
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  const teamMembers = [
    {
      name: 'Dr. Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20businessman%20CEO%20in%20his%2040s%2C%20wearing%20elegant%20business%20suit%2C%20confident%20leadership%20expression%2C%20modern%20office%20background%2C%20high-quality%20corporate%20executive%20photography%2C%20natural%20lighting%2C%20authoritative%20appearance&width=300&height=300&seq=team1&orientation=squarish',
      description: 'Stanford Üniversitesi AI PhD\'si. 15 yıl teknoloji sektörü deneyimi.'
    },
    {
      name: 'Zeynep Kaya',
      role: 'CTO & Kurucu Ortak',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20businesswoman%20CTO%20in%20her%2030s%2C%20wearing%20modern%20business%20attire%2C%20intelligent%20confident%20smile%2C%20tech%20startup%20office%20environment%2C%20high-quality%20corporate%20photography%2C%20natural%20lighting%2C%20innovative%20appearance&width=300&height=300&seq=team2&orientation=squarish',
      description: 'MIT mezunu yazılım mühendisi. AI ve makine öğrenmesi uzmanı.'
    },
    {
      name: 'Mehmet Demir',
      role: 'Ürün Direktörü',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20male%20product%20manager%20in%20his%2030s%2C%20casual%20smart%20business%20attire%2C%20friendly%20approachable%20expression%2C%20modern%20tech%20office%20background%2C%20high-quality%20corporate%20photography%2C%20natural%20lighting%2C%20product-focused%20appearance&width=300&height=300&seq=team3&orientation=squarish',
      description: 'Google\'da 8 yıl ürün yöneticiliği. Kullanıcı deneyimi uzmanı.'
    },
    {
      name: 'Ayşe Özkan',
      role: 'Pazarlama Direktörü',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Turkish%20businesswoman%20marketing%20director%20in%20her%2030s%2C%20stylish%20business%20outfit%2C%20creative%20energetic%20expression%2C%20modern%20marketing%20office%20background%2C%20high-quality%20corporate%20photography%2C%20natural%20lighting%2C%20marketing-focused%20appearance&width=300&height=300&seq=team4&orientation=squarish',
      description: 'Dijital pazarlama ve growth hacking alanında 10 yıl deneyim.'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Şirket Kuruluşu',
      description: 'AI Çözümleri, Türkiye\'de KOBİ\'lere yönelik AI araçları geliştirmek amacıyla kuruldu.'
    },
    {
      year: '2022',
      title: 'İlk Ürün Lansmanı',
      description: 'AI İçerik Asistanı ile piyasaya giriş yaptık ve ilk 1000 kullanıcıya ulaştık.'
    },
    {
      year: '2023',
      title: 'Hızlı Büyüme',
      description: 'Ürün portföyümüzü genişlettik ve 10.000+ aktif kullanıcıya ulaştık.'
    },
    {
      year: '2024',
      title: 'Pazar Liderliği',
      description: 'Türkiye\'nin en büyük AI-SAAS platformu olduk. 50.000+ mutlu müşteri.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Türkiye\'nin önde gelen yapay zeka çözümleri platformu olarak, 
            işletmelerin dijital dönüşümünde güvenilir ortağıyız.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Misyonumuz
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                KOBİ\'ler ve bireysel kullanıcılar için yapay zeka teknologisini erişilebilir, 
                kullanışlı ve uygun maliyetli hale getirmek. Her işletmenin, büyüklüğü ne olursa olsun, 
                AI\'ın gücünden faydalanabilmesini sağlamak.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Amacımız, teknoloji engellerini kaldırarak işletmelerin core business\'larına 
                odaklanmalarını sağlamak ve rekabet avantajı kazandırmaktır.
              </p>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Modern%20business%20team%20working%20together%20in%20bright%20office%20space%2C%20diverse%20professionals%20collaborating%20on%20AI%20technology%20projects%2C%20laptops%20and%20digital%20screens%20showing%20data%20analytics%2C%20teamwork%20and%20innovation%20atmosphere%2C%20professional%20corporate%20environment%2C%20natural%20lighting%2C%20success%20and%20growth%20mindset&width=600&height=400&seq=mission1&orientation=landscape"
                alt="Misyonumuz"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://readdy.ai/api/search-image?query=Futuristic%20business%20landscape%20with%20AI%20technology%20integration%2C%20smart%20office%20buildings%2C%20digital%20transformation%20visualization%2C%20modern%20corporate%20architecture%2C%20blue%20and%20purple%20tech%20colors%2C%20innovation%20and%20future%20vision%20concept%2C%20professional%20business%20environment%2C%20high-tech%20atmosphere&width=600&height=400&seq=vision1&orientation=landscape"
                alt="Vizyonumuz"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Vizyonumuz
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                2030 yılına kadar Türkiye\'nin ve bölgenin en büyük AI-SAAS platformu olmak. 
                Bir milyondan fazla işletmenin dijital dönüşümüne öncülük etmek.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Yapay zeka teknolojisinin demokratikleştirilmesi yoluyla, her büyüklükteki 
                işletmenin global pazarda rekabet edebilir hale gelmesini sağlamak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-xl text-gray-600">
              Kuruluşumuzdan bugüne kadar attığımız önemli adımlar
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Uzman Ekibimiz
            </h2>
            <p className="text-xl text-gray-600">
              Alanında uzman, deneyimli profesyonellerden oluşan ekibimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600">
              Çalışma kültürümüzü şekillendiren temel değerler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-lightbulb-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">İnovasyon</h3>
              <p className="text-gray-600 leading-relaxed">
                Sürekli öğrenme ve gelişim ile teknolojinin sınırlarını zorlarız. 
                Yaratıcı çözümler üretmeyi hedefleriz.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Güven</h3>
              <p className="text-gray-600 leading-relaxed">
                Müşterilerimizin verilerini en üst düzeyde korur, şeffaf ve 
                dürüst iletişim kurarız.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Müşteri Odaklılık</h3>
              <p className="text-gray-600 leading-relaxed">
                Her kararımızda müşteri memnuniyetini önceleyir, 
                ihtiyaçlarına özel çözümler geliştiririz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bizimle Çalışmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            İşinizi büyütmek için AI\'ın gücünü kullanın. 
            Hemen başlayın ve farkı deneyimleyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kayit"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Ücretsiz Deneyin
            </Link>
            <Link
              to="/iletisim"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
