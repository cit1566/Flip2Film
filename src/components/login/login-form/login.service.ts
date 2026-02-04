import type { User as AuthUser } from "@supabase/supabase-js"

/**
 * Supabase Auth user -> zustand store 형태로 매핑
 * (UI/훅 코드에서 매핑 로직 분리)
 */
export function mapAuthUserToStore(user: AuthUser) {
  return {
    bio: (user.user_metadata?.bio as string | null) ?? null,
    email: user.email as string,
    id: user.id,
    nickname: user.user_metadata?.nickname as string,
    profile_image: (user.user_metadata?.profile_image as string | null) ?? null,
  }
}
