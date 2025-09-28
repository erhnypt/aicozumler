import React, { Suspense } from 'react'

interface LazyComponentWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Simple loading component
const DefaultLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600">Yükleniyor...</p>
    </div>
  </div>
)

export const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
      {children}
    </Suspense>
  )
}
