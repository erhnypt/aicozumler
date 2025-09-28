interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  version: string
  environment: string
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn'
      message?: string
      duration?: number
    }
  }
  uptime: number
}

class HealthChecker {
  private startTime: number
  private version: string
  private environment: string

  constructor() {
    this.startTime = Date.now()
    this.version = import.meta.env.VITE_APP_VERSION || '1.0.0'
    this.environment = import.meta.env.NODE_ENV || 'development'
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheckResult['checks'] = {}
    
    // Basic connectivity check
    checks.connectivity = await this.checkConnectivity()
    
    // Local storage check
    checks.localStorage = await this.checkLocalStorage()
    
    // Performance check
    checks.performance = await this.checkPerformance()
    
    // Calculate overall status
    const overallStatus = this.calculateOverallStatus(checks)
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: this.version,
      environment: this.environment,
      checks,
      uptime: Date.now() - this.startTime
    }
  }

  private async checkConnectivity(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now()
    
    try {
      // Simple connectivity check
      await fetch(window.location.origin + '/health', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      return {
        status: 'pass',
        message: 'Connectivity check passed',
        duration: performance.now() - start
      }
    } catch (error) {
      return {
        status: 'fail',
        message: `Connectivity check failed: ${error}`,
        duration: performance.now() - start
      }
    }
  }

  private async checkLocalStorage(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now()
    
    try {
      const testKey = 'health-check-test'
      const testValue = 'test-value'
      
      localStorage.setItem(testKey, testValue)
      const retrievedValue = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      if (retrievedValue === testValue) {
        return {
          status: 'pass',
          message: 'Local storage is functional',
          duration: performance.now() - start
        }
      } else {
        return {
          status: 'fail',
          message: 'Local storage read/write mismatch',
          duration: performance.now() - start
        }
      }
    } catch (error) {
      return {
        status: 'fail',
        message: `Local storage check failed: ${error}`,
        duration: performance.now() - start
      }
    }
  }

  private async checkPerformance(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now()
    
    try {
      if (!performance || !performance.now) {
        return {
          status: 'warn',
          message: 'Performance API not available',
          duration: performance.now() - start
        }
      }
      
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        
        return {
          status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warn' : 'fail',
          message: `Page load time: ${loadTime}ms`,
          duration: performance.now() - start
        }
      }
      
      return {
        status: 'warn',
        message: 'Navigation timing not available',
        duration: performance.now() - start
      }
    } catch (error) {
      return {
        status: 'fail',
        message: `Performance check failed: ${error}`,
        duration: performance.now() - start
      }
    }
  }

  private calculateOverallStatus(checks: HealthCheckResult['checks']): 'healthy' | 'unhealthy' | 'degraded' {
    const statuses = Object.values(checks).map(check => check.status)
    
    if (statuses.every(status => status === 'pass')) {
      return 'healthy'
    }
    
    if (statuses.some(status => status === 'fail')) {
      return 'unhealthy'
    }
    
    return 'degraded'
  }

  async getSimpleHealth(): Promise<{ status: string; timestamp: string }> {
    const result = await this.performHealthCheck()
    return {
      status: result.status === 'healthy' ? 'OK' : 'ERROR',
      timestamp: result.timestamp
    }
  }
}

export const healthChecker = new HealthChecker()