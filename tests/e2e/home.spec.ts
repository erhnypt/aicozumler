import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Çözümleri/)
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /İşinizi Büyütmek İçin/ })).toBeVisible()
  })

  test('should display navigation menu', async ({ page }) => {
    // Check navigation links
    await expect(page.getByRole('link', { name: 'Anasayfa' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Çözümler' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Fiyatlandırma' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Hakkımızda' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'İletişim' })).toBeVisible()
  })

  test('should display AI features section', async ({ page }) => {
    // Check features section
    await expect(page.getByText('AI İçerik Asistanı')).toBeVisible()
    await expect(page.getByText('Sosyal Medya Yöneticisi')).toBeVisible()
    await expect(page.getByText('Veri Analisti')).toBeVisible()
    await expect(page.getByText('Müşteri Hizmetleri Botu')).toBeVisible()
  })

  test('should navigate to solutions page', async ({ page }) => {
    await page.getByRole('link', { name: 'Çözümler' }).click()
    await expect(page).toHaveURL('/cozumler')
    await expect(page.getByRole('heading', { name: /AI Çözümlerimiz/ })).toBeVisible()
  })

  test('should navigate to pricing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Fiyatlandırma' }).click()
    await expect(page).toHaveURL('/fiyatlandirma')
    await expect(page.getByRole('heading', { name: /Fiyatlandırma/ })).toBeVisible()
  })

  test('should display CTA buttons', async ({ page }) => {
    // Check call-to-action buttons
    const ctaButtons = page.getByRole('button').or(page.getByRole('link')).filter({
      hasText: /Ücretsiz Başla|Demo İste|Hemen Dene/
    })
    
    await expect(ctaButtons.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile navigation (hamburger menu)
    const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
      page.locator('button').filter({ hasText: /Menu|☰/ })
    )
    
    // If mobile menu exists, test it
    if (await mobileMenu.count() > 0) {
      await mobileMenu.click()
      await expect(page.getByRole('link', { name: 'Çözümler' })).toBeVisible()
    }
    
    // Check that main content is still visible
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/AI Çözümleri/)
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /yapay zeka|AI|iş otomasyonu/)
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /AI Çözümleri/)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Filter out known development warnings
    const criticalErrors = errors.filter(error => 
      !error.includes('Download the React DevTools') &&
      !error.includes('Warning:') &&
      !error.includes('localhost')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})
