import type { Session } from "@supabase/supabase-js"
import { supabase } from "./user-api"

/** 브라우저 쿠키 토큰(세션) 가져오기 */
export async function getBrowserSession(): Promise<Session | null> {
  // const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session ?? null
}
