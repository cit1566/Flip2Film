import type { User } from "../../../supabase/types"

export async function fetchMeProfile(): Promise<User | null> {
  const res = await fetch("/api/user/profile-image", { method: "GET" })

  if (res.status === 401) return null
  if (!res.ok) {
    const data = await res.json().catch(() => null)

    throw new Error(data?.message ?? "프로필 조회 실패")
  }

  return (await res.json()) as User
}

// server Logout
export async function requestLogout(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "로그아웃 ")
  }
}
