import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını import et
import trTranslations from './locales/tr.json';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  tr: {
    translation: trTranslations
  },
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

// Language configuration
const languageConfig = {
  tr: { dir: 'ltr', name: 'Türkçe' },
  en: { dir: 'ltr', name: 'English' },
  ar: { dir: 'rtl', name: 'العربية' }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    
    lng: 'tr', // varsayılan dil
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Debug in development
    debug: process.env.NODE_ENV === 'development',
    
    // React configuration
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    
    // Formatting
    returnObjects: true,
    joinArrays: '\n',
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${lng}.${ns}.${key}`);
      }
    },
  });

// Language change handler
i18n.on('languageChanged', (lng) => {
  const config = languageConfig[lng as keyof typeof languageConfig];
  if (config) {
    // Update document direction
    document.documentElement.dir = config.dir;
    document.documentElement.lang = lng;
    
    // Update meta tag
    const metaLang = document.querySelector('meta[name="language"]');
    if (metaLang) {
      metaLang.setAttribute('content', lng);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'language';
      meta.content = lng;
      document.head.appendChild(meta);
    }
    
    // Load RTL styles if needed
    if (config.dir === 'rtl') {
      loadRTLStyles();
    } else {
      removeRTLStyles();
    }
  }
});

// Load RTL styles dynamically
function loadRTLStyles() {
  if (!document.getElementById('rtl-styles')) {
    const link = document.createElement('link');
    link.id = 'rtl-styles';
    link.rel = 'stylesheet';
    link.href = '/src/styles/rtl.css';
    document.head.appendChild(link);
  }
}

// Remove RTL styles
function removeRTLStyles() {
  const rtlStyles = document.getElementById('rtl-styles');
  if (rtlStyles) {
    rtlStyles.remove();
  }
}

// Initialize language on load
const savedLanguage = localStorage.getItem('preferred-language');
if (savedLanguage && Object.keys(languageConfig).includes(savedLanguage)) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;
export { languageConfig };
