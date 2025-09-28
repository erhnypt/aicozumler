
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://readdy.ai/api/form/d3a2scmnjg5se8v761m0', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'ri-phone-line',
      title: 'Telefon',
      info: '+90 555 123 45 67',
      description: 'Pazartesi - Cuma: 09:00 - 18:00'
    },
    {
      icon: 'ri-mail-line',
      title: 'E-posta',
      info: 'destek@aicozumleri.com',
      description: '24 saat içinde yanıt veriyoruz'
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Adres',
      info: 'Levent Mahallesi, Teknoloji Caddesi No:42',
      description: 'Beşiktaş, İstanbul, Türkiye'
    },
    {
      icon: 'ri-time-line',
      title: 'Çalışma Saatleri',
      info: 'Pazartesi - Cuma: 09:00 - 18:00',
      description: 'Hafta sonu: Kapalı'
    }
  ];

  const offices = [
    {
      city: 'İstanbul',
      address: 'Levent Mahallesi, Teknoloji Caddesi No:42, Beşiktaş',
      phone: '+90 555 123 45 67',
      email: 'istanbul@aicozumleri.com'
    },
    {
      city: 'Ankara',
      address: 'Çankaya Mahallesi, İnovasyon Sokak No:15, Çankaya',
      phone: '+90 555 234 56 78',
      email: 'ankara@aicozumleri.com'
    },
    {
      city: 'İzmir',
      address: 'Alsancak Mahallesi, Teknoloji Park No:8, Konak',
      phone: '+90 555 345 67 89',
      email: 'izmir@aicozumleri.com'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Sorularınız mı var? Size nasıl yardımcı olabileceğimizi öğrenmek için 
            bizimle iletişime geçin.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${info.icon} text-xl text-blue-600`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.info}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bize Mesaj Gönderin
              </h2>
              
              <form id="iletisim-formu" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Adınızı giriniz"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Şirket adınız"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                  >
                    <option value="">Konu seçiniz</option>
                    <option value="genel-bilgi">Genel Bilgi</option>
                    <option value="urun-demo">Ürün Demo Talebi</option>
                    <option value="fiyatlandirma">Fiyatlandırma</option>
                    <option value="teknik-destek">Teknik Destek</option>
                    <option value="is-birligi">İş Birliği</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder="Mesajınızı buraya yazın... (maksimum 500 karakter)"
                  ></textarea>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.message.length}/500
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || formData.message.length > 500}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bizi Ziyaret Edin
              </h2>
              
              <div className="mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.8745676892947!2d29.0132808!3d41.0813603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca58b28c5536f4c!2sLevent%2C%20Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1698912345678!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="ri-map-pin-line text-blue-600 text-xl mt-1 mr-3"></i>
                  <div>
                    <p className="font-medium text-gray-900">Ana Ofis</p>
                    <p className="text-gray-600">Levent Mahallesi, Teknoloji Caddesi No:42</p>
                    <p className="text-gray-600">Beşiktaş, İstanbul, Türkiye</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="ri-time-line text-blue-600 text-xl mt-1 mr-3"></i>
                  <div>
                    <p className="font-medium text-gray-900">Çalışma Saatleri</p>
                    <p className="text-gray-600">Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p className="text-gray-600">Hafta sonu: Kapalı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ofislerimiz
            </h2>
            <p className="text-xl text-gray-600">
              Türkiye'nin farklı şehirlerinde size daha yakın hizmet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{office.city}</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <i className="ri-map-pin-line text-blue-600 mt-1 mr-3"></i>
                    <p className="text-gray-700 text-sm">{office.address}</p>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-phone-line text-blue-600 mr-3"></i>
                    <a href={`tel:${office.phone}`} className="text-gray-700 text-sm hover:text-blue-600 cursor-pointer">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-mail-line text-blue-600 mr-3"></i>
                    <a href={`mailto:${office.email}`} className="text-gray-700 text-sm hover:text-blue-600 cursor-pointer">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sosyal Medyada Takip Edin
          </h2>
          <p className="text-gray-600 mb-8">
            En güncel haberler ve AI dünyasındaki gelişmeler için bizi takip edin
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
              <i className="ri-linkedin-fill text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
              <i className="ri-twitter-x-fill text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
              <i className="ri-instagram-fill text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors cursor-pointer">
              <i className="ri-facebook-fill text-xl"></i>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
