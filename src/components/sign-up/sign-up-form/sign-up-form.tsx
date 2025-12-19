"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import supabase from "@/libs/supabase/client"
import type { SignUpFormValues } from "@/types/forms/auth.ts"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import router from "next/router"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./sign-up-form.module.css"

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm<SignUpFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  function getInputStatus(
    isTouched: boolean,
    hasError: boolean,
    value: string
  ) {
    if (hasError) return "error"
    if (isTouched && value.trim().length > 0) return "success"
    return "default"
  }

  async function onSubmit(data: SignUpFormValues) {
    const { password, email, nickname, bio } = data
    const client = supabase()

    if (typeof email !== "string") {
      return
    }

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          bio,
        },
      },
    })

    if (authError) {
      if (authError.message.includes("already")) {
        toast.error("이미 가입된 이메일입니다")
      } else {
        toast.error("회원가입에 실패했습니다")
      }
      return
    }

    const userId = authData.user?.id
    if (!userId) {
      toast.error("회원가입 처리 중 오류가 발생했습니다")
      return
    }

    const { error: insertError } = await client.from("user").insert({
      id: userId,
      email,
      nickname,
      bio,
    })

    if (insertError) {
      toast.error("회원 정보 저장에 실패했습니다")
      return
    }

    toast.success("회원가입이 완료되었습니다")
    router.push("/auth/login")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="profile_image"
        control={control}
        render={({ field }) => (
          <ProfileUpload
            onChange={file => field.onChange(file)}
            value={field.value}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "이메일을 입력해주세요",
          pattern: VALIDATION_PATTERNS.email,
        }}
        render={({ field, fieldState }) => (
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            clearable
            value={field.value ?? ""}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            onClear={() => field.onChange("")}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value ?? ""
            )}
          />
        )}
      />

      {errors.email && (
        <p className={styles.errorMessage}>{errors.email.message}</p>
      )}

      <Controller
        name="password"
        control={control}
        rules={{
          required: "비밀번호를 입력해주세요",
          pattern: VALIDATION_PATTERNS.password,
        }}
        render={({ field, fieldState }) => (
          <Input
            label="비밀번호"
            type="password"
            placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
            togglePassword
            value={field.value ?? ""}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value ?? ""
            )}
          />
        )}
      />

      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <Controller
        name="passwordCheck"
        control={control}
        rules={{
          required: "비밀번호 확인을 입력해주세요",
          validate: value =>
            value === getValues("password") || "비밀번호가 일치하지 않습니다",
        }}
        render={({ field, fieldState }) => (
          <Input
            label="비밀번호 재입력"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            togglePassword
            value={field.value ?? ""}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value ?? ""
            )}
          />
        )}
      />

      {errors.passwordCheck && (
        <p className={styles.errorMessage}>{errors.passwordCheck.message}</p>
      )}

      <Controller
        name="nickname"
        control={control}
        rules={{
          required: "닉네임을 입력해주세요",
          minLength: { value: 2, message: "닉네임은 최소 2자입니다" },
          maxLength: { value: 6, message: "닉네임은 최대 6자입니다" },
        }}
        render={({ field, fieldState }) => (
          <Input
            label="닉네임"
            type="text"
            placeholder="최소 2자, 최대 6자"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value ?? ""
            )}
          />
        )}
      />

      {errors.nickname && (
        <p className={styles.errorMessage}>{errors.nickname.message}</p>
      )}

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <Input
            label="Bio"
            type="text"
            placeholder="자기소개를 입력해주세요"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <TermsText />

      <Button
        variant="green"
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={isSubmitting || (isSubmitted && !isValid)}
      />
    </form>
  )
}
