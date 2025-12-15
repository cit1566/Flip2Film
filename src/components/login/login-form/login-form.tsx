"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import styles from "./login-form.module.css"

interface LoginFormValues {
  email: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onChange",
  })

  const emailValue = watch("email") ?? ""
  const passwordValue = watch("password") ?? ""

  const isAnyFilled =
    emailValue.trim().length > 0 || passwordValue.trim().length > 0

  const onSubmit = (_data: LoginFormValues) => {
    // console.log("로그인 요청:", data)
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="이메일"
        type="email"
        placeholder="example@example.com"
        clearable
        {...register("email", {
          required: "이메일을 입력해주세요",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "올바른 이메일 형식이 아닙니다",
          },
        })}
        value={emailValue}
        onChange={e =>
          setValue("email", e.target.value, { shouldValidate: true })
        }
        onClear={() => setValue("email", "", { shouldValidate: true })}
        status={errors.email ? "error" : "default"}
      />

      {errors.email && (
        <p className={styles.errorMessage}>{errors.email.message}</p>
      )}

      <Input
        label="비밀번호"
        type="password"
        placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
        togglePassword
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          pattern: {
            value:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,}$/,
            message: "영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다",
          },
        })}
        value={passwordValue}
        onChange={e =>
          setValue("password", e.target.value, { shouldValidate: true })
        }
        status={errors.password ? "error" : "default"}
      />

      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <Button
        variant="green"
        title={isSubmitting ? "로그인 중..." : "로그인"}
        type="submit"
        disabled={!isAnyFilled || isSubmitting}
        className={styles.loginFormSubmitButton}
      />

      <div className={styles.loginFormBottomLinks}>
        <Link href="/auth/sign-up" className={styles.loginFormLink}>
          회원가입
        </Link>

        <span className={styles.loginFormSeparator}>/</span>

        <Link href="/auth/forgot" className={styles.loginFormLink}>
          비밀번호 찾기
        </Link>
      </div>
    </form>
  )
}
