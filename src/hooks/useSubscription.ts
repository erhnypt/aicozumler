import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Tenant } from '../lib/supabase'
import { getSectorConfig } from './useTenant'

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise'

export interface SubscriptionLimits {
  maxUsers: number
  maxItems: number
  maxStorage: number
  features: string[]
}

export interface PlanDetails {
  id: SubscriptionPlan
  name: string
  price: number
  currency: string
  billing: 'monthly' | 'yearly'
  limits: SubscriptionLimits
  popular?: boolean
  features: string[]
}

export interface SubscriptionUsage {
  currentUsers: number
  currentItems: number
  currentStorage: number
  limits: SubscriptionLimits
  usagePercentage: {
    users: number
    items: number
    storage: number
  }
}

export interface SubscriptionInfo {
  plan: SubscriptionPlan
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  expiresAt: string | null
  usage: SubscriptionUsage
  canUpgrade: boolean
  canDowngrade: boolean
}

export function useSubscription(tenantId?: string) {
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current subscription info
  const loadSubscription = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let currentPlan: SubscriptionPlan = 'free'
      let currentStatus = 'active'
      let expiresAt: string | null = null
      let tenant: Tenant | null = null

      // If tenant ID is provided, get tenant subscription
      if (tenantId) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .single()

        if (tenantError) {
          throw new Error(`Tenant not found: ${tenantError.message}`)
        }

        tenant = tenantData as Tenant
        currentPlan = tenant.subscription_plan
        currentStatus = tenant.subscription_status
        expiresAt = tenant.subscription_expires_at
      } else {
        // Use user's personal subscription
        currentPlan = profile?.subscription_plan || 'free'
        currentStatus = profile?.subscription_status || 'active'
        expiresAt = profile?.subscription_expires_at || null
      }

      // Get usage data
      const usage = await getUsageData(tenantId)
      
      // Get plan limits
      const sectorConfig = tenant ? getSectorConfig(tenant.sector) : null
      const limits = sectorConfig?.subscriptionPlans[currentPlan] || {
        maxUsers: 1,
        maxItems: 10,
        maxStorage: 100
      }

      const subscriptionInfo: SubscriptionInfo = {
        plan: currentPlan,
        status: currentStatus as any,
        expiresAt,
        usage: {
          ...usage,
          limits: {
            ...limits,
            features: getPlanFeatures(currentPlan)
          },
          usagePercentage: {
            users: Math.round((usage.currentUsers / limits.maxUsers) * 100),
            items: Math.round((usage.currentItems / limits.maxItems) * 100),
            storage: Math.round((usage.currentStorage / limits.maxStorage) * 100)
          }
        },
        canUpgrade: currentPlan !== 'enterprise',
        canDowngrade: currentPlan !== 'free'
      }

      setSubscription(subscriptionInfo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading subscription:', err)
    } finally {
      setLoading(false)
    }
  }, [user, profile, tenantId])

  // Get usage data
  const getUsageData = async (tenantId?: string): Promise<{
    currentUsers: number
    currentItems: number
    currentStorage: number
  }> => {
    if (!user) {
      return { currentUsers: 0, currentItems: 0, currentStorage: 0 }
    }

    try {
      if (tenantId) {
        // Get tenant usage
        const { data: tenant } = await supabase
          .from('tenants')
          .select('current_users, current_encrypted_items, current_storage_mb')
          .eq('id', tenantId)
          .single()

        return {
          currentUsers: tenant?.current_users || 0,
          currentItems: tenant?.current_encrypted_items || 0,
          currentStorage: tenant?.current_storage_mb || 0
        }
      } else {
        // Get personal usage
        const { count: itemCount } = await supabase
          .from('encrypted_data')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        return {
          currentUsers: 1, // Personal account always has 1 user
          currentItems: itemCount || 0,
          currentStorage: 0 // TODO: Calculate actual storage usage
        }
      }
    } catch (error) {
      console.error('Error getting usage data:', error)
      return { currentUsers: 0, currentItems: 0, currentStorage: 0 }
    }
  }

  // Check if within limits
  const checkLimits = useCallback(async (
    action: 'create_item' | 'add_user' | 'upload_file',
    size?: number
  ): Promise<{ allowed: boolean; reason?: string }> => {
    if (!subscription) {
      return { allowed: false, reason: 'Subscription not loaded' }
    }

    const { usage } = subscription

    switch (action) {
      case 'create_item':
        if (usage.currentItems >= usage.limits.maxItems) {
          return {
            allowed: false,
            reason: `Maximum ${usage.limits.maxItems} item limit reached. Upgrade your plan to create more items.`
          }
        }
        break

      case 'add_user':
        if (usage.currentUsers >= usage.limits.maxUsers) {
          return {
            allowed: false,
            reason: `Maximum ${usage.limits.maxUsers} user limit reached. Upgrade your plan to add more users.`
          }
        }
        break

      case 'upload_file':
        const fileSizeMB = size ? Math.round(size / (1024 * 1024)) : 0
        if (usage.currentStorage + fileSizeMB > usage.limits.maxStorage) {
          return {
            allowed: false,
            reason: `Storage limit exceeded. You have ${usage.limits.maxStorage}MB available.`
          }
        }
        break
    }

    return { allowed: true }
  }, [subscription])

  // Upgrade subscription
  const upgradePlan = async (
    newPlan: SubscriptionPlan,
    paymentMethod?: string
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      setLoading(true)

      // In a real app, integrate with Stripe/Paddle here
      // For now, we'll simulate the upgrade process

      const planDetails = getPlanDetails(newPlan)
      if (!planDetails) {
        return { success: false, error: 'Invalid plan selected' }
      }

      // Create subscription record
      const { error: historyError } = await supabase
        .from('subscription_history')
        .insert([{
          user_id: user.id,
          tenant_id: tenantId || null,
          plan: newPlan,
          status: 'active',
          amount: planDetails.price,
          currency: planDetails.currency,
          payment_method: paymentMethod || 'stripe',
          payment_provider: 'stripe',
          period_start: new Date().toISOString(),
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          metadata: { upgraded_from: subscription?.plan || 'free' }
        }])

      if (historyError) {
        throw new Error(historyError.message)
      }

      // Update subscription
      if (tenantId) {
        // Update tenant subscription
        const sectorConfig = getSectorConfig('dentist') // TODO: Get actual sector
        const limits = sectorConfig?.subscriptionPlans[newPlan]

        await supabase
          .from('tenants')
          .update({
            subscription_plan: newPlan,
            subscription_status: 'active',
            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            max_users: limits?.maxUsers || 1,
            max_encrypted_items: limits?.maxItems || 10,
            max_storage_mb: limits?.maxStorage || 100
          })
          .eq('id', tenantId)
      } else {
        // Update user subscription
        await supabase
          .from('profiles')
          .update({
            subscription_plan: newPlan,
            subscription_status: 'active',
            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', user.id)
      }

      // Reload subscription data
      await loadSubscription()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cancel subscription
  const cancelSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user || !subscription) {
      return { success: false, error: 'No active subscription' }
    }

    try {
      setLoading(true)

      // Update subscription status
      if (tenantId) {
        await supabase
          .from('tenants')
          .update({
            subscription_status: 'canceled',
            // Keep plan active until expiration
          })
          .eq('id', tenantId)
      } else {
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled'
          })
          .eq('id', user.id)
      }

      // Reload subscription data
      await loadSubscription()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscription()
  }, [loadSubscription])

  return {
    subscription,
    loading,
    error,
    checkLimits,
    upgradePlan,
    cancelSubscription,
    reload: loadSubscription
  }
}

