"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import { checkNicknameValidate } from "@/libs/api/auth/auth-api"
import { updateUser, getUser } from "@/libs/api/user/user-api"
import createClient from "@/libs/supabase/client"
import type { UserUpdate } from "@/libs/supabase/types"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./page.module.css"

type socialSignUpFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

export default function SocialPage() {
  const router = useRouter()
  const isSubmittingRef = useRef(false)
  const supabaseClient = createClient()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm<socialSignUpFormData>({
    mode: "onChange",
    defaultValues: {
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  useEffect(() => {
    const checkUserStatus = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser()

      if (!user) return

      try {
        const userData = await getUser(user.id)
        if (userData?.nickname && userData.nickname !== "익명") {
          toast.info("이미 존재하는 사용자 입니다")
          router.replace("/")
        }
      } catch {
        toast.error("인증 과정 중, 에러가 발생했습니다")
      }
    }
    checkUserStatus()
  }, [router, supabaseClient.auth])

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

  const handleSignUpSubmit = async (data: socialSignUpFormData) => {
    if (isSubmittingRef.current) return

    try {
      isSubmittingRef.current = true
      const {
        data: { user },
      } = await supabaseClient.auth.getUser()

      if (!user) {
        toast.error("로그인 정보가 없습니다")
        return
      }

      const { nickname, bio, profile_image } = data
      let imagePath = null

      if (profile_image instanceof File) {
        const fileExt = profile_image.name.split(".").pop()
        const filePath = `${user.id}/profile.${fileExt}`
        const { error: uploadError } = await supabaseClient.storage
          .from("profile_image")
          .upload(filePath, profile_image, { upsert: true })
        if (uploadError) throw uploadError
        imagePath = filePath
      }

      await updateUser(user.id, {
        nickname: nickname ?? "익명",
        bio: bio ?? null,
        profile_image: imagePath,
      })

      toast.success("프로필 설정이 완료되었습니다")
      router.replace("/")
    } catch {
      toast.error("프로필 저장에 실패했습니다")
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignUpSubmit)}
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
        variant="green"
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={(isSubmitted && !isValid) || isSubmitting}
      />
    </form>
  )
}
