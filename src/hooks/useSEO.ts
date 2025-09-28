import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

// Sayfa bazlı SEO konfigürasyonları
const SEO_CONFIGS: Record<string, SEOData> = {
  '/': {
    title: 'AI Çözümleri - İşinizi Büyütmek İçin Yapay Zeka Araçları',
    description: 'KOBİ\'ler ve bireysel kullanıcılar için yapay zeka tabanlı iş otomasyonu araçları. Pazarlama, içerik üretimi, müşteri hizmetleri ve daha fazlası için tek platform. 30 gün ücretsiz deneme.',
    keywords: 'yapay zeka çözümleri, ai araçları, iş otomasyonu, saas, yapay zeka, pazarlama otomasyonu, içerik üretimi, müşteri hizmetleri, kobiler için ai',
    ogType: 'website',
    ogImage: 'https://aicozumleri.com/og-image.jpg'
  },
  '/cozumler': {
    title: 'AI Çözümlerimiz - Yapay Zeka Tabanlı İş Araçları',
    description: 'İşinizi dönüştüren yapay zeka çözümlerimizi keşfedin. İçerik asistanı, sosyal medya yöneticisi, veri analisti ve daha fazlası.',
    keywords: 'ai içerik asistanı, sosyal medya yöneticisi, veri analisti, müşteri hizmetleri botu, pazarlama otomasyonu',
    ogType: 'website'
  },
  '/fiyatlandirma': {
    title: 'Fiyatlandırma - AI Çözümleri Planları',
    description: 'İhtiyacınıza uygun AI çözümleri planını seçin. Free, Basic, Premium ve Enterprise planlarımızı inceleyin. 30 gün ücretsiz deneme.',
    keywords: 'ai fiyatlandırma, saas planları, ücretsiz ai araçları, enterprise ai çözümleri',
    ogType: 'website'
  },
  '/hakkimizda': {
    title: 'Hakkımızda - AI Çözümleri Ekibi',
    description: 'AI Çözümleri olarak KOBİ\'lerin dijital dönüşümünde yapay zeka ile öncü olmayı hedefliyoruz. Ekibimiz ve vizyonumuz hakkında bilgi alın.',
    keywords: 'ai çözümleri ekibi, yapay zeka startup, kobi dijital dönüşüm, ai teknoloji',
    ogType: 'website'
  },
  '/iletisim': {
    title: 'İletişim - AI Çözümleri Destek',
    description: 'AI Çözümleri ekibi ile iletişime geçin. Sorularınız için destek alın, demo talep edin veya özel çözümler için görüşelim.',
    keywords: 'ai çözümleri iletişim, yapay zeka destek, ai demo, müşteri hizmetleri',
    ogType: 'website'
  },
  '/blog': {
    title: 'Blog - AI ve Teknoloji Güncellemeleri',
    description: 'Yapay zeka, iş stratejileri ve teknoloji trendleri hakkında güncel içerikler. AI\'ın işinizi nasıl dönüştürebileceğini keşfedin.',
    keywords: 'ai blog, yapay zeka haberleri, iş stratejileri, teknoloji trendleri, ai rehberleri',
    ogType: 'website'
  }
}

// Sektör bazlı SEO konfigürasyonları
const SECTOR_SEO_CONFIGS: Record<string, Partial<SEOData>> = {
  dentist: {
    title: 'Diş Hekimleri için AI Çözümleri - Hasta Yönetimi ve Randevu Sistemi',
    description: 'Diş hekimleri için özel tasarlanmış yapay zeka çözümleri. Hasta kayıtları, randevu yönetimi, tedavi planlaması ve daha fazlası.',
    keywords: 'diş hekimi yazılımı, hasta yönetim sistemi, diş kliniği ai, randevu sistemi, dental yazılım',
    ogType: 'website'
  },
  beauty: {
    title: 'Güzellik Salonları için AI Çözümleri - Müşteri Yönetimi',
    description: 'Güzellik ve estetik salonları için yapay zeka destekli müşteri yönetimi, randevu sistemi ve hizmet optimizasyonu.',
    keywords: 'güzellik salonu yazılımı, estetik merkezi ai, müşteri yönetimi, randevu sistemi, salon yazılım',
    ogType: 'website'
  },
  restaurant: {
    title: 'Restoranlar için AI Çözümleri - Menü ve Sipariş Yönetimi',
    description: 'Restoran ve cafe işletmeleri için yapay zeka çözümleri. Menü yönetimi, sipariş takibi, rezervasyon sistemi.',
    keywords: 'restoran yazılımı, menü yönetim sistemi, sipariş takip, rezervasyon sistemi, cafe yazılım',
    ogType: 'website'
  },
  fitness: {
    title: 'Fitness Merkezleri için AI Çözümleri - Üye Yönetimi',
    description: 'Spor salonları ve fitness merkezleri için yapay zeka destekli üyelik yönetimi, antrenman planları ve ekipman takibi.',
    keywords: 'fitness merkezi yazılımı, spor salonu ai, üye yönetimi, antrenman planı, gym yazılım',
    ogType: 'website'
  },
  retail: {
    title: 'Perakende için AI Çözümleri - Envanter ve Satış Yönetimi',
    description: 'Perakende mağazaları için yapay zeka çözümleri. Envanter yönetimi, satış analizi, müşteri segmentasyonu.',
    keywords: 'perakende yazılımı, mağaza yönetim sistemi, envanter takip, satış analizi, retail ai',
    ogType: 'website'
  }
}

