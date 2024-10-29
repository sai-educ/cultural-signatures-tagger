import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CulturalSignature = {
  id: number
  artifact_id: string
  values_beliefs: number
  aesthetic_elements: number
  communication_styles: number
  notes: string
  created_at: string
  updated_at: string
}