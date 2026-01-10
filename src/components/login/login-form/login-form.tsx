"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import { useUserStore } from "@/store/useUserStore"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { logIn } from "../../../libs/api/user"
import getUserProfileUrl from "../../../libs/api/user/get-user-profile"
import styles from "./login-form.module.css"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
  const router = useRouter()
  const { setUserId, setUserData } = useUserStore()
  const queryClient = useQueryClient()

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

  function getInputStatus(
    isTouched: boolean,
    hasError: boolean,
    value: string
  ) {
    if (hasError) return "error"
    if (isTouched && value.trim().length > 0) return "success"
    return "default"
  }

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) =>
      await logIn(email, password),
    onSuccess: async ({ user }) => {
      if (!user) toast.error("사용자의 ID를 찾을 수 없습니다.")
      else {
        toast.success("로그인에 성공했습니다.")
        router.push("/")
        setUserId(user.id)

        setUserData({
          bio: (user.user_metadata?.bio as string | null) ?? null,
          email: user.email ?? null, // ✅ email은 여기
          id: user.id, // ✅ id는 여기
          nickname: (user.user_metadata?.nickname as string) ?? "",
          profile_image:
            (user.user_metadata?.profile_image as string | null) ?? null,
        })

        await queryClient.prefetchQuery({
          queryKey: ["profileImageUrl", user.id],
          queryFn: async () => await getUserProfileUrl(user.id),
        })
      }
    },
    onError: error => {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("로그인에 실패했습니다.")
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
