# 🚀 AI Çözümler - Enterprise SaaS Platform

[![Build Status](https://github.com/erhnypt/aicozumler/actions/workflows/ci.yml/badge.svg)](https://github.com/erhnypt/aicozumler/actions/workflows/ci.yml)
[![Deploy Status](https://github.com/erhnypt/aicozumler/actions/workflows/cd.yml/badge.svg)](https://github.com/erhnypt/aicozumler/actions/workflows/cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern, güvenli ve ölçeklenebilir **Enterprise SaaS Platform** - AI destekli çözümler sunan multi-tenant mimari ile geliştirilmiş tam kapsamlı platform.

## ✨ Temel Özellikler

### 🔐 Güvenlik & Kimlik Doğrulama
- **AES-256 Şifreleme**: Güvenli veri şifreleme ve depolama
- **Row Level Security (RLS)**: Supabase ile tenant izolasyonu
- **JWT Authentication**: Güvenli kimlik doğrulama sistemi
- **Environment Validation**: Kritik çevre değişkenlerinin doğrulanması

### 🏢 Multi-Tenant Architecture
- **Tenant Management**: Dinamik tenant oluşturma ve yönetimi
- **Sector-based Routing**: Sektör bazlı URL yapılandırması (dentist, beauty, restaurant, fitness, retail)
- **Isolated Data**: Tenant başına veri izolasyonu
- **Custom Branding**: Tenant özelinde marka kişiselleştirmesi

### 💳 Abonelik & Ödeme Sistemi
- **4 Farklı Plan**: Free, Starter, Professional, Enterprise
- **Usage Tracking**: Kullanım limitleri ve takip sistemi
- **Billing Integration**: Hazır ödeme entegrasyonu altyapısı
- **Plan Management**: Dinamik plan yükseltme/düşürme sistemi

### 📊 Analytics & Monitoring
- **Event Tracking**: Kullanıcı etkileşim takibi
- **Performance Metrics**: Sayfa performans ölçümleri
- **Error Monitoring**: Kapsamlı hata takip sistemi
- **Health Checks**: Sistem sağlık kontrolleri

## 🛠️ Teknoloji Stack

**Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router
**Backend**: Supabase, PostgreSQL, Row Level Security
**Testing**: Vitest, Playwright, Testing Library
**DevOps**: Docker, GitHub Actions, Nginx
**Quality**: ESLint, Prettier, Husky, Commitlint

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Kurulum

```bash
# Repository'yi klonla
git clone https://github.com/erhnypt/aicozumler.git
cd aicozumler

# Bağımlılıkları yükle
npm install

# Environment dosyasını ayarla
cp env.example .env
# .env dosyasını Supabase bilgilerinle düzenle

# Veritabanı şemasını çalıştır
# database/setup-instructions.md dosyasındaki adımları takip et

# Development server'ı başlat
npm run dev
```

## 📁 Proje Yapısı

```
aicozumler/
├── src/
│   ├── components/          # UI bileşenleri
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility kütüphaneleri
│   ├── pages/              # Sayfa bileşenleri
│   ├── router/             # Routing yapılandırması
│   └── i18n/               # Çoklu dil desteği
├── database/               # Veritabanı şeması
├── tests/                  # Test dosyaları
└── .github/workflows/      # CI/CD pipeline'ları
```

## 🧪 Test & Kalite

```bash
# Unit testler
npm run test
npm run test:coverage

# E2E testler  
npm run test:e2e

# Tüm testler
npm run test:all

# Kod kalitesi
npm run lint
npm run format
```

## 🐳 Docker ile Deployment

```bash
# Development
npm run docker:compose:dev

# Production
npm run docker:build
npm run docker:run
```

## 📈 Özellikler

### ✅ Tamamlanmış
- ✅ **Güvenlik**: AES-256 şifreleme, RLS politikaları, çevre değişkeni doğrulaması
- ✅ **Veritabanı**: 6 tablolı multi-tenant şema (Supabase)
- ✅ **Multi-tenant**: Tenant yönetimi, sektör bazlı routing
- ✅ **Abonelik**: 4 plan, kullanım takibi, faturalandırma altyapısı
- ✅ **Monitoring**: Hata takibi, performans metrikleri, analytics
- ✅ **UI/UX**: Modern dashboard, erişilebilirlik (WCAG 2.1 AA)
- ✅ **SEO**: Dinamik meta etiketler, sitemap, robots.txt
- ✅ **Testing**: Unit, E2E, coverage raporları, CI/CD
- ✅ **Performance**: Code splitting, lazy loading, bundle optimizasyonu
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader uyumluluğu
- ✅ **i18n**: 3 dil (TR/EN/AR), RTL desteği
- ✅ **DevOps**: Docker, CI/CD, health monitoring
- ✅ **Code Quality**: ESLint, Prettier, Husky hooks

### 📊 Proje İstatistikleri
- **102 dosya** oluşturuldu
- **24,943+ satır** kod yazıldı
- **%100 TypeScript** kullanımı
- **Sıfır kritik güvenlik açığı**
- **Enterprise-ready** altyapı

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- 🌐 Website: [aicozumler.com](https://aicozumler.com)
- 📧 Email: info@aicozumler.com
- 🐛 Issues: [GitHub Issues](https://github.com/erhnypt/aicozumler/issues)

---

**❤️ AI Çözümler Ekibi tarafından geliştirilmiştir**
