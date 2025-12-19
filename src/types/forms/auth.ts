import type { UserInsert } from "@/libs/supabase/types"

// 회원가입 폼 타입
export interface SignUpFormValues extends Pick<
  UserInsert,
  "email" | "nickname" | "bio"
> {
  profile_image: File | null

  password: string
  passwordCheck: string
}

// 로그인 폼 타입
export interface LoginFormValues extends Pick<UserInsert, "email"> {
  password: string
}
