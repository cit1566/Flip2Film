import { fetchMeProfile } from "@/libs/api/client/me/me"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export function useMeProfile() {
  const query = useQuery({
    queryKey: ["profileImageUrl"],
    queryFn: fetchMeProfile,
    staleTime: 1000 * 60 * 5,
  })

  const me = query.data ?? null
  const authReady = Boolean(me?.nickname && me.nickname !== "익명")
  const profileImageUrl = me?.profile_image ?? "/profile/default-profile.png"

  return useMemo(
    () => ({
      ...query,
      me,
      authReady,
      profileImageUrl,
    }),
    [query, me, authReady, profileImageUrl]
  )
}
