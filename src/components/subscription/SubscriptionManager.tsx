import { useState } from 'react'
import { useSubscription, getPlanDetails, type SubscriptionPlan } from '../../hooks/useSubscription'

interface SubscriptionManagerProps {
  tenantId?: string
  compact?: boolean
}

export function SubscriptionManager({ tenantId, compact = false }: SubscriptionManagerProps) {
  const { subscription, loading, error, upgradePlan, cancelSubscription } = useSubscription(tenantId)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  const plans: SubscriptionPlan[] = ['free', 'basic', 'premium', 'enterprise']

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!subscription) return

    setUpgrading(true)
    try {
      const result = await upgradePlan(plan)
      if (result.success) {
        setSelectedPlan(null)
        // Show success message
        alert('Plan başarıyla güncellendi!')
      } else {
        alert(`Hata: ${result.error}`)
      }
    } catch (error) {
      alert('Beklenmeyen bir hata oluştu')
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const result = await cancelSubscription()
      if (result.success) {
        alert('Abonelik başarıyla iptal edildi')
      } else {
        alert(`Hata: ${result.error}`)
      }
    } catch (error) {
      alert('Beklenmeyen bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Hata: {error}</p>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Abonelik bilgisi bulunamadı</p>
      </div>
    )
  }

  if (compact) {
    return <CompactSubscriptionView subscription={subscription} onUpgrade={() => setSelectedPlan('premium')} />
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mevcut Planınız</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscription.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {subscription.status === 'active' ? 'Aktif' : 'Beklemede'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {getPlanDetails(subscription.plan)?.name} Plan
            </h4>
            <p className="text-gray-600 mb-4">
              {subscription.expiresAt 
                ? `${new Date(subscription.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerli`
                : 'Süresiz'
              }
            </p>
            
            {subscription.plan !== 'free' && (
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Aboneliği İptal Et
              </button>
            )}
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Kullanım Durumu</h5>
            <div className="space-y-3">
              <UsageBar
                label="Kullanıcılar"
                current={subscription.usage.currentUsers}
                max={subscription.usage.limits.maxUsers}
                percentage={subscription.usage.usagePercentage.users}
              />
              <UsageBar
                label="Öğeler"
                current={subscription.usage.currentItems}
                max={subscription.usage.limits.maxItems}
                percentage={subscription.usage.usagePercentage.items}
              />
              <UsageBar
                label="Depolama"
                current={subscription.usage.currentStorage}
                max={subscription.usage.limits.maxStorage}
                percentage={subscription.usage.usagePercentage.storage}
                unit="MB"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Upgrade Options */}
      {subscription.canUpgrade && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Yükseltme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(planId => {
              const plan = getPlanDetails(planId)
              if (!plan || planId === subscription.plan) return null

              const isHigherTier = plans.indexOf(planId) > plans.indexOf(subscription.plan)
              if (!isHigherTier) return null

              return (
                <div
                  key={planId}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === planId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedPlan(planId)}
                >
                  {plan.popular && (
                    <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block">
                      Popüler
                    </div>
                  )}
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">/ay</span>
                  </div>
                  
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {plan.limits.maxUsers} kullanıcı</li>
                    <li>• {plan.limits.maxItems} öğe</li>
                    <li>• {plan.limits.maxStorage}MB depolama</li>
                  </ul>
                </div>
              )
            })}
          </div>

          {selectedPlan && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleUpgrade(selectedPlan)}
                disabled={upgrading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {upgrading ? 'Yükseltiliyor...' : `${getPlanDetails(selectedPlan)?.name} Planına Yükselt`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CompactSubscriptionView({ 
  subscription, 
  onUpgrade 
}: { 
  subscription: any
  onUpgrade: () => void 
}) {
  const isNearLimit = subscription.usage.usagePercentage.items > 80 || 
                     subscription.usage.usagePercentage.storage > 80

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">
            {getPlanDetails(subscription.plan)?.name} Plan
          </h4>
          <p className="text-sm text-gray-600">
            {subscription.usage.currentItems}/{subscription.usage.limits.maxItems} öğe kullanıldı
          </p>
        </div>
        
        {isNearLimit && (
          <button
            onClick={onUpgrade}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Yükselt
          </button>
        )}
      </div>

      {isNearLimit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-yellow-800 text-sm">
            ⚠️ Limitinize yaklaşıyorsunuz. Plan yükseltmeyi düşünün.
          </p>
        </div>
      )}
    </div>
  )
}

function UsageBar({ 
  label, 
  current, 
  max, 
  percentage, 
  unit = '' 
}: {
  label: string
  current: number
  max: number
  percentage: number
  unit?: string
}) {
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">
          {current}/{max} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getColorClass(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {percentage.toFixed(1)}% kullanıldı
      </div>
    </div>
  )
}
