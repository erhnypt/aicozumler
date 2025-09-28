
import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

interface SupabaseRequestOptions {
  table: string
  select?: string
  filters?: Record<string, any>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  offset?: number
}

export function useApiRequest() {
  const { getAccessToken, refreshSession, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Traditional API request (for external APIs)
  const makeRequest = useCallback(async (url: string, options: ApiRequestOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const token = getAccessToken()
      
      if (!token) {
        throw new Error('No access token available')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }

      const config: RequestInit = {
        method: options.method || 'GET',
        headers,
      }

      if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
        config.body = JSON.stringify(options.body)
      }

      const response = await fetch(url, config)

      // Handle token expiration
      if (response.status === 401) {
        console.log('Token expired, attempting refresh...')
        const { error: refreshError } = await refreshSession()
        
        if (refreshError) {
          // If refresh fails, sign out user
          await signOut()
          throw new Error('Session expired. Please login again.')
        }

        // Retry request with new token
        const newToken = getAccessToken()
        if (newToken) {
          const retryResponse = await fetch(url, {
            ...config,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newToken}`
            }
          })
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`)
          }
          
          const retryData = await retryResponse.json()
          return retryData
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [getAccessToken, refreshSession, signOut])

  // Supabase database request
  const makeSupabaseRequest = useCallback(async (options: SupabaseRequestOptions) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from(options.table).select(options.select || '*')

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            query = query.eq(key, value)
          }
        })
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        })
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supabase insert
  const insertSupabase = useCallback(async (table: string, data: any) => {
    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supabase update
  const updateSupabase = useCallback(async (table: string, id: string, data: any) => {
    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supabase delete
  const deleteSupabase = useCallback(async (table: string, id: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    makeRequest, 
    makeSupabaseRequest,
    insertSupabase,
    updateSupabase,
    deleteSupabase,
    loading, 
    error 
  }
}
