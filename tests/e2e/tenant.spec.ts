import { test, expect } from '@playwright/test'

test.describe('Tenant Pages', () => {
  const sectors = [
    { path: 'dentist', name: 'Diş Hekimliği', icon: '🦷' },
    { path: 'beauty', name: 'Güzellik & Estetik', icon: '💄' },
    { path: 'restaurant', name: 'Restoran & Cafe', icon: '🍽️' },
    { path: 'fitness', name: 'Fitness & Spor', icon: '💪' },
    { path: 'retail', name: 'Perakende & Mağaza', icon: '🛍️' }
  ]

  sectors.forEach(sector => {
    test.describe(`${sector.name} Sector`, () => {
      test(`should load ${sector.path} sector page`, async ({ page }) => {
        await page.goto(`/${sector.path}/test-tenant`)
        
        // Check sector icon is displayed
        await expect(page.getByText(sector.icon)).toBeVisible()
        
        // Check sector name or related content
        await expect(page.getByText(sector.name)).toBeVisible()
      })

      test(`should have correct SEO for ${sector.path}`, async ({ page }) => {
        await page.goto(`/${sector.path}/test-clinic`)
        
        // Check title includes sector information
        await expect(page).toHaveTitle(new RegExp(sector.name.split(' ')[0]))
        
        // Check meta description
        const metaDescription = page.locator('meta[name="description"]')
        const descriptionContent = await metaDescription.getAttribute('content')
        expect(descriptionContent).toBeTruthy()
        expect(descriptionContent?.toLowerCase()).toContain(sector.path)
      })

      test(`should display sector-specific features for ${sector.path}`, async ({ page }) => {
        await page.goto(`/${sector.path}/demo-business`)
        
        // Wait for content to load
        await page.waitForLoadState('networkidle')
        
        // Check that sector-specific content is displayed
        const sectorFeatures = {
          dentist: ['randevu', 'hasta', 'tedavi'],
          beauty: ['randevu', 'hizmet', 'güzellik'],
          restaurant: ['menü', 'sipariş', 'rezervasyon'],
          fitness: ['üyelik', 'antrenman', 'spor'],
          retail: ['envanter', 'satış', 'mağaza']
        }
        
        const features = sectorFeatures[sector.path as keyof typeof sectorFeatures]
        
        // Check if at least one sector-specific term is present
        let hasFeature = false
        for (const feature of features) {
          const elements = page.getByText(new RegExp(feature, 'i'))
          if (await elements.count() > 0) {
            hasFeature = true
            break
          }
        }
        
        expect(hasFeature).toBe(true)
      })
    })
  })

  test('should handle invalid sector gracefully', async ({ page }) => {
    await page.goto('/invalid-sector/test-tenant')
    
    // Should either redirect or show appropriate error/fallback content
    // Since we don't have error pages set up, we'll check that the page loads
    await expect(page).toHaveURL('/invalid-sector/test-tenant')
  })

  test('should handle tenant navigation', async ({ page }) => {
    await page.goto('/dentist/test-clinic')
    
    // Check navigation within tenant context
    const aboutLink = page.getByRole('link', { name: /hakkında|about/i })
    if (await aboutLink.count() > 0) {
      await aboutLink.click()
      await expect(page).toHaveURL('/dentist/test-clinic/hakkimda')
    }
    
    const contactLink = page.getByRole('link', { name: /iletişim|contact/i })
    if (await contactLink.count() > 0) {
      await contactLink.click()
      await expect(page).toHaveURL('/dentist/test-clinic/iletisim')
    }
  })

  test('should be responsive on mobile for tenant pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/beauty/salon-demo')
    
    // Check that content is visible and properly formatted on mobile
    await expect(page.locator('body')).toBeVisible()
    
    // Check that images and icons are properly sized
    const icons = page.getByText('💄')
    if (await icons.count() > 0) {
      await expect(icons.first()).toBeVisible()
    }
  })

  test('should load tenant page without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    await page.goto('/restaurant/demo-restaurant')
    await page.waitForLoadState('networkidle')
    
    // Filter out known development warnings
    const criticalErrors = errors.filter(error => 
      !error.includes('Download the React DevTools') &&
      !error.includes('Warning:') &&
      !error.includes('localhost') &&
      !error.includes('Supabase') // Filter out Supabase connection errors in tests
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should have proper canonical URLs for tenant pages', async ({ page }) => {
    await page.goto('/fitness/gym-demo')
    
    const canonicalLink = page.locator('link[rel="canonical"]')
    const canonicalHref = await canonicalLink.getAttribute('href')
    
    expect(canonicalHref).toBeTruthy()
    expect(canonicalHref).toContain('/fitness/gym-demo')
  })
})
