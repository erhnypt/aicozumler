import Header from '../../components/feature/Header'
import Footer from '../../components/feature/Footer'
import { Link } from 'react-router-dom'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-16 bg-gray-50 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-send-line text-2xl text-blue-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">E-postanızı Doğrulayın</h1>
            <p className="text-gray-600 mb-4">
              Kayıt işlemini tamamlamak için e-posta adresinize gönderdiğimiz doğrulama bağlantısına tıklayın.
            </p>
            <p className="text-gray-600 mb-6">
              Doğrulama tamamlandıktan sonra tekrar giriş yaparak devam edebilirsiniz.
            </p>
            <Link to="/giris" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
