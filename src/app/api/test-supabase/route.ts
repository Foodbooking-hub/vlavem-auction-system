import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      },
      tests: {
        clientInitialization: false,
        databaseConnection: false,
        adminConnection: false,
        authentication: false,
      },
      errors: [] as string[]
    }

    // Test 1: Client initialization
    try {
      if (supabase && supabaseAdmin) {
        results.tests.clientInitialization = true
      }
    } catch (error) {
      results.errors.push(`Client initialization: ${error}`)
    }

    // Test 2: Database connection (public client)
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1)

      if (!error) {
        results.tests.databaseConnection = true
      } else {
        results.errors.push(`Database connection: ${error.message}`)
      }
    } catch (error) {
      results.errors.push(`Database connection: ${error}`)
    }

    // Test 3: Admin connection
    try {
      const { data, error } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .limit(1)

      if (!error) {
        results.tests.adminConnection = true
      } else {
        results.errors.push(`Admin connection: ${error.message}`)
      }
    } catch (error) {
      results.errors.push(`Admin connection: ${error}`)
    }

    // Test 4: Authentication status
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (!error) {
        results.tests.authentication = true
        // Note: user will be null if no one is logged in, which is normal
      } else {
        results.errors.push(`Authentication: ${error.message}`)
      }
    } catch (error) {
      results.errors.push(`Authentication: ${error}`)
    }

    // Overall status
    const allTestsPassed = Object.values(results.tests).every(test => test === true)
    const environmentOk = Object.values(results.environment).every(env => env === '✅ Set')

    return NextResponse.json({
      success: allTestsPassed && environmentOk,
      message: allTestsPassed && environmentOk 
        ? '🎉 All Supabase tests passed!' 
        : '⚠️ Some tests failed',
      ...results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '❌ Server-side test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
