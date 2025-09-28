import React from 'react'
import { env, isDevelopment } from '../lib/env'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; errorId?: string; onRetry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props
    
    // Log error details
    console.error('🚨 Error Boundary Caught:', {
      error,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      appVersion: env.APP_VERSION
    })

    // Store error info in state
    this.setState({ errorInfo })

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // In production, you would send this to an error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (!isDevelopment()) {
      this.reportError(error, errorInfo)
    }
  }

  private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // Example error reporting (replace with your preferred service)
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        appVersion: env.APP_VERSION,
        userId: null, // You can get this from auth context if needed
      }

      // In a real app, send to your error tracking service
      console.log('Error report would be sent:', errorReport)
      
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined
    })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props

      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorId={this.state.errorId}
            onRetry={this.handleRetry}
          />
        )
      }

      // Default error UI
      return <DefaultErrorFallback {...this.state} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps extends ErrorBoundaryState {
  onRetry: () => void
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorId,
  errorInfo,
  onRetry
}) => {
  const copyErrorDetails = () => {
    const errorDetails = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => alert('Hata detayları panoya kopyalandı'))
      .catch(() => console.error('Failed to copy error details'))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bir hata oluştu
        </h1>
        <p className="text-gray-600 mb-6">
          Üzgünüz, beklenmedik bir hata meydana geldi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>

        {/* Error ID */}
        {errorId && (
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-600">
              Hata ID: <span className="font-mono text-gray-800">{errorId}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Sayfayı Yenile
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Ana Sayfaya Git
          </button>
        </div>

        {/* Development Info */}
        {isDevelopment() && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Geliştirici Detayları (sadece development modunda görünür)
            </summary>
            <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-red-800 mb-1">Hata Mesajı:</h4>
                <p className="text-sm text-red-700 font-mono">{error.message}</p>
              </div>
              
              {error.stack && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">Stack Trace:</h4>
                  <pre className="text-xs text-red-700 overflow-auto max-h-32 bg-white p-2 rounded border">
                    {error.stack}
                  </pre>
                </div>
              )}

              <button
                onClick={copyErrorDetails}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Hata Detaylarını Kopyala
              </button>
            </div>
          </details>
        )}

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sorun devam ederse, lütfen{' '}
            <a
              href="/iletisim"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              destek ekibimizle iletişime geçin
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Manual error report:', { error, errorInfo })
    
    // In production, report to error tracking service
    if (!isDevelopment()) {
      // Report error logic here
    }
  }

  return { handleError }
}
