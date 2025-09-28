# 🧪 Testing Guide - AI Çözümleri

Bu dokümanda AI Çözümleri projesinin test altyapısı ve kullanım kılavuzu bulunmaktadır.

## 📋 Test Altyapısı

### Kullanılan Teknolojiler

- **Vitest**: Modern, hızlı unit test framework
- **@testing-library/react**: React component testing
- **Playwright**: End-to-end testing
- **@vitest/coverage-v8**: Code coverage reporting
- **JSDOM**: DOM simulation for tests

## 🚀 Test Komutları

```bash
# Tüm unit testleri çalıştır
npm run test

# Testleri watch modda çalıştır
npm run test:ui

# Testleri bir kez çalıştır (CI için)
npm run test:run

# Coverage raporu oluştur
npm run test:coverage

# E2E testleri çalıştır
npm run test:e2e

# E2E testleri UI modda çalıştır
npm run test:e2e:ui

# E2E test raporu göster
npm run test:e2e:report

# Tüm testleri çalıştır
npm run test:all
```

## 📁 Test Dosya Yapısı

```
src/
├── __tests__/              # Global test utilities
├── lib/__tests__/           # Library function tests
├── utils/__tests__/         # Utility function tests
├── hooks/__tests__/         # Hook tests
├── components/__tests__/    # Component tests
└── test/
    ├── setup.ts            # Test setup configuration
    └── utils.tsx           # Test utilities and mocks

tests/
└── e2e/                    # End-to-end tests
    ├── home.spec.ts        # Home page E2E tests
    └── tenant.spec.ts      # Tenant pages E2E tests
```

## 🎯 Mevcut Test Coverage

### Unit Tests
- ✅ **Environment Configuration**: Çevre değişkenleri testleri
- ✅ **Utility Functions**: Helper fonksiyonları testleri
  - Currency formatting
  - Text slugification
  - Email validation
  - Text truncation

### E2E Tests
- ✅ **Home Page**: Ana sayfa navigasyon ve içerik testleri
- ✅ **Tenant Pages**: Sektör sayfaları ve tenant routing testleri
- ✅ **SEO**: Meta tags ve canonical URLs testleri
- ✅ **Responsive**: Mobile ve desktop görünüm testleri

## 📊 Coverage Raporu

Son test çalıştırması:
- **Test Files**: 2 passed
- **Tests**: 14 passed
- **Coverage**: Utility functions %100 covered

```bash
# Coverage HTML raporu görüntüle
open coverage/index.html
```

## 🛠️ Test Yazma Rehberi

### Unit Test Örneği

```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../utils/helpers'

describe('formatCurrency', () => {
  it('should format Turkish Lira correctly', () => {
    expect(formatCurrency(1000)).toBe('₺1.000,00')
  })
})
```

### Component Test Örneği

```typescript
import { render, screen } from '../test/utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

### E2E Test Örneği

```typescript
import { test, expect } from '@playwright/test'

test('should navigate to solutions page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Çözümler' }).click()
  await expect(page).toHaveURL('/cozumler')
})
```

## 🔧 Mock Sistemi

### Supabase Mock
```typescript
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      // ... other mocked methods
    }
  }
}))
```

### Environment Mock
```typescript
vi.mock('../lib/env', () => ({
  env: {
    SUPABASE_URL: 'https://test.supabase.co',
    ENCRYPTION_KEY: 'test-key',
  }
}))
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
- name: Run unit tests
  run: npm run test:run

- name: Generate coverage report
  run: npm run test:coverage

- name: Run E2E tests
  run: npm run test:e2e
```

### Coverage Thresholds
```javascript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## 🎯 Test Stratejisi

### Unit Tests
- **Utility Functions**: %100 coverage hedefi
- **Hooks**: Business logic testleri
- **Components**: User interaction testleri

### Integration Tests
- **API Calls**: Supabase integration
- **Authentication**: Auth flow testleri
- **Data Flow**: Component-to-service testleri

### E2E Tests
- **User Journeys**: Kritik kullanıcı akışları
- **Cross-browser**: Chrome, Firefox, Safari
- **Responsive**: Mobile ve desktop testleri

## 🔍 Test Best Practices

### 1. Test Naming
```typescript
// ✅ Good
it('should format Turkish Lira correctly', () => {})

// ❌ Bad  
it('test currency', () => {})
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 200 }]
  
  // Act
  const total = calculateTotal(items)
  
  // Assert
  expect(total).toBe(300)
})
```

### 3. Mock External Dependencies
```typescript
// Mock network calls, external services
vi.mock('axios')
vi.mock('../services/api')
```

## 📈 Gelecek Planları

### Kısa Vadeli
- [ ] Hook testleri genişletme
- [ ] Component testleri ekleme
- [ ] Integration testleri

### Orta Vadeli
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests

### Uzun Vadeli
- [ ] Load testing
- [ ] Security testing
- [ ] Cross-browser automation

## 🆘 Troubleshooting

### Test Fails
```bash
# Verbose output için
npm run test -- --reporter=verbose

# Specific test çalıştır
npm run test -- src/utils/__tests__/helpers.test.ts
```

### E2E Issues
```bash
# Browser install
npx playwright install

# Debug mode
npm run test:e2e -- --debug
```

### Coverage Issues
```bash
# Coverage threshold bypass
npm run test:coverage -- --coverage.enabled=false
```

---

**Test yazımında yardıma ihtiyacınız varsa development ekibiyle iletişime geçin! 🚀**
