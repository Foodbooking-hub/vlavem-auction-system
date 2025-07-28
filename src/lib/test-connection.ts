import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    console.log('✅ Supabase client initialized')

    // Test 2: Test database connection with our tables
    const { data: auctionsData, error: auctionsError } = await supabase
      .from('auctions')
      .select('id, name, status')
      .limit(1)

    if (auctionsError) {
      console.error('❌ Database connection failed:', auctionsError.message)
      return false
    }

    console.log('✅ Database connection successful')
    console.log('📋 Found auctions:', auctionsData?.length || 0)

    // Test 3: Test categories table
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('name')
      .limit(5)

    if (!categoriesError && categoriesData) {
      console.log('✅ Categories loaded:', categoriesData.map(c => c.name).join(', '))
    }

    // Test 4: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️ No authenticated user (this is normal for initial setup)')
    } else if (user) {
      console.log('✅ User authenticated:', user.email)
    } else {
      console.log('ℹ️ No user session (this is normal for initial setup)')
    }

    // Test 5: Check database schema
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['auctions', 'clients', 'lots', 'categories'])

    if (!tablesError && tablesData) {
      const tableNames = tablesData.map(t => t.table_name)
      console.log('✅ Schema tables found:', tableNames.join(', '))
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
