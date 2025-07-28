'use client'

import { useState, useEffect } from 'react'
import { testSupabaseConnection, checkEnvironmentVariables } from '@/lib/test-connection'

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [envStatus, setEnvStatus] = useState<boolean>(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    // Capture console logs
    const capturedLogs: string[] = []
    
    console.log = (...args) => {
      const message = args.join(' ')
      capturedLogs.push(message)
      setLogs(prev => [...prev, message])
      originalLog(...args)
    }

    console.error = (...args) => {
      const message = '❌ ' + args.join(' ')
      capturedLogs.push(message)
      setLogs(prev => [...prev, message])
      originalError(...args)
    }

    console.warn = (...args) => {
      const message = '⚠️ ' + args.join(' ')
      capturedLogs.push(message)
      setLogs(prev => [...prev, message])
      originalWarn(...args)
    }

    async function runTests() {
      try {
        // Test environment variables
        const envCheck = checkEnvironmentVariables()
        setEnvStatus(envCheck)

        if (!envCheck) {
          setConnectionStatus('error')
          return
        }

        // Test Supabase connection
        const connectionCheck = await testSupabaseConnection()
        setConnectionStatus(connectionCheck ? 'success' : 'error')

      } catch (error) {
        console.error('Test failed:', error)
        setConnectionStatus('error')
      }
    }

    runTests()

    // Restore original console methods
    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Supabase Connection Test
          </h1>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Environment Variables Status */}
            <div className={`p-4 rounded-lg border-2 ${
              envStatus 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <h3 className="font-semibold text-lg mb-2">
                {envStatus ? '✅' : '❌'} Environment Variables
              </h3>
              <p className="text-sm text-gray-600">
                {envStatus 
                  ? 'All required environment variables are configured'
                  : 'Missing or incorrect environment variables'
                }
              </p>
            </div>

            {/* Connection Status */}
            <div className={`p-4 rounded-lg border-2 ${
              connectionStatus === 'loading' 
                ? 'border-yellow-200 bg-yellow-50'
                : connectionStatus === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}>
              <h3 className="font-semibold text-lg mb-2">
                {connectionStatus === 'loading' ? '⏳' : connectionStatus === 'success' ? '✅' : '❌'} 
                {' '}Database Connection
              </h3>
              <p className="text-sm text-gray-600">
                {connectionStatus === 'loading' 
                  ? 'Testing connection...'
                  : connectionStatus === 'success'
                  ? 'Successfully connected to Supabase'
                  : 'Failed to connect to Supabase'
                }
              </p>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">📋 Project Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Project ID:</strong> ggrwknrueidpbwgijqmq</div>
              <div><strong>Project URL:</strong> https://ggrwknrueidpbwgijqmq.supabase.co</div>
              <div><strong>Region:</strong> West EU (Ireland)</div>
              <div><strong>Dashboard:</strong> 
                <a 
                  href="https://supabase.com/dashboard/project/ggrwknrueidpbwgijqmq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Open Dashboard →
                </a>
              </div>
            </div>
          </div>

          {/* Test Logs */}
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <h3 className="text-white font-semibold mb-3">🔍 Test Logs</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              ) : (
                <div className="text-gray-400">Running tests...</div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          {connectionStatus === 'success' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🚀 Next Steps</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Supabase is successfully connected</li>
                <li>📋 Ready to create database schema for auction system</li>
                <li>🔐 Ready to set up authentication</li>
                <li>🎯 Ready to start building auction features</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
