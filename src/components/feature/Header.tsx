
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="ri-robot-line text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
              logo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors cursor-pointer ${
                isActivePath('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/cozumler"
              className={`font-medium transition-colors cursor-pointer ${
                isActivePath('/cozumler') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Çözümler
            </Link>
            <Link
              to="/fiyatlandirma"
              className={`font-medium transition-colors cursor-pointer ${
                isActivePath('/fiyatlandirma') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Fiyatlandırma
            </Link>
            <Link
              to="/blog"
              className={`font-medium transition-colors cursor-pointer ${
                isActivePath('/blog') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Blog
            </Link>
            <Link
              to="/iletisim"
              className={`font-medium transition-colors cursor-pointer ${
                isActivePath('/iletisim') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              İletişim
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />
            
            {loading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {profile?.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {profile?.first_name || user.email?.split('@')[0]}
                  </span>
                  <i className="ri-arrow-down-s-line text-gray-500"></i>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="ri-dashboard-line mr-2"></i>
                      Dashboard
                    </Link>
                    <Link
                      to="/profil"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="ri-user-line mr-2"></i>
                      Profil
                    </Link>
                    <Link
                      to="/ayarlar"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="ri-settings-line mr-2"></i>
                      Ayarlar
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl text-gray-700`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`font-medium transition-colors cursor-pointer ${
                  isActivePath('/') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/cozumler"
                className={`font-medium transition-colors cursor-pointer ${
                  isActivePath('/cozumler') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Çözümler
              </Link>
              <Link
                to="/fiyatlandirma"
                className={`font-medium transition-colors cursor-pointer ${
                  isActivePath('/fiyatlandirma') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Fiyatlandırma
              </Link>
              <Link
                to="/blog"
                className={`font-medium transition-colors cursor-pointer ${
                  isActivePath('/blog') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/iletisim"
                className={`font-medium transition-colors cursor-pointer ${
                  isActivePath('/iletisim') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
              
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {profile?.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : user.email?.split('@')[0]
                        }
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-700 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profil"
                    className="block py-2 text-gray-700 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/giris"
                    className="block font-medium text-gray-700 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ücretsiz Başla
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
