import { requestLogout } from "@/libs/api/client/me/me"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: requestLogout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me-profile"] })
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
  })
}
