"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import styles from "./sign-up-form.module.css"

interface SignUpFormValues {
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
}

export default function SignUpForm() {
  const [_profileImage, setProfileImage] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignUpFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      bio: "",
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

  async function onSubmit(_data: SignUpFormValues) {
    //
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileUpload onChange={setProfileImage} />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "이메일을 입력해주세요",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "올바른 이메일 형식이 아닙니다",
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            clearable
            value={field.value ?? ""}
            onChange={field.onChange}
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

      {isSubmitted && errors.email && (
        <p className={styles.errorMessage}>{errors.email.message}</p>
      )}

      <Controller
        name="password"
        control={control}
        rules={{
          required: "비밀번호를 입력해주세요",
          pattern: {
            value:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,}$/,
            message: "영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다",
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            label="비밀번호"
            type="password"
            placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
            togglePassword
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

      {isSubmitted && errors.password && (
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

      {isSubmitted && errors.passwordCheck && (
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

      {isSubmitted && errors.nickname && (
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
        disabled={!errors || isSubmitting}
      />
    </form>
  )
}
