import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type EncryptedData } from '../lib/supabase'
import { encrypt, decrypt, generateUserKey } from '../lib/encryption'

export function useEncryption() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Kullanıcının güvenli şifreleme anahtarını oluştur
  const getEncryptionKey = useCallback(() => {
    if (!user) return ''
    return generateUserKey(user.id)
  }, [user])

  // Şifreli veri kaydet
  const saveEncryptedData = useCallback(async (
    dataType: string,
    content: string,
    title?: string,
    description?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı giriş yapmamış' }
    }

    setLoading(true)
    setError(null)

    try {
      const encryptionKey = getEncryptionKey()
      const encryptedContent = encrypt(content, encryptionKey)

      const { error } = await supabase
        .from('encrypted_data')
        .insert([
          {
            user_id: user.id,
            data_type: dataType,
            title: title || dataType.replace('_', ' ').toUpperCase(),
            description: description || null,
            encrypted_content: encryptedContent,
            access_level: 'private'
          }
        ])

      if (error) {
        setError('Veri kaydetme hatası')
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user, getEncryptionKey])

  // Şifreli veri güncelle
  const updateEncryptedData = useCallback(async (
    id: string,
    content: string,
    title?: string,
    description?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı giriş yapmamış' }
    }

    setLoading(true)
    setError(null)

    try {
      const encryptionKey = getEncryptionKey()
      const encryptedContent = encrypt(content, encryptionKey)

      const updateData: any = {
        encrypted_content: encryptedContent,
        updated_at: new Date().toISOString()
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description

      const { error } = await supabase
        .from('encrypted_data')
        .update(updateData)
        .eq('id', id)

      if (error) {
        setError('Veri güncelleme hatası')
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user, getEncryptionKey])

  // Şifreli verileri getir ve çöz
  const getEncryptedData = useCallback(async (
    dataType?: string,
    options?: {
      limit?: number
      offset?: number
      orderBy?: string
      orderDirection?: 'asc' | 'desc'
    }
  ): Promise<{ data: Array<EncryptedData & { decrypted_content: string }>; error?: string }> => {
    if (!user) {
      return { data: [], error: 'Kullanıcı giriş yapmamış' }
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('encrypted_data')
        .select('*')
        .eq('user_id', user.id)

      if (dataType) {
        query = query.eq('data_type', dataType)
      }

      // Apply ordering
      const orderBy = options?.orderBy || 'created_at'
      const orderDirection = options?.orderDirection || 'desc'
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        setError('Veri getirme hatası')
        return { data: [], error: error.message }
      }

      // Verileri çöz
      const encryptionKey = getEncryptionKey()
      const decryptedData = data?.map(item => {
        try {
          return {
            ...item,
            decrypted_content: decrypt(item.encrypted_content, encryptionKey)
          }
        } catch (error) {
          console.error('Failed to decrypt item:', item.id, error)
          return {
            ...item,
            decrypted_content: '[Şifre çözme hatası]'
          }
        }
      }) || []

      return { data: decryptedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return { data: [], error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user, getEncryptionKey])

  // Şifreli veri sil
  const deleteEncryptedData = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı giriş yapmamış' }
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('encrypted_data')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Extra security check

      if (error) {
        setError('Veri silme hatası')
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])

  // Favori olarak işaretle/kaldır
  const toggleFavorite = useCallback(async (
    id: string,
    isFavorite: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı giriş yapmamış' }
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('encrypted_data')
        .update({ 
          is_favorite: isFavorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        setError('Favori güncelleme hatası')
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])

  // Kullanım istatistiklerini getir
  const getUsageStats = useCallback(async (): Promise<{
    totalItems: number
    itemsByType: Record<string, number>
    recentActivity: number
    error?: string
  }> => {
    if (!user) {
      return { totalItems: 0, itemsByType: {}, recentActivity: 0, error: 'Kullanıcı giriş yapmamış' }
    }

    try {
      // Total items
      const { count: totalItems } = await supabase
        .from('encrypted_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Items by type
      const { data: typeData } = await supabase
        .from('encrypted_data')
        .select('data_type')
        .eq('user_id', user.id)

      const itemsByType = typeData?.reduce((acc, item) => {
        acc[item.data_type] = (acc[item.data_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: recentActivity } = await supabase
        .from('encrypted_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())

      return {
        totalItems: totalItems || 0,
        itemsByType,
        recentActivity: recentActivity || 0
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      return {
        totalItems: 0,
        itemsByType: {},
        recentActivity: 0,
        error: errorMessage
      }
    }
  }, [user])

  return {
    loading,
    error,
    saveEncryptedData,
    updateEncryptedData,
    getEncryptedData,
    deleteEncryptedData,
    toggleFavorite,
    getUsageStats
  }
}