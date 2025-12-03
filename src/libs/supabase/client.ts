import { createBrowserClient } from "@supabase/ssr"
import supabaseInfo from "./info"

const { supabaseKey, supabaseUrl } = supabaseInfo

export function createClient() {
  return createBrowserClient(supabaseKey, supabaseUrl)
}
