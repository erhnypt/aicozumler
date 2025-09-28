import React, { useState } from 'react'
import { useAccessibility } from '../hooks/useAccessibility'

interface AccessibilityToolbarProps {
  className?: string
  position?: 'top' | 'bottom' | 'floating'
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  className = '',
  position = 'floating'
}) => {
  const {
    state,
    setFontSize,
    toggleHighContrast,
    announce
  } = useAccessibility()
  
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-50',
    bottom: 'fixed bottom-0 left-0 right-0 z-50',
    floating: 'fixed top-4 right-4 z-50'
  }

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size)
    announce(`Font size changed to ${size}`)
  }

  const handleHighContrastToggle = () => {
    toggleHighContrast()
  }

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label="Toggle accessibility toolbar"
        aria-expanded={isOpen}
        aria-controls="accessibility-toolbar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Toolbar Panel */}
      {isOpen && (
        <div
          id="accessibility-toolbar"
          className="absolute top-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80"
          role="region"
          aria-label="Accessibility settings"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Erişilebilirlik Ayarları
          </h3>

          {/* Font Size Controls */}
          <div className="mb-6">
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-3">
                Font Boyutu
              </legend>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      state.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={state.fontSize === size}
                  >
                    {size === 'small' && 'Küçük'}
                    {size === 'medium' && 'Normal'}
                    {size === 'large' && 'Büyük'}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* High Contrast Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                Yüksek Kontrast
              </label>
              <button
                id="high-contrast"
                onClick={handleHighContrastToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  state.isHighContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={state.isHighContrast}
                aria-describedby="high-contrast-description"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    state.isHighContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p id="high-contrast-description" className="text-xs text-gray-500 mt-1">
              Metin ve arka plan arasındaki kontrastı artırır
            </p>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Klavye Kısayolları
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Alt + S</kbd>
                {' '}İçeriğe atla
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd>
                {' '}Sonraki öğe
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Shift + Tab</kbd>
                {' '}Önceki öğe
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter/Space</kbd>
                {' '}Etkinleştir
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>
                {' '}Kapat/İptal
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Skip Link Component
export const SkipLink: React.FC = () => {
  const { skipToContent } = useAccessibility()

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault()
        skipToContent()
      }}
    >
      Ana içeriğe atla
    </a>
  )
}

// Live Region for Screen Reader Announcements
export const LiveRegion: React.FC = () => {
  const { announceRef } = useAccessibility()

  return (
    <div
      ref={announceRef}
      className="live-region"
      aria-live="polite"
      aria-atomic="true"
    />
  )
}

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn-accessible inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <>
          <span className="loading-spinner mr-2" aria-hidden="true" />
          <span className="sr-only">Yükleniyor...</span>
        </>
      )}
      {children}
    </button>
  )
}

// Accessible Form Field Component
interface AccessibleFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  help?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  help,
  value,
  onChange,
  className = ''
}) => {
  const errorId = error ? `${id}-error` : undefined
  const helpId = help ? `${id}-help` : undefined
  const describedBy = [errorId, helpId].filter(Boolean).join(' ')

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="zorunlu">*</span>}
      </label>
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="form-input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
      />
      
      {help && (
        <p id={helpId} className="form-help">
          {help}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
