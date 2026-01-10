import type { AuthTokenResponse, AuthUser } from "@supabase/supabase-js"
import createClient from "../../supabase/client"
import type { UserInsert, UserUpdate } from "../../supabase/types"
import {
  assert,
  getFileExtension,
  makeProfileImagePath,
  validateProfileImage,
} from "./profile-image"
import { ensureBrowser } from "./user-api"

const supabase = createClient()

/** ====== constants ====== */
const PROFILE_BUCKET = "profile_image" as const

/** ====== types ====== */
export interface CreateUserProps {
  email: UserInsert["email"]
  password: string
  bio: UserInsert["bio"]
  nickname: UserInsert["nickname"]
  profile_image: File | null
}

// -----------------------------------------------------------------------------------------
/**
 * 회원가입 (Auth 사용자 생성)
 * - auth.users 생성
 * - 트리거에 의해 public.user 자동 생성
 * - (선택) 프로필 이미지 업로드 + public.user.profile_image 업데이트
 */
export default async function createUser({
  email,
  password,
  bio,
  nickname,
  profile_image,
}: CreateUserProps): Promise<AuthUser> {
  assert(email, "이메일은 필수 항목입니다.")
  assert(
    password && password.length >= 8,
    "비밀번호는 최소 8자 이상이어야 합니다."
  )

  if (profile_image) validateProfileImage(profile_image)

  // 1) Auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        bio,
        // 주의: 여기서는 userId를 아직 모름.
        // profile_image 경로(filePath)는 아래 업로드 이후 public.user에 업데이트하는 방식이 안전.
        profile_image: null,
      },
    },
  })

  if (error || !data.user) throw error ?? new Error("회원가입 실패")

  // 2) 프로필 이미지 업로드 (가능한 경우)
  if (profile_image) {
    const ext = getFileExtension(profile_image)
    const filePath = makeProfileImagePath(data.user.id, ext)

    /**
     * ⚠️ 이메일 인증(Confirm email)이 켜져 있으면 signUp 직후 session이 없을 수 있어
     * - 그 경우: storage 업로드/DB 업데이트가 RLS 때문에 실패할 가능성이 큼
     * - 해결: (A) 이메일 인증 OFF, (B) 인증 완료 후 업로드(프로필 설정 화면),
     *         (C) Edge Function(서비스 롤)로 회원가입+업로드 처리
     */
    if (data.session) {
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(filePath, profile_image, {
          upsert: false, // 새 파일로 올려 URL 변경(캐시 이슈 방지)
          contentType: profile_image.type,
          // cacheControl: "3600", // 필요 시
        })

      if (uploadError) {
        throw new Error(`이미지 업로드 에러: ${uploadError.message}`)
      }

      // 3) public.user 테이블에 filePath 저장 (RLS가 허용되어야 함)
      // update()는 기본적으로 반환값이 없으므로 select()를 붙이는 게 안전
      await supabase
        .from("user")
        .update({ profile_image: filePath } satisfies Partial<UserUpdate>)
        .eq("id", data.user.id)
        .select()
        .maybeSingle()

      // (선택) auth 메타데이터에도 저장해두면 추후 동기화에 유리
      await supabase.auth.updateUser({
        data: { profile_image: filePath },
      })
    }
  }

  return data.user
}
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
/** 로그인 */
export async function logIn(
  email: string,
  password: string
): Promise<AuthTokenResponse["data"]> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(`로그인 에러 발생! ${error.message ?? ""}`)
  return data
}
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
/** 로그아웃 */
export async function logOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`로그아웃 실패: ${error.message ?? ""}`)
}
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
/**
 * 소셜 로그인 (OAuth)
 * - 브라우저에서만 사용
 */
export const signInWithSocial = async (provider: "kakao" | "google") => {
  ensureBrowser("signInWithSocial")

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
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
/** resetPassword(비밀번호 재설정 메일) */
export const resetPasswordEmail = async (email: string) => {
  ensureBrowser("resetPasswordEmail")

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  })
  if (error) throw new Error(error.message)
  return true
}
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
/** 새 비밀번호 업데이트 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
  return true
}
// -----------------------------------------------------------------------------------------
