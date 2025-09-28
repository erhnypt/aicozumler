import React, { useEffect, useCallback, useState, useRef } from 'react'

interface AccessibilityOptions {
  enableFocusManagement?: boolean
  enableKeyboardNavigation?: boolean
  enableScreenReader?: boolean
  enableHighContrast?: boolean
  announceRouteChanges?: boolean
}

interface AccessibilityState {
  isHighContrast: boolean
  isReducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  focusVisible: boolean
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const {
    enableFocusManagement = true,
    enableKeyboardNavigation = true,
    enableScreenReader = true,
    enableHighContrast = true,
    announceRouteChanges = true,
  } = options

  const [state, setState] = useState<AccessibilityState>({
    isHighContrast: false,
    isReducedMotion: false,
    fontSize: 'medium',
    focusVisible: false,
  })

  const announceRef = useRef<HTMLDivElement | null>(null)
  const focusTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Detect user preferences
  useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updatePreferences = () => {
      setState(prev => ({
        ...prev,
        isHighContrast: highContrastQuery.matches,
        isReducedMotion: reducedMotionQuery.matches,
      }))
    }

    updatePreferences()

    highContrastQuery.addEventListener('change', updatePreferences)
    reducedMotionQuery.addEventListener('change', updatePreferences)

    return () => {
      highContrastQuery.removeEventListener('change', updatePreferences)
      reducedMotionQuery.removeEventListener('change', updatePreferences)
    }
  }, [])

  // Focus management
  const manageFocus = useCallback((element: HTMLElement | null, delay = 100) => {
    if (!enableFocusManagement || !element) return

    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current)
    }

    focusTimeoutRef.current = setTimeout(() => {
      element.focus({ preventScroll: false })
      setState(prev => ({ ...prev, focusVisible: true }))
    }, delay)
  }, [enableFocusManagement])

  // Skip link functionality
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('#main-content') || document.querySelector('main')
    if (mainContent) {
      manageFocus(mainContent as HTMLElement)
    }
  }, [manageFocus])

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enableScreenReader) return

    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message

      // Clear the message after a delay to allow re-announcing the same message
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = ''
        }
      }, 1000)
    }
  }, [enableScreenReader])

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent, actions: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
  }) => {
    if (!enableKeyboardNavigation) return

    switch (event.key) {
      case 'Enter':
        actions.onEnter?.()
        break
      case ' ':
      case 'Space':
        event.preventDefault()
        actions.onSpace?.()
        break
      case 'Escape':
        actions.onEscape?.()
        break
      case 'ArrowUp':
        event.preventDefault()
        actions.onArrowUp?.()
        break
      case 'ArrowDown':
        event.preventDefault()
        actions.onArrowDown?.()
        break
      case 'ArrowLeft':
        actions.onArrowLeft?.()
        break
      case 'ArrowRight':
        actions.onArrowRight?.()
        break
      case 'Tab':
        actions.onTab?.()
        break
    }
  }, [enableKeyboardNavigation])

  // Font size management
  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setState(prev => ({ ...prev, fontSize: size }))
    
    const root = document.documentElement
    switch (size) {
      case 'small':
        root.style.fontSize = '14px'
        break
      case 'medium':
        root.style.fontSize = '16px'
        break
      case 'large':
        root.style.fontSize = '18px'
        break
    }

    // Save preference
    localStorage.setItem('accessibility-font-size', size)
    announce(`Font size changed to ${size}`)
  }, [announce])

  // High contrast toggle
  const toggleHighContrast = useCallback(() => {
    const newValue = !state.isHighContrast
    setState(prev => ({ ...prev, isHighContrast: newValue }))
    
    if (enableHighContrast) {
      document.documentElement.classList.toggle('high-contrast', newValue)
      localStorage.setItem('accessibility-high-contrast', newValue.toString())
      announce(newValue ? 'High contrast enabled' : 'High contrast disabled')
    }
  }, [state.isHighContrast, enableHighContrast, announce])

  // Initialize from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-font-size') as 'small' | 'medium' | 'large'
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true'

    if (savedFontSize) {
      setFontSize(savedFontSize)
    }

    if (savedHighContrast && enableHighContrast) {
      setState(prev => ({ ...prev, isHighContrast: true }))
      document.documentElement.classList.add('high-contrast')
    }
  }, [setFontSize, enableHighContrast])

  // Route change announcements
  useEffect(() => {
    if (!announceRouteChanges) return

    const handleRouteChange = () => {
      const title = document.title
      announce(`Navigated to ${title}`)
    }

    // Listen for route changes (works with React Router)
    window.addEventListener('popstate', handleRouteChange)
    
    // Also listen for programmatic navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(this, args)
      setTimeout(handleRouteChange, 100)
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args)
      setTimeout(handleRouteChange, 100)
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [announceRouteChanges, announce])

  // Cleanup
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [])

  return {
    state,
    manageFocus,
    skipToContent,
    announce,
    handleKeyboardNavigation,
    setFontSize,
    toggleHighContrast,
    announceRef,
  }
}

// Screen reader only component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => 
  React.createElement('span', { className: 'sr-only' }, children)

// Focus trap component
export const FocusTrap: React.FC<{
  children: React.ReactNode
  isActive: boolean
  onEscape?: () => void
}> = ({ children, isActive, onEscape }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    firstFocusableRef.current = focusableElements[0] as HTMLElement || null
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement || null

    // Focus first element
    firstFocusableRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault()
            lastFocusableRef.current?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault()
            firstFocusableRef.current?.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onEscape])

  return React.createElement('div', {
    ref: containerRef,
    className: isActive ? 'focus-trap-active' : ''
  }, children)
}
