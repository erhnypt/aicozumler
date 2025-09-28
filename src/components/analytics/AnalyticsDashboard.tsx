import { useState, useEffect } from 'react'
import { useAnalytics, type UsageStats, type PerformanceMetrics } from '../../hooks/useAnalytics'

interface AnalyticsDashboardProps {
  tenantId?: string
  compact?: boolean
}

export function AnalyticsDashboard({ tenantId, compact = false }: AnalyticsDashboardProps) {
  const { getUsageStats, getPerformanceMetrics, exportData, loading } = useAnalytics(tenantId)
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [timeRange])

  const loadData = async () => {
    const [usageData, perfData] = await Promise.all([
      getUsageStats(timeRange),
      getPerformanceMetrics()
    ])
    
    setStats(usageData)
    setPerformance(perfData)
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      const result = await exportData(format, 'all')
      if (result.success && result.data) {
        // Create download link
        const blob = new Blob([result.data], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        alert(`Export failed: ${result.error}`)
      }
    } catch (error) {
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (compact) {
    return <CompactAnalytics stats={stats} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Son 24 Saat</option>
            <option value="week">Son Hafta</option>
            <option value="month">Son Ay</option>
            <option value="year">Son Yıl</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam Öğe"
            value={stats.totalItems}
            icon="📊"
            color="blue"
          />
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Depolama"
            value={`${stats.storageUsed}MB`}
            icon="💾"
            color="purple"
          />
          <StatCard
            title="Son Aktivite"
            value={stats.recentActivity}
            icon="⚡"
            color="orange"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        {stats?.dailyActivity && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Aktivite</h3>
            <div className="h-64">
              <SimpleChart data={stats.dailyActivity} />
            </div>
          </div>
        )}

        {/* Top Categories */}
        {stats?.topCategories && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Kategoriler</h3>
            <div className="space-y-3">
              {stats.topCategories.map((category, idx) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {idx + 1}
                    </span>
                    <span className="text-gray-900 font-medium">{category.category}</span>
                  </div>
                  <span className="text-gray-600">{category.count} öğe</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {performance && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Metrikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Sayfa Yüklenme"
              value={`${performance.pageLoadTime}ms`}
              status={performance.pageLoadTime < 3000 ? 'good' : 'warning'}
            />
            <MetricCard
              title="API Yanıt Süresi"
              value={`${performance.apiResponseTime}ms`}
              status={performance.apiResponseTime < 200 ? 'good' : 'warning'}
            />
            <MetricCard
              title="Hata Oranı"
              value={`${performance.errorRate}%`}
              status={performance.errorRate < 1 ? 'good' : 'error'}
            />
            <MetricCard
              title="Çalışma Süresi"
              value={`${performance.uptime}%`}
              status={performance.uptime > 99 ? 'good' : 'warning'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function CompactAnalytics({ stats }: { stats: UsageStats | null }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-gray-600">Analytics yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-3">Özet İstatistikler</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Toplam Öğe:</span>
          <span className="ml-2 font-medium">{stats.totalItems}</span>
        </div>
        <div>
          <span className="text-gray-600">Son Aktivite:</span>
          <span className="ml-2 font-medium">{stats.recentActivity}</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mr-4`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  status 
}: { 
  title: string
  value: string
  status: 'good' | 'warning' | 'error'
}) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  const statusIcons = {
    good: '✅',
    warning: '⚠️',
    error: '❌'
  }

  return (
    <div className="text-center">
      <div className="mb-2">
        <span className="text-2xl">{statusIcons[status]}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-lg font-bold ${statusColors[status]}`}>{value}</p>
    </div>
  )
}

function SimpleChart({ data }: { data: Array<{ date: string; count: number }> }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="h-full flex items-end justify-between space-x-1">
      {data.slice(-14).map((item) => (
        <div key={item.date} className="flex-1 flex flex-col items-center">
          <div
            className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all hover:bg-blue-600"
            style={{ height: `${(item.count / maxCount) * 100}%` }}
            title={`${item.date}: ${item.count} aktivite`}
          ></div>
          <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
            {new Date(item.date).getDate()}
          </span>
        </div>
      ))}
    </div>
  )
}
