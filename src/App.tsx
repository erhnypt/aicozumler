import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AuthProvider } from './contexts/AuthContext'
import { TenantProvider } from './contexts/TenantContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AccessibilityToolbar, SkipLink, LiveRegion } from './components/AccessibilityToolbar'
import './styles/accessibility.css'
import './styles/rtl.css'
import './i18n/config'

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <SkipLink />
        <LiveRegion />
        <BrowserRouter basename={__BASE_PATH__}>
          <AuthProvider>
            <TenantProvider>
              <AppRoutes />
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
        <AccessibilityToolbar />
      </div>
    </ErrorBoundary>
  )
}

export default App