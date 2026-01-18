import { createClient } from "@/libs/supabase/server"
import { VALIDATION_PATTERNS } from "@/utils/commonConstants/validation"

interface checkValidateProps {
  key: "email" | "nickname"
  value: string
}

const MESSAGE = {
  email: "이미 가입된 사용자입니다.",
  nickname: "이미 사용중인 닉네임입니다.",
}

export default async function checkValidate({
  key,
  value,
}: checkValidateProps): Promise<string | boolean> {
  if (key === "email")
    if (!value || !VALIDATION_PATTERNS.email.value.test(value)) return true

  if (key === "nickname") if (!value || value.length < 2) return true

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user")
    .select(key)
    .eq(key, value)
    .maybeSingle()

  if (error) throw error
  if (data) true
  return key === "email" ? MESSAGE.email : MESSAGE.nickname
}
