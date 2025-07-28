import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (will be generated later)
export type Database = {
  public: {
    Tables: {
      // Will be populated with actual schema
    }
    Views: {
      // Will be populated with actual schema
    }
    Functions: {
      // Will be populated with actual schema
    }
    Enums: {
      // Will be populated with actual schema
    }
  }
}
