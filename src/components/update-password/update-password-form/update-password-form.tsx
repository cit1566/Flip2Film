"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { LockIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { updatePassword } from "../../../libs/api/client/user"
import styles from "./update-password-form.module.css"

export const UpdatePasswordForm = () => {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

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

      setIsSuccess(true)
      toast.success("비밀번호가 성공적으로 변경되었습니다")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "비밀번호 변경 실패")
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.successWrapper}>
        <header className={styles.header}>
          <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
            <LockIcon size={48} strokeWidth={1.5} className={styles.lockIcon} />
          </div>
          <h2 className={styles.title}>비밀번호 변경 완료</h2>
          <p className={styles.description}>
            새로운 비밀번호로 안전하게 변경되었습니다
            <br />
            다시 로그인하여 서비스를 이용해 주세요
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
