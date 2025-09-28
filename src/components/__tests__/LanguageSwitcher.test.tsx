import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from '../LanguageSwitcher'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'tr',
      changeLanguage: vi.fn(),
    },
  }),
}))

describe('LanguageSwitcher', () => {
  it('should render with default props', () => {
    render(<LanguageSwitcher />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('🇹🇷')).toBeInTheDocument()
  })

  it('should render compact variant', () => {
    render(<LanguageSwitcher variant="compact" />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('TR')).toBeInTheDocument()
  })

  it('should render inline variant', () => {
    render(<LanguageSwitcher variant="inline" />)
    
    expect(screen.getByText('Türkçe')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('العربية')).toBeInTheDocument()
  })

  it('should open dropdown when clicked', () => {
    render(<LanguageSwitcher variant="dropdown" />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('should show all language options in dropdown', () => {
    render(<LanguageSwitcher variant="dropdown" />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Türkçe')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('العربية')).toBeInTheDocument()
  })

  it('should handle language change', () => {
    const { i18n } = require('react-i18next').useTranslation()
    
    render(<LanguageSwitcher variant="inline" />)
    
    const englishButton = screen.getByText('English')
    fireEvent.click(englishButton)
    
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })
})
