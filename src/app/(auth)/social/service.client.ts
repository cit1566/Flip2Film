import { checkNicknameValidate } from "@/libs/api/client/auth/auth-api"
import {
  getBrowserUser,
  getUser,
  updateUser,
  uploadProfileImage,
} from "@/libs/api/client/user"
import type { UserUpdate } from "@/libs/supabase/types"

export type SocialProfileFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

export type SocialSignupResult =
  | { alreadyCompleted: true; userId: string }
  | { alreadyCompleted: false; userId: string }

/** 현재 로그인 유저 가져오기(없으면 에러) */
export async function requireBrowserUser() {
  const user = await getBrowserUser()
  if (!user) throw new Error("로그인 정보가 없습니다")
  return user
}

/** 이미 프로필 세팅 완료됐는지 확인 */
export async function isProfileCompleted(userId: string) {
  const userData = await getUser(userId).catch(err => {
    // row 없음 케이스: null 처리
    if (err?.code === "PGRST116") return null
    throw err
  })

  return Boolean(userData?.nickname && userData.nickname !== "익명")
}

/** (폼 검증용) 닉네임 중복 체크 */
export async function checkNicknameDuplicate(value: string | null | undefined) {
  if (!value || value.length < 2) return true
  try {
    const isExists = await checkNicknameValidate(value)
    return isExists ? "이미 사용 중인 닉네임입니다" : true
  } catch {
    return "닉네임 확인 중 오류가 발생했습니다"
  }
}

/** 소셜 가입 완료 처리(업로드 → user 업데이트) */
export async function completeSocialSignup(
  form: SocialProfileFormData
): Promise<SocialSignupResult> {
  const user = await requireBrowserUser()

  // 이미 완료된 유저면 종료
  const completed = await isProfileCompleted(user.id)
  if (completed) return { alreadyCompleted: true, userId: user.id }

  const { nickname, bio, profile_image } = form

  // 프로필 이미지 업로드(선택)
  let imagePath: string | null = null
  if (profile_image instanceof File) {
    const { filePath } = await uploadProfileImage(user.id, profile_image)
    imagePath = filePath
  }

  // public.user 업데이트
  await updateUser(user.id, {
    nickname: nickname ?? "익명",
    bio: bio ?? null,
    profile_image: imagePath,
  })

  return { alreadyCompleted: false, userId: user.id }
}
