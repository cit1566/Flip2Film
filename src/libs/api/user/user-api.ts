import { fileToBase64 } from "../../../utils/fileToBase64"
import createClient from "../../supabase/client"
import type { UserInsert } from "../../supabase/types"

const supabase = createClient()

interface createUserProps {
  email: UserInsert["email"]
  password: string
  bio: UserInsert["bio"]
  nickname: UserInsert["nickname"]
  profile_image: File | null
}

/**
 * 회원가입 (Auth 사용자 생성)
 * - auth.users 생성
 * - 트리거에 의해 public.user 자동 생성
 * - UI 단에서 validation이 완료되었다는 전제
 */
export default async function createUser({
  email,
  password,
  bio,
  nickname,
  profile_image,
}: createUserProps) {
  if (!email) return

  // profile_image가 있으면 base64 변환, 없으면 null
  const profileImageBase64 = profile_image
    ? await fileToBase64(profile_image)
    : null

  // Auth metadata (트리거에서 사용됨)
  const metadata = {
    nickname,
    bio,
    profile_image: profileImageBase64,
  }

  // Supabase Auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error || !data.user) {
    throw error ?? new Error("회원가입 실패")
  }

  return data.user
}

// 사용자 토큰 발행
export async function login(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (!data) {
    throw new Error(`로그인 에러 발생!${error}`)
  }

  return data
}

// logout function
export function logOut() {
  const supabase = createClient()
  supabase.auth.signOut()
}
