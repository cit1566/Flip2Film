"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import {
  checkEmailValidate,
  checkNicknameValidate,
} from "@/libs/api/auth/auth-api"
import createUser from "@/libs/api/user/user-api"
import type { UserInsert } from "@/libs/supabase/types"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./sign-up-form.module.css"

interface AuthError {
  code?: string
  status?: number
  message: string
}

type SignUpFormData = Pick<UserInsert, "email" | "nickname" | "bio"> & {
  password: string
  passwordCheck: string
  profile_image: File | null
}

export default function SignUpForm() {
  const router = useRouter()
  const isSubmittingRef = useRef(false)

  const DB_ERROR_CODES = {
    UNIQUE_VIOLATION: "23505",
  }

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting, isValidating, isValid },
  } = useForm<SignUpFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  const handleInputStatus = (
    isTouched: boolean,
    hasError: boolean,
    value: string
  ) => {
    if (hasError) return "error"
    if (isTouched && value.trim().length > 0) return "success"
    return "default"
  }

  const checkEmailDuplicate = async (value: string | null | undefined) => {
    if (!value || !VALIDATION_PATTERNS.email.value.test(value)) return true

    try {
      const isExists = await checkEmailValidate(value)
      return isExists ? "이미 가입된 사용자 입니다" : true
    } catch {
      return "이메일 확인 중 오류가 발생했습니다"
    }
  }

  const checkNicknameDuplicate = async (value: string | null | undefined) => {
    if (!value || value.length < 2) return true
    try {
      const isExists = await checkNicknameValidate(value)
      return isExists ? "이미 사용 중인 닉네임 입니다" : true
    } catch {
      return "닉네임 확인 중 오류가 발생했습니다"
    }
  }

  const handleSignUpSubmit = async (data: SignUpFormData) => {
    if (isSubmittingRef.current) return

    try {
      isSubmittingRef.current = true
      const { email, password, nickname, bio, profile_image } = data

      await createUser({
        email,
        password,
        nickname,
        bio,
        profile_image,
      })

      toast.success("회원가입 완료! 이메일 인증 후 로그인해주세요")
      router.push("/auth/login")
    } catch (err: unknown) {
      const error = err as AuthError
      const errorCode = error?.code ?? ""
      const errorMessage = error?.message?.toLowerCase() ?? ""

      if (errorCode === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        if (errorMessage.includes("email")) {
          toast.info("이미 가입된 이메일입니다")
          router.push("/auth/login")
          return
        }
        if (errorMessage.includes("nickname")) {
          setError(
            "nickname",
            { type: "manual", message: "이미 사용 중인 닉네임 입니다" },
            { shouldFocus: true }
          )
          return
        }
      }

      toast.error(error.message ?? "회원가입에 실패했습니다")
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignUpSubmit)}>
      <Controller
        name="profile_image"
        control={control}
        render={({ field }) => (
          <ProfileUpload
            value={field.value}
            onChange={(file: File | null) => field.onChange(file)}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "이메일을 입력해주세요",
          pattern: VALIDATION_PATTERNS.email,
          validate: checkEmailDuplicate,
        }}
        render={({ field, fieldState }) => (
          <div>
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              clearable
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              onClear={() => field.onChange("")}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: "비밀번호를 입력해주세요",
          pattern: VALIDATION_PATTERNS.password,
        }}
        render={({ field, fieldState }) => (
          <div>
            <Input
              label="비밀번호"
              type="password"
              placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
              togglePassword
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="passwordCheck"
        control={control}
        rules={{
          required: "비밀번호 확인을 입력해주세요",
          validate: value =>
            value === getValues("password") || "비밀번호가 일치하지 않습니다",
        }}
        render={({ field, fieldState }) => (
          <div>
            <Input
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              togglePassword
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.passwordCheck && (
              <p className={styles.errorMessage}>
                {errors.passwordCheck.message}
              </p>
            )}
          </div>
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
              clearable
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onClear={() => field.onChange("")}
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
            clearable
            value={field.value ?? ""}
            onChange={e => field.onChange(e.target.value)}
            onClear={() => field.onChange("")}
            onBlur={field.onBlur}
          />
        )}
      />

      <TermsText />

      <Button
        variant="green"
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={!isValid || isSubmitting || isValidating}
      />
    </form>
  )
}
