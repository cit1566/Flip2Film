"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { VALIDATION_PATTERNS } from "@/utils/commonConstants/validation"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { getInputStatus } from "../../../utils"
import { useLogin } from "./hooks/use-login"
import styles from "./login-form.module.css"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
  const loginMutation = useLogin()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValidating, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data)
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="example@example.com"
            clearable
            value={field.value}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            onClear={() => field.onChange("")}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value
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
            value={field.value}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            status={getInputStatus(
              fieldState.isTouched,
              Boolean(fieldState.error),
              field.value
            )}
          />
        )}
      />

      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <Button
        variant="green"
        title={isSubmitting ? "로그인 중..." : "로그인"}
        type="submit"
        disabled={!isValid || isSubmitting || isValidating}
        className={styles.loginFormSubmitButton}
      />

      <div className={styles.loginFormBottomLinks}>
        <Link href="/sign-up" className={styles.loginFormLink}>
          회원가입
        </Link>

        <span className={styles.loginFormSeparator}>/</span>

        <Link href="/forgot" className={styles.loginFormLink}>
          비밀번호 찾기
        </Link>
      </div>
    </form>
  )
}
