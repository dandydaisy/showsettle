import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Feature {
  id: number
  title: string
  description: string | null
  votes: number
  status: string
  category: string
  created_at: string
  updated_at: string
}

export interface Vote {
  id: number
  feature_id: number
  user_id: string
  vote_direction: 1 | -1
  created_at: string
}
