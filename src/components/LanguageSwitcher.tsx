import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

const languages: Language[] = [
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    rtl: false
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true
  }
]

interface LanguageSwitcherProps {
  className?: string
  variant?: 'dropdown' | 'inline' | 'compact'
  showFlag?: boolean
  showNativeName?: boolean
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'dropdown',
  showFlag = true,
  showNativeName = true
}) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle language change
  const handleLanguageChange = async (languageCode: string) => {
    const selectedLanguage = languages.find(lang => lang.code === languageCode)
    
    try {
      await i18n.changeLanguage(languageCode)
      
      // Update document direction for RTL languages
      if (selectedLanguage?.rtl) {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = languageCode
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = languageCode
      }
      
      // Store preference in localStorage
      localStorage.setItem('preferred-language', languageCode)
      
      setIsOpen(false)
      
      // Announce language change for screen readers
      const announcement = `Language changed to ${selectedLanguage?.nativeName || languageCode}`
      const liveRegion = document.querySelector('[aria-live="polite"]')
      if (liveRegion) {
        liveRegion.textContent = announcement
        setTimeout(() => {
          liveRegion.textContent = ''
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          // Focus next language option
          const nextIndex = (languages.indexOf(currentLanguage) + 1) % languages.length
          const nextButton = dropdownRef.current?.querySelector(`[data-language="${languages[nextIndex].code}"]`) as HTMLButtonElement
          nextButton?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (isOpen) {
          // Focus previous language option
          const prevIndex = (languages.indexOf(currentLanguage) - 1 + languages.length) % languages.length
          const prevButton = dropdownRef.current?.querySelector(`[data-language="${languages[prevIndex].code}"]`) as HTMLButtonElement
          prevButton?.focus()
        }
        break
    }
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="radiogroup" aria-label="Select language">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentLanguage.code === language.code
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            role="radio"
            aria-checked={currentLanguage.code === language.code}
            aria-label={`Switch to ${language.nativeName}`}
          >
            {showFlag && <span className="mr-2">{language.flag}</span>}
            {showNativeName ? language.nativeName : language.code.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Current language: ${currentLanguage.nativeName}. Click to change language`}
        >
          {showFlag && <span>{currentLanguage.flag}</span>}
          <span className="uppercase">{currentLanguage.code}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div 
            className="absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
            role="listbox"
            aria-label="Language options"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                data-language={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center gap-3 ${
                  currentLanguage.code === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
                role="option"
                aria-selected={currentLanguage.code === language.code}
              >
                {showFlag && <span>{language.flag}</span>}
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {currentLanguage.code === language.code && (
                  <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${currentLanguage.nativeName}. Click to change language`}
      >
        {showFlag && <span className="text-lg">{currentLanguage.flag}</span>}
        <span>{showNativeName ? currentLanguage.nativeName : currentLanguage.name}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-50 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg"
          role="listbox"
          aria-label="Language options"
        >
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                data-language={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center gap-3 ${
                  currentLanguage.code === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
                role="option"
                aria-selected={currentLanguage.code === language.code}
              >
                {showFlag && <span className="text-xl">{language.flag}</span>}
                <div className="flex-1">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm text-gray-500">{language.name}</div>
                </div>
                {currentLanguage.code === language.code && (
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for language utilities
export const useLanguage = () => {
  const { i18n } = useTranslation()
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]
  
  const isRTL = currentLanguage.rtl || false
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(i18n.language).format(num)
  }
  
  const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(date)
  }
  
  const formatRelativeTime = (date: Date): string => {
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' })
    const diff = date.getTime() - Date.now()
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (Math.abs(diffInDays) < 1) {
      const diffInHours = Math.floor(diff / (1000 * 60 * 60))
      if (Math.abs(diffInHours) < 1) {
        const diffInMinutes = Math.floor(diff / (1000 * 60))
        return rtf.format(diffInMinutes, 'minute')
      }
      return rtf.format(diffInHours, 'hour')
    }
    
    return rtf.format(diffInDays, 'day')
  }
  
  return {
    currentLanguage,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    changeLanguage: i18n.changeLanguage,
    languages
  }
}
