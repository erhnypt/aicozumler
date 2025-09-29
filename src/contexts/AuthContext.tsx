
import { createContext, useContext, useEffect, useState } from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase, type Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    firstName: string
    lastName: string
    company?: string
    phone?: string
  }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  refreshSession: () => Promise<{ error: any }>
  isTokenExpired: () => boolean
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
          // Store token info in localStorage for persistence
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at
          }))
        } else {
          setProfile(null)
          localStorage.removeItem('supabase.auth.token')
        }
        setLoading(false)
      }
    )

    // Set up automatic token refresh
    const refreshInterval = setInterval(async () => {
      if (session && isTokenExpired()) {
        console.log('Token expired, refreshing...')
        await refreshSession()
      }
    }, 60000) // Check every minute

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [session])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    company?: string
    phone?: string
  }) => {
    try {
      const emailRedirectTo = `${window.location.origin}/dogrulama`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            company: userData.company || null,
            phone: userData.phone || null,
          }
        }
      })

      if (error) return { error }

      // Create profile after successful signup (only if user object exists immediately)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              first_name: userData.firstName,
              last_name: userData.lastName,
              company: userData.company || null,
              phone: userData.phone || null,
            },
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (data.session) {
        // Store token info immediately after successful login
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }))
      }
      
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('supabase.auth.token')
      setSession(null)
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        // If refresh fails, sign out the user
        await signOut()
        return { error }
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
        
        // Update stored token info
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }))
      }

      return { error: null }
    } catch (error) {
      console.error('Error refreshing session:', error)
      return { error }
    }
  }

  const isTokenExpired = () => {
    if (!session) return true
    
    const expiresAt = session.expires_at
    if (!expiresAt) return true
    
    // Check if token expires within the next 5 minutes
    const now = Math.floor(Date.now() / 1000)
    const bufferTime = 5 * 60 // 5 minutes in seconds
    
    return expiresAt <= (now + bufferTime)
  }

  const getAccessToken = () => {
    if (session?.access_token) {
      return session.access_token
    }
    
    // Fallback to localStorage
    const storedToken = localStorage.getItem('supabase.auth.token')
    if (storedToken) {
      try {
        const tokenData = JSON.parse(storedToken)
        return tokenData.access_token
      } catch (error) {
        console.error('Error parsing stored token:', error)
      }
    }
    
    return null
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) return { error: 'No user logged in' }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshSession,
    isTokenExpired,
    getAccessToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