export function useSEO(customSEO?: SEOData) {
  const location = useLocation()

  useEffect(() => {
    // Mevcut path için SEO konfigürasyonunu al
    const currentPath = location.pathname
    let seoData: SEOData = {}

    // Ana sayfa SEO'su
    if (SEO_CONFIGS[currentPath]) {
      seoData = SEO_CONFIGS[currentPath]
    }
    // Sektör sayfaları için SEO
    else {
      const pathParts = currentPath.split('/').filter(Boolean)
      if (pathParts.length >= 1 && SECTOR_SEO_CONFIGS[pathParts[0]]) {
        const sectorSEO = SECTOR_SEO_CONFIGS[pathParts[0]]
        const tenantSlug = pathParts[1]
        
        seoData = {
          ...sectorSEO,
          title: tenantSlug 
            ? `${tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1)} - ${sectorSEO.title}`
            : sectorSEO.title,
          canonical: `https://aicozumleri.com${currentPath}`
        }
      }
    }

    // Custom SEO ile override et
    if (customSEO) {
      seoData = { ...seoData, ...customSEO }
    }

    // Meta tagları güncelle
    updateMetaTags(seoData)
  }, [location.pathname, customSEO])

  return { updateSEO: (newSEO: SEOData) => updateMetaTags(newSEO) }
}

function updateMetaTags(seoData: SEOData) {
  // Title
  if (seoData.title) {
    document.title = seoData.title
  }

  // Meta description
  updateMetaTag('description', seoData.description)

  // Meta keywords
  updateMetaTag('keywords', seoData.keywords)

  // Canonical URL
  updateLinkTag('canonical', seoData.canonical)

  // Robots
  const robotsContent = []
  if (seoData.noindex) robotsContent.push('noindex')
  if (seoData.nofollow) robotsContent.push('nofollow')
  if (robotsContent.length > 0) {
    updateMetaTag('robots', robotsContent.join(', '))
  }

  // Open Graph tags
  updateMetaProperty('og:title', seoData.ogTitle || seoData.title)
  updateMetaProperty('og:description', seoData.ogDescription || seoData.description)
  updateMetaProperty('og:image', seoData.ogImage)
  updateMetaProperty('og:type', seoData.ogType || 'website')
  updateMetaProperty('og:url', seoData.canonical || window.location.href)

  // Twitter Card tags
  updateMetaProperty('twitter:card', 'summary_large_image')
  updateMetaProperty('twitter:title', seoData.twitterTitle || seoData.title)
  updateMetaProperty('twitter:description', seoData.twitterDescription || seoData.description)
  updateMetaProperty('twitter:image', seoData.twitterImage || seoData.ogImage)
}

function updateMetaTag(name: string, content?: string) {
  if (!content) return

  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

function updateMetaProperty(property: string, content?: string) {
  if (!content) return

  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.content = content
}

function updateLinkTag(rel: string, href?: string) {
  if (!href) return

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

// Sitemap oluşturmak için utility function
export function generateSitemap() {
  const baseUrl = 'https://aicozumleri.com'
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/cozumler', priority: 0.8, changefreq: 'weekly' },
    { url: '/fiyatlandirma', priority: 0.8, changefreq: 'weekly' },
    { url: '/hakkimizda', priority: 0.6, changefreq: 'monthly' },
    { url: '/iletisim', priority: 0.6, changefreq: 'monthly' },
    { url: '/blog', priority: 0.7, changefreq: 'daily' }
  ]

  const sectorPages = Object.keys(SECTOR_SEO_CONFIGS).map(sector => ({
    url: `/${sector}`,
    priority: 0.7,
    changefreq: 'weekly'
  }))

  const allPages = [...staticPages, ...sectorPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`

  return sitemap
}
