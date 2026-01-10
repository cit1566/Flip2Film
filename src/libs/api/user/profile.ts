import createClient from "../../supabase/client"
import type { User, UserUpdate } from "../../supabase/types"
import { assert } from "./profile-image"

/** 사용자 id에 해당하는 public.user 데이터 가져오기 */
export async function getUser(id: string): Promise<User | null> {
  const supabase = createClient()
  assert(id, "사용자 ID는 필수 항목입니다.")

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error

  return data ?? null
}

/** public.user 업데이트 */
export async function updateUser(
  id: string,
  updateData: Partial<Omit<UserUpdate, "id">>
) {
  const supabase = createClient()
  assert(id, "사용자 ID는 필수 항목입니다.")

  const { data, error } = await supabase
    .from("user")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}
