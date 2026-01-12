"use client"

import SocialSignupForm from "@/components/social-signup-form/social-signup-form"
import type { UserUpdate } from "@/libs/supabase/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import createClient from "../../../libs/supabase/client"
import styles from "./page.module.css"

type SocialProfileFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

const supabase = createClient()

async function checkNicknameDuplicate(value: string | null | undefined) {
  if (!value || value.length < 2) return true

  const res = await fetch(
    `/api/user/nickname/check?nickname=${encodeURIComponent(value)}`
  )
  if (!res.ok) return "닉네임 확인 중 오류가 발생했습니다"
  const data = (await res.json()) as { ok: boolean; message?: string }

  return data.ok ? true : (data.message ?? "이미 사용 중인 닉네임입니다")
}

async function uploadProfileImageSigned(file: File): Promise<string> {
  // 확장자 결정(간단)
  const ext = file.type === "image/png" ? "png" : "jpg"

  // 1) 서버에서 signed upload 토큰 발급
  const r = await fetch("/api/storage/profile/signed-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ext }),
  })
  if (!r.ok) {
    const msg = await r.text()
    throw new Error(`signed upload 준비 실패: ${msg}`)
  }

  const { filePath, token } = (await r.json()) as {
    filePath: string
    token: string
  }

  // 2) 클라이언트에서 스토리지로 직접 업로드
  // signed upload 흐름은 Supabase가 제공하는 방식
  const { error } = await supabase.storage
    .from("profile_image")
    .uploadToSignedUrl(filePath, token, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

  if (error) throw new Error(error.message)
  return filePath
}

async function completeProfileOnServer(payload: {
  nickname: string | null | undefined
  bio: string | null | undefined
  profile_image: string | null
}) {
  const res = await fetch("/api/user/social-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "프로필 저장 실패")
  }

  return res.json()
}

export default function SocialProfileClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const socialSignupMutation = useMutation({
    mutationKey: ["social-profile-signup"],
    mutationFn: async (form: SocialProfileFormData) => {
      const { nickname, bio, profile_image } = form

      let imagePath: string | null = null
      if (profile_image instanceof File) {
        imagePath = await uploadProfileImageSigned(profile_image)
      }

      await completeProfileOnServer({
        nickname: nickname ?? "익명",
        bio: bio ?? null,
        profile_image: imagePath,
      })

      return true
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      toast.success("간편 회원가입이 완료되었습니다")
      router.replace("/")
    },
    onError: (err: unknown) => {
      const e = err as { message?: string }
      toast.error(`간편 회원가입 실패: ${e.message ?? "Unknown error"}`)
    },
  })

  return (
    <div className={styles.wrap}>
      <SocialSignupForm
        socialSignupMutation={socialSignupMutation}
        checkNicknameDuplicate={checkNicknameDuplicate}
      />
    </div>
  )
}
