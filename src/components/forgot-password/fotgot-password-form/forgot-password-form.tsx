"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { resetPasswordEmail } from "@/libs/api/user/user-api"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { Mail } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./forgot-password-form.module.css"

export const ForgotPasswordForm = () => {
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

      toast.success("비밀번호 재설정 메일이 전송되었습니다")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "이메일 전송에 실패했습니다"
      )
    }
  }

  return (
    <form
      className={styles.forgotForm}
      onSubmit={handleSubmit(handleForgotSubmit)}
    >
      <header className={styles.header}>
        <Mail size={32} strokeWidth={2} className={styles.mailIcon} />
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
