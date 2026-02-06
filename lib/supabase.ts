import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yqyddqitrgymmrmakoll.supabase.co"
const supabaseAnonKey = "sb_publishable_VSf01rux4HSvcSjdoMGM0g_49KD4ee3"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)