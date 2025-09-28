import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [testResults, setTestResults] = useState<{
    envVars: boolean
    supabaseClient: boolean
    authConnection: boolean
    databaseConnection: boolean
  }>({
    envVars: false,
    supabaseClient: false,
    authConnection: false,
    databaseConnection: false
  })

  const { user, session } = useAuth()

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    const results = {
      envVars: false,
      supabaseClient: false,
      authConnection: false,
      databaseConnection: false
    }

    try {
      // Test 1: Environment variables
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey && 
          supabaseUrl !== 'your_supabase_project_url' && 
          supabaseKey !== 'your_supabase_anon_key') {
        results.envVars = true
        console.log('✅ Environment variables loaded correctly')
      } else {
        console.log('❌ Environment variables not configured')
        setErrorMessage('Environment variables not configured. Please check your .env file.')
        setConnectionStatus('error')
        setTestResults(results)
        return
      }

      // Test 2: Supabase client
      if (supabase) {
        results.supabaseClient = true
        console.log('✅ Supabase client initialized')
      } else {
        console.log('❌ Supabase client not initialized')
        setErrorMessage('Supabase client not initialized')
        setConnectionStatus('error')
        setTestResults(results)
        return
      }

      // Test 3: Auth connection
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (!authError) {
          results.authConnection = true
          console.log('✅ Auth connection successful')
          console.log('Current session:', session ? 'Active' : 'No active session')
        } else {
          console.log('❌ Auth connection failed:', authError.message)
        }
      } catch (error) {
        console.log('❌ Auth connection error:', error)
      }

      // Test 4: Database connection
      try {
        const { error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (!dbError) {
          results.databaseConnection = true
          console.log('✅ Database connection successful')
        } else {
          console.log('❌ Database connection failed:', dbError.message)
          if (dbError.message.includes('relation "profiles" does not exist')) {
            setErrorMessage('Profiles table does not exist. Please create it in your Supabase database.')
          } else {
            setErrorMessage(`Database error: ${dbError.message}`)
          }
        }
      } catch (error) {
        console.log('❌ Database connection error:', error)
        setErrorMessage(`Database connection failed: ${error}`)
      }

      setTestResults(results)

      // Determine overall status
      if (results.envVars && results.supabaseClient && results.authConnection && results.databaseConnection) {
        setConnectionStatus('connected')
        setErrorMessage('')
      } else if (results.envVars && results.supabaseClient) {
        setConnectionStatus('connected')
        setErrorMessage('Connection established but some features may not work properly.')
      } else {
        setConnectionStatus('error')
      }

    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus('error')
      setErrorMessage(`Connection test failed: ${error}`)
    }
  }

  const testAuth = async () => {
    try {
      // Test sign up
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = 'testpassword123'
      
      console.log('Testing sign up...')
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (signUpError) {
        console.log('❌ Sign up failed:', signUpError.message)
        return
      }

      console.log('✅ Sign up successful:', signUpData.user?.id)

      // Test sign in
      console.log('Testing sign in...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (signInError) {
        console.log('❌ Sign in failed:', signInError.message)
        return
      }

      console.log('✅ Sign in successful:', signInData.user?.id)

      // Test sign out
      console.log('Testing sign out...')
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.log('❌ Sign out failed:', signOutError.message)
        return
      }

      console.log('✅ Sign out successful')

    } catch (error) {
      console.error('Auth test failed:', error)
    }
  }

  const getStatusColor = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking': return 'text-yellow-600'
      case 'connected': return 'text-green-600'
      case 'error': return 'text-red-600'
    }
  }

  const getStatusIcon = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking': return '⏳'
      case 'connected': return '✅'
      case 'error': return '❌'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Supabase Bağlantı Testi
      </h2>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Bağlantı Durumu:</span>
          <span className={`font-bold ${getStatusColor(connectionStatus)}`}>
            {getStatusIcon(connectionStatus)} {connectionStatus.toUpperCase()}
          </span>
        </div>
        
        {errorMessage && (
          <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Test Sonuçları:</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Environment Variables</span>
            <span className={testResults.envVars ? 'text-green-600' : 'text-red-600'}>
              {testResults.envVars ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Supabase Client</span>
            <span className={testResults.supabaseClient ? 'text-green-600' : 'text-red-600'}>
              {testResults.supabaseClient ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Auth Connection</span>
            <span className={testResults.authConnection ? 'text-green-600' : 'text-red-600'}>
              {testResults.authConnection ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Database Connection</span>
            <span className={testResults.databaseConnection ? 'text-green-600' : 'text-red-600'}>
              {testResults.databaseConnection ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Auth Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Mevcut Auth Durumu:</h3>
        <div className="text-sm space-y-1">
          <div>Kullanıcı: {user ? `✅ ${user.email}` : '❌ Giriş yapılmamış'}</div>
          <div>Session: {session ? '✅ Aktif' : '❌ Yok'}</div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Environment Bilgileri:</h3>
        <div className="text-sm space-y-1">
          <div>Supabase URL: {import.meta.env.VITE_PUBLIC_SUPABASE_URL ? '✅ Yüklendi' : '❌ Yok'}</div>
          <div>Supabase Key: {import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ? '✅ Yüklendi' : '❌ Yok'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={testSupabaseConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Bağlantıyı Tekrar Test Et
        </button>
        
        <button
          onClick={testAuth}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Auth Akışını Test Et
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Yapılacaklar:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>.env dosyasını oluşturun: <code className="bg-gray-200 px-1 rounded">cp env.example .env</code></li>
          <li>Supabase proje URL'nizi ve anon key'inizi .env dosyasına ekleyin</li>
          <li>Supabase'de profiles tablosunu oluşturun</li>
          <li>RLS (Row Level Security) politikalarını ayarlayın</li>
        </ul>
      </div>
    </div>
  )
}
