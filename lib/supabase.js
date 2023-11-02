import { createClient } from 'supabase-wechat-stable-v2'
const url = ""
const key = ""
export const supabase = createClient(url, key)
