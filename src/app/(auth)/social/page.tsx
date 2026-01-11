"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import { checkNicknameValidate } from "@/libs/api/auth/auth-api"
import { getUser, updateUser, uploadProfileImage } from "@/libs/api/user"
import { getBrowserUser } from "@/libs/api/user/session"
import type { UserUpdate } from "@/libs/supabase/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./page.module.css"

type SocialProfileFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

export default function SocialProfilePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
  } = useForm<SocialProfileFormData>({
    mode: "onChange",
    defaultValues: {
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  // 로그인 상태 확인
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await getBrowserUser()
        if (!user) {
          router.replace("/login")
          return
        }
        const userData = await getUser(user.id)
        if (userData?.nickname && userData.nickname !== "익명") {
          toast.success("로그인이 성공했습니다")
          router.replace("/")
          return
        }

        setIsChecking(false)
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string }
        if (error.code === "PGRST116") {
          setIsChecking(false)
        } else {
          toast.error(
            error.message ?? "사용자 정보를 확인하는 중 오류가 발생했습니다"
          )
          router.replace("/login")
        }
      }
    }
    checkUserStatus()
  }, [router])

  const handleInputStatus = (
    isTouched: boolean,
    hasError: boolean,
    value: string
  ) => {
    if (hasError) return "error"
    if (isTouched && value.trim().length > 0) return "success"
    return "default"
  }

  const checkNicknameDuplicate = async (value: string | null | undefined) => {
    if (!value || value.length < 2) return true
    try {
      const isExists = await checkNicknameValidate(value)
      return isExists ? "이미 사용 중인 닉네임입니다" : true
    } catch {
      return "닉네임 확인 중 오류가 발생했습니다"
    }
  }

  // ✅ 간편 회원가입 mutation
  const socialSignupMutation = useMutation({
    mutationKey: ["social-profile-signup"],
    mutationFn: async (form: SocialProfileFormData) => {
      const user = await getBrowserUser()

      if (!user) throw new Error("로그인 정보가 없습니다")

      // 이미 프로필 세팅 완료된 사용자면 바로 종료
      const existingUser = await getUser(user.id).catch(err => {
        if (err?.code === "PGRST116") return null
        throw err
      })

      if (existingUser?.nickname && existingUser.nickname !== "익명") {
        return { alreadyCompleted: true, userId: user.id }
      }

      const { nickname, bio, profile_image } = form
      let imagePath: string | null = null

      if (profile_image instanceof File) {
        const { filePath } = await uploadProfileImage(user.id, profile_image)
        imagePath = filePath
      }

      await updateUser(user.id, {
        nickname: nickname ?? "익명",
        bio: bio ?? null,
        profile_image: imagePath,
      })

      return { alreadyCompleted: false, userId: user.id }
    },
    onSuccess: async result => {
      if (result.alreadyCompleted) {
        toast.info("로그인이 성공했습니다")
      } else {
        await queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        toast.success("간편 회원가입이 완료되었습니다")
      }
      router.replace("/")
    },
    onError: (err: unknown) => {
      const e = err as { message?: string }
      toast.error(
        `간편 회원가입에 실패했습니다: ${e?.message ?? "Unknown error"}`
      )
    },
  })

  if (isChecking) {
    return (
      <div className={styles.checkingWrap} role="status" aria-live="polite">
        <div className={styles.checkingCard}>
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.checkingTitle}>로그인 상태 확인 중…</p>
          <p className={styles.checkingSub}>잠시만 기다려주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(async form => {
        try {
          await socialSignupMutation.mutateAsync(form)
        } catch {
          // onError에서 처리
        }
      })}
      className={styles.container}
    >
      <h1 className={styles.title}>간편 회원가입</h1>

      <Controller
        name="profile_image"
        control={control}
        render={({ field }) => (
          <ProfileUpload value={field.value} onChange={field.onChange} />
        )}
      />

      <Controller
        name="nickname"
        control={control}
        rules={{
          required: "닉네임을 입력해주세요",
          minLength: { value: 2, message: "닉네임은 최소 2자입니다" },
          maxLength: { value: 6, message: "닉네임은 최대 6자입니다" },
          validate: checkNicknameDuplicate,
        }}
        render={({ field, fieldState }) => (
          <div>
            <Input
              label="닉네임"
              placeholder="최소 2자, 최대 6자"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.nickname && (
              <p className={styles.errorMessage}>{errors.nickname.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <Input
            label="Bio"
            placeholder="자기소개를 입력해주세요"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <Button
        className={styles.submitButton}
        variant="green"
        title={socialSignupMutation.isPending ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={(isSubmitted && !isValid) || socialSignupMutation.isPending}
      />
    </form>
  )
}
