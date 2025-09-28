import React, { useState } from 'react'
import { AccessibleButton } from './AccessibilityToolbar'
import { useAccessibility } from '../hooks/useAccessibility'

interface ColorContrastResult {
  ratio: number
  level: 'AA' | 'AAA' | 'FAIL'
  score: number
  name?: string
}

export const AccessibilityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    focusElements: number
    ariaLabels: number
    colorContrast: ColorContrastResult[]
    keyboardNavigation: boolean
    screenReaderSupport: number
  }>({
    focusElements: 0,
    ariaLabels: 0,
    colorContrast: [],
    keyboardNavigation: false,
    screenReaderSupport: 0
  })

  const { announce } = useAccessibility()

  // Color contrast checker
  const checkColorContrast = (foreground: string, background: string): ColorContrastResult => {
    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g)
      if (!rgb) return 0

      const [r, g, b] = rgb.map(x => {
        const c = parseInt(x) / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    let level: 'AA' | 'AAA' | 'FAIL' = 'FAIL'
    let score = 0

    if (ratio >= 7) {
      level = 'AAA'
      score = 100
    } else if (ratio >= 4.5) {
      level = 'AA'
      score = 75
    } else if (ratio >= 3) {
      score = 50
    } else {
      score = 25
    }

    return { ratio: Math.round(ratio * 100) / 100, level, score }
  }

  // Run accessibility tests
  const runAccessibilityTest = () => {
    announce('Accessibility test started', 'assertive')

    // Test 1: Check focusable elements
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    // Test 2: Check ARIA labels
    const elementsWithAriaLabels = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]')
    
    // Test 3: Check color contrast (sample colors)
    const contrastTests = [
      { fg: 'rgb(0, 0, 0)', bg: 'rgb(255, 255, 255)', name: 'Black on White' },
      { fg: 'rgb(59, 130, 246)', bg: 'rgb(255, 255, 255)', name: 'Blue on White' },
      { fg: 'rgb(107, 114, 128)', bg: 'rgb(255, 255, 255)', name: 'Gray on White' },
      { fg: 'rgb(239, 68, 68)', bg: 'rgb(255, 255, 255)', name: 'Red on White' },
    ]

    const colorResults = contrastTests.map(test => ({
      ...checkColorContrast(test.fg, test.bg),
      name: test.name
    }))

    // Test 4: Check keyboard navigation
    const hasKeyboardSupport = document.querySelector('[tabindex], button, a, input') !== null

    // Test 5: Check screen reader support
    const screenReaderElements = document.querySelectorAll(
      '[role], [aria-live], [aria-hidden], .sr-only'
    )

    setTestResults({
      focusElements: focusableElements.length,
      ariaLabels: elementsWithAriaLabels.length,
      colorContrast: colorResults,
      keyboardNavigation: hasKeyboardSupport,
      screenReaderSupport: screenReaderElements.length
    })

    announce('Accessibility test completed', 'assertive')
  }

  // Calculate overall score
  const calculateOverallScore = (): number => {
    const focusScore = Math.min(testResults.focusElements * 5, 25) // Max 25 points
    const ariaScore = Math.min(testResults.ariaLabels * 3, 25) // Max 25 points
    const contrastScore = testResults.colorContrast.length > 0 
      ? testResults.colorContrast.reduce((acc, test) => acc + test.score, 0) / testResults.colorContrast.length * 0.25
      : 0 // Max 25 points
    const keyboardScore = testResults.keyboardNavigation ? 15 : 0 // Max 15 points
    const screenReaderScore = Math.min(testResults.screenReaderSupport * 2, 10) // Max 10 points

    return Math.round(focusScore + ariaScore + contrastScore + keyboardScore + screenReaderScore)
  }

  const overallScore = calculateOverallScore()

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Erişilebilirlik Test Merkezi
        </h2>
        <p className="text-gray-600">
          Sitenizin erişilebilirlik standartlarına uygunluğunu test edin
        </p>
      </div>

      {/* Test Button */}
      <div className="mb-8">
        <AccessibleButton
          onClick={runAccessibilityTest}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          🔍 Erişilebilirlik Testi Çalıştır
        </AccessibleButton>
      </div>

      {/* Overall Score */}
      {overallScore > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Genel Skor</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  overallScore >= 80 ? 'bg-green-500' : 
                  overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(overallScore, 100)}%` }}
                role="progressbar"
                aria-valuenow={overallScore}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Erişilebilirlik skoru: ${overallScore} / 100`}
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {overallScore}/100
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {overallScore >= 80 && '🎉 Mükemmel! Siteniz erişilebilirlik standartlarına uygun.'}
            {overallScore >= 60 && overallScore < 80 && '👍 İyi! Birkaç iyileştirme ile mükemmel olabilir.'}
            {overallScore < 60 && '⚠️ Dikkat! Erişilebilirlik iyileştirmeleri gerekli.'}
          </p>
        </div>
      )}

      {/* Test Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Focus Elements */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span role="img" aria-label="odak">🎯</span>
            Odaklanabilir Öğeler
          </h3>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {testResults.focusElements}
          </div>
          <p className="text-sm text-gray-600">
            Klavye ile erişilebilen öğe sayısı
          </p>
        </div>

        {/* ARIA Labels */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span role="img" aria-label="etiket">🏷️</span>
            ARIA Etiketleri
          </h3>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {testResults.ariaLabels}
          </div>
          <p className="text-sm text-gray-600">
            Ekran okuyucu etiketli öğe sayısı
          </p>
        </div>

        {/* Keyboard Navigation */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span role="img" aria-label="klavye">⌨️</span>
            Klavye Navigasyonu
          </h3>
          <div className={`text-2xl font-bold mb-1 ${testResults.keyboardNavigation ? 'text-green-600' : 'text-red-600'}`}>
            {testResults.keyboardNavigation ? '✅' : '❌'}
          </div>
          <p className="text-sm text-gray-600">
            Klavye ile gezinme desteği
          </p>
        </div>

        {/* Screen Reader Support */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span role="img" aria-label="ekran okuyucu">🔊</span>
            Ekran Okuyucu Desteği
          </h3>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {testResults.screenReaderSupport}
          </div>
          <p className="text-sm text-gray-600">
            Ekran okuyucu destekli öğe sayısı
          </p>
        </div>
      </div>

      {/* Color Contrast Results */}
      {testResults.colorContrast.length > 0 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span role="img" aria-label="renk">🎨</span>
            Renk Kontrastı Test Sonuçları
          </h3>
          <div className="space-y-3">
            {testResults.colorContrast.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{test.name}</span>
                  <div className="text-sm text-gray-600">
                    Oran: {test.ratio}:1
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    test.level === 'AAA' ? 'bg-green-100 text-green-800' :
                    test.level === 'AA' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.level}
                  </span>
                  <span className="text-sm font-medium">
                    {test.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p>• AAA: En yüksek erişilebilirlik standardı (7:1 ve üzeri)</p>
            <p>• AA: Standart erişilebilirlik gereksinimi (4.5:1 ve üzeri)</p>
            <p>• FAIL: Erişilebilirlik standartlarını karşılamıyor</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {overallScore > 0 && overallScore < 80 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 İyileştirme Önerileri
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {testResults.focusElements < 5 && (
              <li>• Daha fazla öğeyi klavye ile erişilebilir hale getirin</li>
            )}
            {testResults.ariaLabels < 10 && (
              <li>• Öğelere ARIA etiketleri ekleyin</li>
            )}
            {!testResults.keyboardNavigation && (
              <li>• Klavye navigasyon desteği ekleyin</li>
            )}
            {testResults.screenReaderSupport < 5 && (
              <li>• Ekran okuyucu desteğini artırın</li>
            )}
            {testResults.colorContrast.some(test => test.level === 'FAIL') && (
              <li>• Renk kontrastını iyileştirin</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
