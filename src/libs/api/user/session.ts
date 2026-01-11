import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "../../supabase/client"

/** 브라우저 쿠키 토큰(세션) 가져오기 */
export async function getBrowserSession(): Promise<Session | null> {
  // const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session ?? null
}

/** 브라우저 쿠키 토큰(사용자) 가져오기 */
export async function getBrowserUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error

  return data.user ?? null
}