// Helper functions
function getPlanFeatures(plan: SubscriptionPlan): string[] {
  const features: Record<SubscriptionPlan, string[]> = {
    free: [
      'Basic encryption',
      'Personal use only',
      'Community support'
    ],
    basic: [
      'Advanced encryption',
      'Team collaboration',
      'Email support',
      'Basic analytics'
    ],
    premium: [
      'Enterprise encryption',
      'Advanced team features',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ],
    enterprise: [
      'Custom encryption',
      'Unlimited team features',
      'Dedicated support',
      'Custom analytics',
      'White-label options',
      'SLA guarantee'
    ]
  }

  return features[plan] || []
}

function getPlanDetails(plan: SubscriptionPlan): PlanDetails | null {
  const plans: Record<SubscriptionPlan, PlanDetails> = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      billing: 'monthly',
      limits: { maxUsers: 1, maxItems: 10, maxStorage: 100, features: [] },
      features: getPlanFeatures('free')
    },
    basic: {
      id: 'basic',
      name: 'Basic',
      price: 29,
      currency: 'USD',
      billing: 'monthly',
      limits: { maxUsers: 5, maxItems: 100, maxStorage: 1000, features: [] },
      features: getPlanFeatures('basic')
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 99,
      currency: 'USD',
      billing: 'monthly',
      limits: { maxUsers: 20, maxItems: 500, maxStorage: 5000, features: [] },
      popular: true,
      features: getPlanFeatures('premium')
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      currency: 'USD',
      billing: 'monthly',
      limits: { maxUsers: 100, maxItems: 2000, maxStorage: 20000, features: [] },
      features: getPlanFeatures('enterprise')
    }
  }

  return plans[plan] || null
}

export { getPlanDetails }
