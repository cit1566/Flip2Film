import { useUserStore } from "@/features/auth/use-user-store"
import { getUser, supabase } from "@/libs/api/user/user-api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useUserQuery = () => {
  const queryClient = useQueryClient()
  const { setUser, clearUser } = useUserStore()

  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return null
      return await getUser(authUser.id)
    },
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (event === "SIGNED_IN") {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      } else if (event === "SIGNED_OUT") {
        clearUser()
        queryClient.setQueryData(["user-profile"], null)
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient, clearUser])

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (!query.isLoading && !query.data) {
      clearUser()
    }
  }, [query.data, query.isLoading, setUser, clearUser])

  return query
}
