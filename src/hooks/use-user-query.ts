import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { getUser } from "../libs/api/client/user"
import { supabase } from "../libs/supabase/client"
import { useUserStore } from "../store/useUserStore"

export const useUserQuery = () => {
  const queryClient = useQueryClient()
  const { setUserData, reset } = useUserStore()

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
        reset()
        queryClient.setQueryData(["user-profile"], null)
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient, reset])

  useEffect(() => {
    if (query.data) {
      setUserData(query.data)
    } else if (!query.isLoading && !query.data) {
      reset()
    }
  }, [query.data, query.isLoading, setUserData, reset])

  return query
}
