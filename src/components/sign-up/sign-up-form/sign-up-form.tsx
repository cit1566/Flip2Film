"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import { useState } from "react"
import { useForm } from "react-hook-form"
import styles from "./sign-up-form.module.css"

interface SignUpFormValues {
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
}

export default function SignUpForm() {
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    mode: "onChange",
  })

  const emailValue = watch("email") ?? ""
  const passwordValue = watch("password") ?? ""
  const passwordCheckValue = watch("passwordCheck") ?? ""
  const nicknameValue = watch("nickname") ?? ""
  const bioValue = watch("bio") ?? ""

  const isAnyFilled =
    emailValue ||
    passwordValue ||
    passwordCheckValue ||
    nicknameValue ||
    bioValue

  const getStatus = (
    field: keyof SignUpFormValues,
    isValidCondition?: boolean
  ) => {
    const value = watch(field)
    const hasError = errors[field]

    if (hasError) return "error"
    if (value && isValidCondition) return "success"

    return "default"
  }

  const onSubmit = async (_data: SignUpFormValues) => {
    // console.log("회원가입 요청:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileUpload onChange={setProfileImage} />

      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
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
        status={getStatus(
          "email",
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
        )}
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
        status={getStatus(
          "password",
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,}$/.test(
            passwordValue
          )
        )}
      />

      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <Input
        label="비밀번호 재입력"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        togglePassword
        {...register("passwordCheck", {
          required: "비밀번호 확인을 입력해주세요",
          validate: value =>
            value === passwordValue || "비밀번호가 일치하지 않습니다",
        })}
        value={passwordCheckValue}
        onChange={e =>
          setValue("passwordCheck", e.target.value, { shouldValidate: true })
        }
        status={getStatus(
          "passwordCheck",
          passwordCheckValue === passwordValue
        )}
      />

      {errors.passwordCheck && (
        <p className={styles.errorMessage}>{errors.passwordCheck.message}</p>
      )}

      <Input
        label="닉네임"
        type="text"
        placeholder="최소 2자, 최대 6자"
        {...register("nickname", {
          required: "닉네임을 입력해주세요",
          minLength: { value: 2, message: "닉네임은 최소 2자입니다" },
          maxLength: { value: 6, message: "닉네임은 최대 6자입니다" },
        })}
        value={nicknameValue}
        onChange={e =>
          setValue("nickname", e.target.value, { shouldValidate: true })
        }
        status={getStatus(
          "nickname",
          nicknameValue.length >= 2 && nicknameValue.length <= 6
        )}
      />

      {errors.nickname && (
        <p className={styles.errorMessage}>{errors.nickname.message}</p>
      )}

      <Input
        label="Bio"
        type="text"
        placeholder="자기소개를 입력해주세요"
        {...register("bio")}
        value={bioValue}
        onChange={e => setValue("bio", e.target.value)}
      />

      <TermsText />

      <Button
        variant="green"
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={!isAnyFilled || isSubmitting}
      />
    </form>
  )
}
