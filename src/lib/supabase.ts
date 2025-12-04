import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * Get the Supabase client - lazily initialized to avoid build-time errors
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Create lazy proxy that only initializes when accessed at runtime
const handler = {
  get(_: object, prop: string) {
    const client = getSupabase()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
}

export const supabase = new Proxy({} as SupabaseClient, handler)

// Types for database (will be expanded as needed)
export interface WaitlistEntry {
  id?: string
  email: string
  wallet_address?: string
  created_at?: string
}
