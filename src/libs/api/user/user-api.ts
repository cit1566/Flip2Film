import createClient from "../../supabase/client"
import type { UserInsert, UserUpdate } from "../../supabase/types"

export const supabase = createClient()

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

  // 파일 크기 검증 로직 (5MB 제한)
  const MAX_FILE_SIZE = 5 * 1024 * 1024
  if (profile_image && profile_image.size > MAX_FILE_SIZE) {
    throw new Error("업로드 가능한 파일 크기(5MB)를 초과했습니다")
  }

  const fileExtension =
    profile_image?.name.split(".").pop()?.toLowerCase() ?? "png"
  const allowedExtensions = ["png", "jpeg", "jpg"]

  if (profile_image && !allowedExtensions.includes(fileExtension)) {
    throw new Error("지원하지 않는 파일 형식입니다.")
  }

  // Supabase Auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        bio,
        profile_image: profile_image ? `profile.${fileExtension}` : null,
      },
    },
  })

  if (error || !data.user) {
    throw error ?? new Error("회원가입 실패")
  }

  if (profile_image) {
    const filePath = `${data.user.id}/profile.${fileExtension}`

    // 스토리지 업로드
    const { error: uploadError } = await supabase.storage
      .from("profile_image")
      .upload(filePath, profile_image, {
        upsert: true,
        contentType: profile_image.type,
      })

    if (uploadError) {
      throw new Error(`이미지 업로드 에러 : ${uploadError.message}`)
    }
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
  if (!id) throw new Error("사용자 ID는 필수 항목입니다.")
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
  if (error) throw new Error(`로그인 에러 발생!${error.message ?? ""}`)
  return data
}

// logout function
export async function logOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`로그아웃 실패 : ${error.message ?? ""}`)
}

/**
 * 소셜 로그인 (OAuth)
 * 사용자가 소셜로 로그인(kakao, google)로 연결해서 가입할 때, 리다이렉트 주소로 이동
 */
export const signInWithSocial = async (provider: "kakao" | "google") => {
  if (typeof window === "undefined") {
    throw new Error(
      "signInWithSocial이라는 함수는 클라이언트 함수에만 호출할 수 있습니다"
    )
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/social`,
      queryParams:
        provider === "google"
          ? { prompt: "consent select_account" }
          : { prompt: "login" },
    },
  })

  if (error) throw new Error(error.message)
  return true
}

// user resetPassword(유저 비밀번호 재설정 리다이렉션)
export const resetPasswordEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  })

  if (error) throw new Error(error.message)
  return true
}

// new password update(user)
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw new Error(error.message)
  return true
}
