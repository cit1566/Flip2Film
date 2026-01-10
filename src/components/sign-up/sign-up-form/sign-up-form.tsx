"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import {
  checkEmailValidate,
  checkNicknameValidate,
} from "@/libs/api/auth/auth-api"
import type { UserInsert } from "@/libs/supabase/types"
import { VALIDATION_PATTERNS } from "@/utils/validation"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { createUser } from "../../../libs/api/user"
import styles from "./sign-up-form.module.css"

/**
 * Supabase / DB 에러 타입 (필요한 것만 최소 정의)
 */
interface AuthError {
  code?: string
  status?: number
  message: string
  details?: string
  hint?: string
}

/**
 * 회원가입 폼에서 실제로 사용하는 데이터 타입
 * (DB insert 타입 + UI 전용 필드)
 */
type SignUpFormData = Pick<UserInsert, "email" | "nickname" | "bio"> & {
  password: string
  passwordCheck: string
  profile_image: File | null
}

export default function SignUpForm() {
  const router = useRouter()

  /**
   * 중복 submit 방지용 ref
   * - react-hook-form의 isSubmitting은 비동기 타이밍에 취약할 수 있음
   * - 서버 요청 중 버튼 연타 방지 목적
   */
  const isSubmittingRef = useRef(false)

  /** 회원가입 성공 여부 (성공 화면 전환용) */
  const [isSuccess, setIsSuccess] = useState(false)

  /**
   * Postgres 에러 코드 상수
   * - 23505: UNIQUE 제약조건 위반
   */
  const DB_ERROR_CODES = {
    UNIQUE_VIOLATION: "23505",
  }

  /**
   * react-hook-form 설정
   */
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting, isValidating, isValid },
  } = useForm<SignUpFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  /**
   * Input 상태 계산 (UI용)
   */
  const handleInputStatus = (
    isTouched: boolean,
    hasError: boolean,
    value: string
  ) => {
    if (hasError) return "error"
    if (isTouched && value.trim().length > 0) return "success"
    return "default"
  }

  /**
   * 이메일 중복 검사
   * - 형식이 맞지 않으면 검사하지 않음
   * - true: 통과
   * - string: 에러 메시지
   */
  const checkEmailDuplicate = async (value?: string | null) => {
    if (!value || !VALIDATION_PATTERNS.email.value.test(value)) return true

    try {
      const isExists = await checkEmailValidate(value)
      return isExists ? "이미 가입된 사용자 입니다" : true
    } catch {
      return "이메일 확인 중 오류가 발생했습니다"
    }
  }

  /**
   * 닉네임 중복 검사
   */
  const checkNicknameDuplicate = async (value?: string | null) => {
    if (!value || value.length < 2) return true

    try {
      const isExists = await checkNicknameValidate(value)
      return isExists ? "이미 사용 중인 닉네임 입니다" : true
    } catch {
      return "닉네임 확인 중 오류가 발생했습니다"
    }
  }

  /**
   * 회원가입 submit 핸들러
   */
  const handleSignUpSubmit = async (data: SignUpFormData) => {
    if (isSubmittingRef.current) return

    try {
      isSubmittingRef.current = true

      const { email, password, nickname, bio, profile_image } = data

      // 사용자 생성 (Auth + public.user)
      await createUser({
        email,
        password,
        nickname,
        bio,
        profile_image,
      })

      setIsSuccess(true)
      toast.success("회원가입 완료!")
    } catch (err: unknown) {
      const error = err as AuthError
      const errorCode = error?.code ?? ""

      /**
       * DB UNIQUE 에러 분기 처리
       */
      if (errorCode === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        const errorDetail = (
          error?.details ??
          error?.message ??
          ""
        ).toLowerCase()

        if (errorDetail.includes("email")) {
          toast.info("이미 가입된 이메일입니다")
          router.push("/login")
          return
        }

        if (errorDetail.includes("nickname")) {
          setError(
            "nickname",
            { type: "manual", message: "이미 사용 중인 닉네임 입니다" },
            { shouldFocus: true }
          )
          return
        }
      }

      toast.error(error.message ?? "회원가입에 실패했습니다")
    } finally {
      isSubmittingRef.current = false
    }
  }

  /**
   * 회원가입 성공 화면
   */
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
          <h2 className={styles.title}>회원가입이 완료되었습니다</h2>
          <p className={styles.description}>
            입력하신 이메일로 인증 링크를 보냈습니다
            <br />
            메일 인증 후 서비스 이용이 가능합니다
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

  /**
   * 회원가입 폼
   */
  return (
    <form
      className={styles.signUpForm}
      onSubmit={handleSubmit(handleSignUpSubmit)}
    >
      {/* 프로필 이미지 */}
      <Controller
        name="profile_image"
        control={control}
        render={({ field }) => (
          <ProfileUpload
            value={field.value}
            onChange={(file: File | null) => field.onChange(file)}
          />
        )}
      />

      {/* 이메일 */}
      <Controller
        name="email"
        control={control}
        rules={{
          required: "이메일을 입력해주세요",
          pattern: VALIDATION_PATTERNS.email,
          validate: checkEmailDuplicate,
        }}
        render={({ field, fieldState }) => (
          <div className={styles.inputWrapper}>
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              clearable
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              onClear={() => field.onChange("")}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
        )}
      />

      {/* 비밀번호 */}
      <Controller
        name="password"
        control={control}
        rules={{
          required: "비밀번호를 입력해주세요",
          pattern: VALIDATION_PATTERNS.password,
        }}
        render={({ field, fieldState }) => (
          <div className={styles.inputWrapper}>
            <Input
              label="비밀번호"
              type="password"
              placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
              togglePassword
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
        )}
      />

      {/* 비밀번호 확인 */}
      <Controller
        name="passwordCheck"
        control={control}
        rules={{
          required: "비밀번호 확인을 입력해주세요",
          validate: value =>
            value === getValues("password") || "비밀번호가 일치하지 않습니다",
        }}
        render={({ field, fieldState }) => (
          <div className={styles.inputWrapper}>
            <Input
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              togglePassword
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              status={handleInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {errors.passwordCheck && (
              <p className={styles.errorMessage}>
                {errors.passwordCheck.message}
              </p>
            )}
          </div>
        )}
      />

      {/* 닉네임 */}
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
          <div className={styles.inputWrapper}>
            <Input
              label="닉네임"
              placeholder="최소 2자, 최대 6자"
              clearable
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onClear={() => field.onChange("")}
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

      {/* Bio */}
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <div className={styles.inputWrapper}>
            <Input
              label="Bio"
              placeholder="자기소개를 입력해주세요 (선택)"
              clearable
              value={field.value ?? ""}
              onChange={e => field.onChange(e.target.value)}
              onClear={() => field.onChange("")}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />

      <TermsText />

      <Button
        variant="green"
        title={isSubmitting ? "가입 중..." : "가입하기"}
        type="submit"
        disabled={!isValid || isSubmitting || isValidating}
        className={styles.submitButton}
      />
    </form>
  )
}
