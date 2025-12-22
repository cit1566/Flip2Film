import { fileToBase64 } from "../../../utils/fileToBase64"
import createClient from "../../supabase/client"
import type { UserInsert, UserUpdate } from "../../supabase/types"

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
  if (!email) {
    throw new Error("이메일은 필수 항목입니다.")
  }

  if (!password || password.length < 8) {
    throw new Error("비밀번호는 최소 8자 이상이어야 합니다.")
  }

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

// 사용자 id에 해당하는 user 데이터 가져오기
export async function getUser(id: string) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error

  return data
}

export async function updateUser(
  id: string,
  updateData: Omit<UserUpdate, "id">
) {
  if (!id) {
    throw new Error("사용자 ID는 필수 항목입니다.")
  }

  const { data, error } = await supabase
    .from("user")
    .update(updateData)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// 사용자 토큰 발행
export async function logIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    throw new Error(`로그인 에러 발생!${error.message}`)
  }

  return data
}

// logout function
export async function logOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(`로그아웃 실패 : ${error.message}`)
  }
}
