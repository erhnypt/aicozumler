
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'KOBİ\'ler İçin Yapay Zeka: Dijital Dönüşümün Yeni Yüzü',
      excerpt: 'Küçük ve orta ölçekli işletmelerin yapay zeka teknolojilerini nasıl kullanabileceği ve bu dönüşümün işletmelerine katacağı değer hakkında kapsamlı rehber.',
      author: 'Dr. Ahmet Yılmaz',
      date: '15 Aralık 2024',
      readTime: '8 dk okuma',
      category: 'İş Stratejisi',
      image: 'https://readdy.ai/api/search-image?query=Small%20business%20owner%20using%20AI%20technology%20on%20laptop%2C%20modern%20office%20setting%2C%20digital%20transformation%20concept%2C%20professional%20business%20environment%2C%20technology%20integration%2C%20Turkish%20business%20context%2C%20success%20and%20growth%20visualization&width=600&height=300&seq=blog1&orientation=landscape',
      tags: ['AI', 'KOBİ', 'Dijital Dönüşüm', 'İş Stratejisi']
    },
    {
      id: 2,
      title: 'İçerik Pazarlamasında AI: Zamandan Nasıl Tasarruf Edersiniz?',
      excerpt: 'Yapay zeka destekli içerik üretim araçları ile pazarlama süreçlerinizi nasıl optimize edebileceğinizi ve markanızın sesini nasıl güçlendirebileceğinizi öğrenin.',
      author: 'Ayşe Özkan',
      date: '12 Aralık 2024',
      readTime: '6 dk okuma',
      category: 'Pazarlama',
      image: 'https://readdy.ai/api/search-image?query=Content%20marketing%20dashboard%20with%20AI%20tools%2C%20social%20media%20content%20creation%20interface%2C%20blog%20writing%20automation%2C%20marketing%20analytics%20charts%2C%20modern%20digital%20marketing%20workspace%2C%20creative%20content%20production%20environment&width=600&height=300&seq=blog2&orientation=landscape',
      tags: ['İçerik Pazarlama', 'AI', 'Sosyal Medya', 'Otomasyon']
    },
    {
      id: 3,
      title: 'Müşteri Hizmetlerinde Chatbot Devrimi: 7/24 Destek Çağı',
      excerpt: 'AI chatbotlar sayesinde müşteri memnuniyetini artırırken maliyetleri düşürmenin yolları. Gerçek müşteri hikayeleri ve başarı örnekleri.',
      author: 'Mehmet Demir',
      date: '10 Aralık 2024',
      readTime: '5 dk okuma',
      category: 'Müşteri Hizmetleri',
      image: 'https://readdy.ai/api/search-image?query=Customer%20service%20chatbot%20interface%2C%20AI%20assistant%20helping%20customers%2C%20modern%20customer%20support%20dashboard%2C%20friendly%20chat%20conversation%2C%20professional%20customer%20service%20environment%2C%2024%2F7%20support%20visualization&width=600&height=300&seq=blog3&orientation=landscape',
      tags: ['Chatbot', 'Müşteri Hizmetleri', 'AI', 'Otomasyon']
    },
    {
      id: 4,
      title: 'Veri Analitiği ile İş Kararlarınızı Güçlendirin',
      excerpt: 'İş verilerinizi AI ile analiz ederek daha bilinçli kararlar almanın yolları. Veri görselleştirme ve öngörü modellemesi ile geleceğe hazır olun.',
      author: 'Zeynep Kaya',
      date: '8 Aralık 2024',
      readTime: '7 dk okuma',
      category: 'Veri Analitiği',
      image: 'https://readdy.ai/api/search-image?query=Business%20intelligence%20dashboard%20with%20data%20analytics%20charts%2C%20AI-powered%20insights%2C%20financial%20metrics%20visualization%2C%20modern%20corporate%20analytics%20interface%2C%20data-driven%20decision%20making%20environment%2C%20professional%20business%20analysis&width=600&height=300&seq=blog4&orientation=landscape',
      tags: ['Veri Analitiği', 'İş Zekası', 'AI', 'Karar Verme']
    },
    {
      id: 5,
      title: 'E-ticaret\'te AI: Satışları Artırmanın Yeni Yolları',
      excerpt: 'Yapay zeka teknolojileri ile e-ticaret sitenizin conversion oranlarını artırın. Kişiselleştirme, ürün önerisi ve dinamik fiyatlandırma stratejileri.',
      author: 'Dr. Ahmet Yılmaz',
      date: '5 Aralık 2024',
      readTime: '9 dk okuma',
      category: 'E-ticaret',
      image: 'https://readdy.ai/api/search-image?query=E-commerce%20website%20with%20AI%20recommendations%2C%20online%20shopping%20interface%2C%20personalized%20product%20suggestions%2C%20conversion%20optimization%20tools%2C%20modern%20e-commerce%20dashboard%2C%20digital%20retail%20technology&width=600&height=300&seq=blog5&orientation=landscape',
      tags: ['E-ticaret', 'AI', 'Conversion', 'Kişiselleştirme']
    },
    {
      id: 6,
      title: 'Yapay Zeka Güvenliği ve Veri Koruma: Bilmeniz Gerekenler',
      excerpt: 'AI çözümlerini kullanırken veri güvenliği ve gizlilik konularında dikkat edilmesi gerekenler. KVKK uyumluluğu ve en iyi güvenlik pratikleri.',
      author: 'Zeynep Kaya',
      date: '3 Aralık 2024',
      readTime: '6 dk okuma',
      category: 'Güvenlik',
      image: 'https://readdy.ai/api/search-image?query=Cybersecurity%20and%20AI%20data%20protection%20concept%2C%20secure%20digital%20infrastructure%2C%20data%20encryption%20visualization%2C%20privacy%20protection%20symbols%2C%20modern%20security%20dashboard%2C%20professional%20cybersecurity%20environment&width=600&height=300&seq=blog6&orientation=landscape',
      tags: ['Güvenlik', 'KVKK', 'Veri Koruma', 'AI']
    }
  ];

  const categories = ['Tümü', 'İş Stratejisi', 'Pazarlama', 'Müşteri Hizmetleri', 'Veri Analitiği', 'E-ticaret', 'Güvenlik'];
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI Blog
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Yapay zeka dünyasındaki en güncel gelişmeler, pratik ipuçları ve 
            başarı hikayeleri burada!
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  placeholder="Makale ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-file-search-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Makale bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun makale bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Devamını Oku
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI Dünyasındaki Gelişmeleri Kaçırmayın
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Haftalık bültenimize abone olun ve en güncel AI haberleri direkt gelen kutunuza gelsin.
          </p>
          
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Abone Ol
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            Spam göndermiyoruz. İstediğiniz zaman aboneliği iptal edebilirsiniz.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
