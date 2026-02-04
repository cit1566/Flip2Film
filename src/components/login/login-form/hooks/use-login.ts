"use client"

import { logIn } from "@/libs/api/client/user"
import getUserProfileUrl from "@/libs/api/client/user/get-user-profile"
import { useUserStore } from "@/store/useUserStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mapAuthUserToStore } from "../login.service"

export interface LoginFormDataProps {
  email: string
  password: string
}

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUserId, setUserData } = useUserStore()

  return useMutation({
    mutationKey: ["login"],
    mutationFn: ({ email, password }: LoginFormDataProps) =>
      logIn(email, password),
    onSuccess: async ({ user }) => {
      if (!user) {
        toast.error("사용자의 ID를 찾을 수 없습니다.")
        return
      }

      toast.success("로그인에 성공했습니다.")

      // 1) store 셋팅
      setUserId(user.id)
      setUserData(mapAuthUserToStore(user))

      // 2) 프로필 URL 미리 캐싱(선택)
      await queryClient.prefetchQuery({
        queryKey: ["profileImageUrl", user.id],
        queryFn: () => getUserProfileUrl(user.id),
      })

      // 3) 이동
      router.push("/")
    },
    onError: (error: Error) => {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("로그인에 실패했습니다.")
    },
  })
}
