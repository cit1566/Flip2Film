"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { updatePassword } from "@/libs/api/user/user-api"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./update-password-form.module.css"

export const UpdatePasswordForm = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValidating, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = watch("password")

  const handleUpdateSubmit = async (data: { password: string }) => {
    try {
      await updatePassword(data.password)

      toast.success("비밀번호가 성공적으로 변경되었습니다")
      router.push("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "비밀번호 변경 실패")
    }
  }

  return (
    <form
      className={styles.updateForm}
      onSubmit={handleSubmit(handleUpdateSubmit)}
    >
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "비밀번호를 입력해주세요",
              pattern: VALIDATION_PATTERNS.password,
            }}
            render={({ field, fieldState }) => (
              <Input
                label="새 비밀번호"
                type="password"
                placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
                togglePassword
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
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "비밀번호를 다시 입력해주세요",
              validate: value =>
                value === passwordValue || "비밀번호가 일치하지 않습니다",
            }}
            render={({ field, fieldState }) => (
              <Input
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 입력하세요"
                togglePassword
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
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="green"
        title={isSubmitting ? "변경 중..." : "변경하기"}
        type="submit"
        disabled={!isValid || isSubmitting || isValidating}
        className={styles.submitButton}
      />
    </form>
  )
}
