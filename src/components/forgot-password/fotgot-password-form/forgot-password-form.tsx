"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { CheckCircle2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { resetPasswordEmail } from "../../../libs/api/client/user"
import styles from "./forgot-password-form.module.css"

export const ForgotPasswordForm = () => {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isValidating },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "" },
  })

  const handleForgotSubmit = async (data: { email: string }) => {
    try {
      await resetPasswordEmail(data.email)
      setIsSuccess(true)

      toast.success("비밀번호 재설정 메일이 전송되었습니다")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "이메일 전송에 실패했습니다"
      )
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.successWrapper}>
        <header className={styles.header}>
          <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
            <CheckCircle2
              size={48}
              strokeWidth={1.5}
              className={styles.CheckCircle2Icon}
            />
          </div>
          <h2 className={styles.title}>비밀번호 재설정 링크 전송</h2>
          <p className={styles.description}>
            입력하신 주소로 비밀번호 재설정 링크를 보냈습니다
            <br />
            메일이 오지 않았다면 스팸함도 확인해주세요
          </p>
        </header>

        <Button
          variant="green"
          title="로그인으로 이동하기"
          onClick={() => router.push("/login")}
          className={styles.submitButton}
        />
      </div>
    )
  }

  return (
    <form
      className={styles.forgotForm}
      onSubmit={handleSubmit(handleForgotSubmit)}
    >
      <header className={styles.header}>
        <Mail size={48} strokeWidth={1.5} className={styles.mailIcon} />
        <h2 className={styles.title}>
          기존에 가입한 이메일로
          <br /> 비밀번호를 찾아보세요
        </h2>
      </header>

      <div className={styles.inputWrapper}>
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
              placeholder="example@example.com"
              clearable
              onClear={() => field.onChange("")}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              status={
                fieldState.error
                  ? "error"
                  : fieldState.isTouched
                    ? "success"
                    : "default"
              }
            />
          )}
        />
        {errors.email && (
          <p className={styles.errorMessage}>
            {errors.email.message as string}
          </p>
        )}
      </div>

      <Button
        variant="green"
        title={isSubmitting ? "전송 중..." : "전송하기"}
        type="submit"
        disabled={!isValid || isSubmitting || isValidating}
        className={styles.submitButton}
      />
    </form>
  )
}
