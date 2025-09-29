
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { supabase } from '../../lib/supabase';
import { slugify, sectorList, sectorSubdomain } from '../../utils/slug';

export default function Register() {
  const { signUp, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    sector: 'dentist',
    tenantName: '',
    phone: '',
    agreeTerms: false,
    subscribeNewsletter: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz.');
      setIsLoading(false);
      return;
    }

    if (!formData.tenantName || formData.tenantName.trim().length < 3) {
      setError('Lütfen geçerli bir işletme/klinik adı girin.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        phone: formData.phone
      });
      
      if (error) {
        if (error.message?.includes('User already registered')) {
          setError('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
        } else if (error.message?.includes('Password should be at least')) {
          setError('Şifre en az 6 karakter olmalıdır.');
        } else {
          setError('Kayıt oluşturulamadı. Lütfen tekrar deneyin.');
        }
        return;
      }

      // Supabase bazı projelerde e-posta doğrulaması gerektirir ve session dönmez.
      const { data: sessionRes } = await supabase.auth.getSession();
      const session = sessionRes?.session;

      if (!session) {
        // Oturum yoksa tenant oluşturmayı daha sonra yapmak üzere sakla
        const pending = {
          sector: formData.sector,
          tenantName: formData.tenantName,
          company: formData.company
        };
        localStorage.setItem('pendingTenant', JSON.stringify(pending));
        setSuccess(true);
        return;
      }

      // Oturum varsa hemen tenant oluştur
      const slug = slugify(formData.tenantName);
      const sub = sectorSubdomain(formData.sector);

      const { data: tenant, error: tenantErr } = await supabase
        .from('tenants')
        .insert({
          name: formData.tenantName,
          slug,
          sector: formData.sector,
          subdomain: sub
        })
        .select()
        .single();

      if (tenantErr) {
        console.error('Tenant create error:', tenantErr);
        setError('Tenant oluşturulurken hata oluştu. Lütfen e-posta doğrulamasını tamamladıktan sonra giriş yapıp tekrar deneyin.');
        return;
      }

      await supabase
        .from('profiles')
        .update({ tenant_id: tenant.id, company: formData.company })
        .eq('email', formData.email);

      await supabase
        .from('tenant_members')
        .insert({ tenant_id: tenant.id, role: 'owner' });

      setSuccess(true);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    const sub = sectorSubdomain(formData.sector);
    const slug = slugify(formData.tenantName);
    const target = `/${sub}/${slug}`; // Path-based route
    return (
      <div className="min-h-screen">
        <Header />
        <section className="py-16 bg-gray-50 min-h-screen flex items-center">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-check-line text-2xl text-green-600"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Kayıt Başarılı!</h1>
              <p className="text-gray-600 mb-6">
                Eğer e-posta doğrulaması gerekiyorsa lütfen gelen kutunuzu kontrol edin. İlk girişinizden sonra işletmeniz otomatik oluşturulacaktır.
              </p>
              <Link
                to="/giris"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-robot-line text-2xl text-white"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ücretsiz Hesap Oluştur</h1>
              <p className="text-gray-600">30 gün ücretsiz deneme ile başlayın</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                    Sektör *
                  </label>
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {sectorList.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme/Klinik Adı *
                  </label>
                  <input
                    type="text"
                    id="tenantName"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Örn: Ahmet Diş Polikliniği"
                  />
                </div>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="En az 8 karakter"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrar *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Şifrenizi tekrar giriniz"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                    <Link to="/kullanim-kosullari" className="text-blue-600 hover:text-blue-500 cursor-pointer">
                      Kullanım Koşulları
                    </Link>{' '}
                    ve{' '}
                    <Link to="/gizlilik-politikasi" className="text-blue-600 hover:text-blue-500 cursor-pointer">
                      Gizlilik Politikası
                    </Link>
                    'nı kabul ediyorum. *
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  />
                  <label htmlFor="subscribeNewsletter" className="ml-2 text-sm text-gray-700">
                    Yeni özellikler ve güncellemeler hakkında e-posta almak istiyorum.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                {isLoading ? 'Hesap oluşturuluyor...' : 'Ücretsiz Hesap Oluştur'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/giris" className="text-blue-600 font-semibold hover:text-blue-500 cursor-pointer">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
