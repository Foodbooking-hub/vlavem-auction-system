import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    console.log('✅ Supabase client initialized')

    // Test 2: Test database connection
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')

    // Test 3: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️ No authenticated user (this is normal for initial setup)')
    } else if (user) {
      console.log('✅ User authenticated:', user.email)
    } else {
      console.log('ℹ️ No user session (this is normal for initial setup)')
    }

    // Test 4: Check project settings
    const { data: settings, error: settingsError } = await supabase
      .rpc('version')
      .single()

    if (!settingsError && settings) {
      console.log('✅ Database version:', settings)
    }

    console.log('🎉 All Supabase tests passed!')
    return true

  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

// Environment variables check
export function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing)
    return false
  }

  console.log('✅ All required environment variables are set')
  
  // Check URL format
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && !url.includes('supabase.co')) {
    console.warn('⚠️ Supabase URL format might be incorrect:', url)
  }

  return true
}
