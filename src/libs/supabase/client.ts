import { createBrowserClient } from "@supabase/ssr"
import supabaseInfo from "./info"

const { supabaseUrl, supabaseKey } = supabaseInfo

export default function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export const supabase = createClient()
