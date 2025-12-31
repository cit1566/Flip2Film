"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import { checkNicknameValidate } from "@/libs/api/auth/auth-api"
import { updateUser, getUser, supabase } from "@/libs/api/user/user-api"
import type { UserUpdate } from "@/libs/supabase/types"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./page.module.css"

type SocialProfileFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

export default function SocialProfilePage() {
  const router = useRouter()
  const isSubmittingRef = useRef(false)
  const [isChecking, setIsChecking] = useState(true)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm<SocialProfileFormData>({
    mode: "onChange",
    defaultValues: {
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

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

  const handleSignuSubmit = async (data: SocialProfileFormData) => {
    if (isSubmittingRef.current) return

    try {
      isSubmittingRef.current = true
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("로그인 정보가 없습니다")
        return
      }

      const existingUser = await getUser(user.id).catch(() => null)
      if (existingUser?.nickname && existingUser.nickname !== "익명") {
        toast.info("로그인이 성공했습니다")
        router.replace("/")
        return
      }

      const { nickname, bio, profile_image } = data
      let imagePath = null

      if (profile_image instanceof File) {
        const fileExt = profile_image.name.split(".").pop() ?? "png"
        const filePath = `${user.id}/profile.${fileExt}`

        const { error: uploadError } = await supabase.storage
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

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] })

      toast.success("간편 회원가입이 완료되었습니다")
      router.replace("/")
    } catch {
      toast.error("간편 회원가입에 실패했습니다")
    } finally {
      isSubmittingRef.current = false
    }
  }

  if (isChecking) return null

  return (
    <form
      onSubmit={handleSubmit(handleSignuSubmit)}
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
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={(isSubmitted && !isValid) || isSubmitting}
      />
    </form>
  )
}
