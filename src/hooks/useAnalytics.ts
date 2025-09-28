import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export interface AnalyticsEvent {
  action: string
  resource_type?: string
  resource_id?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
}

export interface UsageStats {
  totalItems: number
  totalUsers: number
  storageUsed: number
  recentActivity: number
  topCategories: Array<{ category: string; count: number }>
  dailyActivity: Array<{ date: string; count: number }>
  monthlyGrowth: number
}

export interface PerformanceMetrics {
  pageLoadTime: number
  apiResponseTime: number
  errorRate: number
  uptime: number
}

export function useAnalytics(tenantId?: string) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track user action
  const trackEvent = useCallback(async (event: AnalyticsEvent): Promise<void> => {
    if (!user) return

    try {
      // Get client info
      const clientInfo = {
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      }

      // Insert usage log
      await supabase
        .from('usage_logs')
        .insert([{
          user_id: user.id,
          tenant_id: tenantId || null,
          action: event.action,
          resource_type: event.resource_type || null,
          resource_id: event.resource_id || null,
          metadata: {
            ...event.metadata,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            referrer: document.referrer
          },
          ...clientInfo
        }])

    } catch (error) {
      console.error('Failed to track event:', error)
      // Don't throw error to avoid disrupting user experience
    }
  }, [user, tenantId])

  // Get usage statistics
  const getUsageStats = useCallback(async (
    timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<UsageStats | null> => {
    if (!user) return null

    setLoading(true)
    setError(null)

    try {
      const startDate = getStartDate(timeRange)
      
      // Total items
      const { count: totalItems } = await supabase
        .from('encrypted_data')
        .select('*', { count: 'exact', head: true })
        .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || user.id)

      // Total users (for tenant)
      let totalUsers = 1
      if (tenantId) {
        const { count: userCount } = await supabase
          .from('tenant_members')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
        totalUsers = userCount || 1
      }

      // Storage used (placeholder - would need actual file size calculation)
      const storageUsed = 0

      // Recent activity
      const { count: recentActivity } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || user.id)
        .gte('created_at', startDate.toISOString())

      // Top categories
      const { data: categoryData } = await supabase
        .from('encrypted_data')
        .select('category')
        .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || user.id)
        .not('category', 'is', null)

      const topCategories = categoryData
        ?.reduce((acc, item) => {
          const category = item.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)

      const topCategoriesArray = Object.entries(topCategories || {})
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Daily activity (last 30 days)
      const dailyActivity = await getDailyActivity(tenantId, user.id)

      // Monthly growth (placeholder)
      const monthlyGrowth = 0

      const stats: UsageStats = {
        totalItems: totalItems || 0,
        totalUsers,
        storageUsed,
        recentActivity: recentActivity || 0,
        topCategories: topCategoriesArray,
        dailyActivity,
        monthlyGrowth
      }

      return stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error getting usage stats:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, tenantId])

  // Get performance metrics
  const getPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics | null> => {
    try {
      // Get performance data from browser
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const pageLoadTime = navigation?.loadEventEnd - navigation?.fetchStart || 0

      // Mock API response time (in real app, track this server-side)
      const apiResponseTime = 150

      // Mock error rate (in real app, calculate from logs)
      const errorRate = 0.5

      // Mock uptime (in real app, get from monitoring service)
      const uptime = 99.9

      return {
        pageLoadTime: Math.round(pageLoadTime),
        apiResponseTime,
        errorRate,
        uptime
      }
    } catch (error) {
      console.error('Error getting performance metrics:', error)
      return null
    }
  }, [])

  // Export data
  const exportData = useCallback(async (
    format: 'csv' | 'json',
    dataType: 'usage_logs' | 'encrypted_data' | 'all'
  ): Promise<{ success: boolean; data?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      setLoading(true)

      let data: any[] = []

      if (dataType === 'usage_logs' || dataType === 'all') {
        const { data: logs } = await supabase
          .from('usage_logs')
          .select('*')
          .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || user.id)
          .order('created_at', { ascending: false })

        data = [...data, ...(logs || [])]
      }

      if (dataType === 'encrypted_data' || dataType === 'all') {
        const { data: items } = await supabase
          .from('encrypted_data')
          .select('id, data_type, title, category, is_favorite, created_at, updated_at')
          .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || user.id)
          .order('created_at', { ascending: false })

        data = [...data, ...(items || [])]
      }

      let exportContent: string

      if (format === 'csv') {
        exportContent = convertToCSV(data)
      } else {
        exportContent = JSON.stringify(data, null, 2)
      }

      return { success: true, data: exportContent }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user, tenantId])

  return {
    loading,
    error,
    trackEvent,
    getUsageStats,
    getPerformanceMetrics,
    exportData
  }
}

// Helper functions
async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return null
  }
}

function getStartDate(timeRange: 'day' | 'week' | 'month' | 'year'): Date {
  const now = new Date()
  switch (timeRange) {
    case 'day':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

async function getDailyActivity(tenantId: string | undefined, userId: string): Promise<Array<{ date: string; count: number }>> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const { data } = await supabase
      .from('usage_logs')
      .select('created_at')
      .eq(tenantId ? 'tenant_id' : 'user_id', tenantId || userId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Group by date
    const activityByDate: Record<string, number> = {}
    
    data?.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0]
      activityByDate[date] = (activityByDate[date] || 0) + 1
    })

    // Fill missing dates with 0
    const result: Array<{ date: string; count: number }> = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        count: activityByDate[dateStr] || 0
      })
    }

    return result
  } catch (error) {
    console.error('Error getting daily activity:', error)
    return []
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value || ''
    }).join(',')
  )

  return [csvHeaders, ...csvRows].join('\n')
}

// Hook for tracking specific events
export function useEventTracking(tenantId?: string) {
  const { trackEvent } = useAnalytics(tenantId)

  const trackLogin = () => trackEvent({ action: 'login' })
  const trackLogout = () => trackEvent({ action: 'logout' })
  const trackItemCreate = (type: string) => trackEvent({ 
    action: 'create', 
    resource_type: 'encrypted_data',
    metadata: { data_type: type }
  })
  const trackItemView = (itemId: string, type: string) => trackEvent({ 
    action: 'view', 
    resource_type: 'encrypted_data',
    resource_id: itemId,
    metadata: { data_type: type }
  })
  const trackItemUpdate = (itemId: string, type: string) => trackEvent({ 
    action: 'update', 
    resource_type: 'encrypted_data',
    resource_id: itemId,
    metadata: { data_type: type }
  })
  const trackItemDelete = (itemId: string, type: string) => trackEvent({ 
    action: 'delete', 
    resource_type: 'encrypted_data',
    resource_id: itemId,
    metadata: { data_type: type }
  })

  return {
    trackLogin,
    trackLogout,
    trackItemCreate,
    trackItemView,
    trackItemUpdate,
    trackItemDelete,
    trackCustomEvent: trackEvent
  }
}
