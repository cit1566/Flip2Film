import type { UseMutationResult } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import type { UserUpdate } from "../../libs/supabase/types"
import Button from "../atom/button/button"
import Input from "../atom/input/input"
import ProfileUpload from "../atom/profile-upload/profile-upload"
import styles from "./social-signup-form.module.css"

type SocialProfileFormData = Pick<UserUpdate, "nickname" | "bio"> & {
  profile_image: File | null
}

interface SocialSignupFormProps {
  socialSignupMutation: UseMutationResult<
    boolean,
    unknown,
    SocialProfileFormData,
    unknown
  >
  checkNicknameDuplicate: (
    value: string | null | undefined
  ) => Promise<string | true>
}

export default function SocialSignupForm({
  socialSignupMutation,
  checkNicknameDuplicate,
}: SocialSignupFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
  } = useForm<SocialProfileFormData>({
    mode: "onChange",
    defaultValues: {
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

  return (
    <form
      onSubmit={handleSubmit(async form => {
        try {
          await socialSignupMutation.mutateAsync(form)
        } catch {
          // onError에서 처리
        }
      })}
      className={styles.container}
    >
      <h1 className={styles.title}>간편 회원가입</h1>

      <Controller
        name="profile_image"
        control={control}
        render={({ field }) => (
          <ProfileUpload value={field.value} onChange={field.onChange} />
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
              value={field.value ?? ""}
              onChange={field.onChange}
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
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <Button
        className={styles.submitButton}
        variant="green"
        title={socialSignupMutation.isPending ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={(isSubmitted && !isValid) || socialSignupMutation.isPending}
      />
    </form>
  )
}
