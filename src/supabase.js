import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://crqnghnzjphilddukwpg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_FFmwr1teg930p5GXT1p9uA_7XEQUQ5Y'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)