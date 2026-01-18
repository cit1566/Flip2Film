import { createClient } from "@/libs/supabase/server"
import type { UserUpdate } from "@/libs/supabase/types"

export default async function updateUser(input: UserUpdate, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user")
    .update(input)
    .eq("id", userId)
    .select()
    .maybeSingle()

  if (error) throw new Error(`프로필 이미지 DB 저장 에러 ${error.message}`)

  return data
}
