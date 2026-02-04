import { createClient } from "@/libs/supabase/server"
import { VALIDATION_PATTERNS } from "@/utils/commonConstants/validation"

type FieldKey = "email" | "nickname"

const MESSAGE: Record<FieldKey, string> = {
  email: "이미 가입된 사용자입니다.",
  nickname: "이미 사용중인 닉네임입니다.",
}

export default async function checkValidate({
  key,
  value,
}: {
  key: FieldKey
  value: string
}): Promise<true | string> {
  const v = value.trim()

  // 형식 검증은 다른 rule에서 하고, 여기서는 "중복 체크"만 한다는 가정(형식 틀리면 중복체크 스킵)
  if (key === "email" && (!v || !VALIDATION_PATTERNS.email.value.test(v)))
    return true
  if (key === "nickname" && (!v || v.length < 2)) return true

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user")
    .select("id")
    .eq(key, key === "email" ? v.toLowerCase() : v)
    .limit(1)
    .maybeSingle()

  if (error) throw error

  // 존재하면 에러 메시지, 없으면 통과(true)
  return data ? MESSAGE[key] : true
}
