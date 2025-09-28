
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-robot-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold">AI Çözümleri</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              KOBİ'ler ve bireysel kullanıcılar için yapay zeka tabanlı iş otomasyonu araçları. 
              İşinizi büyütmek için güvenilir AI çözümü ortağınız.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-twitter-x-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cozumler" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Çözümlerimiz
                </Link>
              </li>
              <li>
                <Link to="/fiyatlandirma" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/iletisim" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  İletişim
                </Link>
              </li>
              <li>
                <a href="mailto:destek@aicozumleri.com" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  destek@aicozumleri.com
                </a>
              </li>
              <li>
                <a href="tel:+905551234567" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  +90 555 123 45 67
                </a>
              </li>
              <li>
                <Link to="/giris" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} AI Çözümleri. Tüm hakları saklıdır.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://readdy.ai/?origin=logo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Powered by Readdy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
