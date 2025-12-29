import createClient from "@/libs/supabase/client"

const supabase = createClient()

/**
 * 사용자의 이메일 또는 닉네임을 조회해서,
 * 인증된 이메일 또는 닉네임을 사용하여 중복되었는지 인풋 입력에서 검사
 * 만약, 이미 인증된 사용자 값을 입력했다면, 에러가 발생함
 */

// 이메일 인증 중복확인
export const checkEmailValidate = async (email: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("email")
    .eq("email", email)
    .maybeSingle()

  if (error) throw error
  return !!data
}

// 닉네임 인증 중복확인
export const checkNicknameValidate = async (nickname: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("nickname")
    .eq("nickname", nickname)
    .maybeSingle()

  if (error) throw error
  return !!data
}
