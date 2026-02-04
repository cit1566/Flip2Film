"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import { useDebounce } from "@/hooks/useDebounce"
import type { UserInsert } from "@/libs/supabase/types"
import { getInputStatus } from "@/utils"
import { VALIDATION_PATTERNS } from "@/utils/commonConstants/validation"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import styles from "./sign-up-form.module.css"

/**
 * 회원가입 폼에서 실제로 사용하는 데이터 타입
 * (DB insert 타입 + UI 전용 필드)
 */
type SignUpFormData = Pick<UserInsert, "email" | "nickname" | "bio"> & {
  password: string
  passwordCheck: string
  profile_image: File | null
}

type Key = "email" | "nickname"

/**
 * 서버 응답 타입 (클라이언트에서 일관되게 처리하기 위한 형태)
 * - /api/auth/signup
 * - /api/auth/signup/validation
 */
type ApiErrorCode =
  | "VALIDATION_FAILED"
  | "DUPLICATE_EMAIL"
  | "DUPLICATE_NICKNAME"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR"

type ApiResponse<T> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; code: ApiErrorCode; message: string; field?: Key }

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

/**
 * (onBlur용) 중복 검증 API
 * - 서버 에러면 "통과(true)"가 아니라 안내 메시지로 실패 처리(제출 차단)
 */
async function checkValidateClient(args: {
  key: Key
  value: string
}): Promise<true | string> {
  const { key, value } = args

  const res = await fetch("/api/auth/signup/validation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  })

  const json = await safeJson<ApiResponse<unknown>>(res)

  // 서버가 일시적으로 죽었거나 응답이 이상한 경우: 제출 막고 안내
  if (!res.ok || !json)
    return "검증 서버 오류입니다. 잠시 후 다시 시도해주세요."

  if (json.ok) return true
  return json.message ?? "유효성 검사에 실패하였습니다."
}

// ---------------------------------------------------------------------------------

export default function SignUpForm() {
  const router = useRouter()

  /**
   * 중복 submit 방지용 ref
   */
  const isSubmittingRef = useRef(false)

  /** 회원가입 성공 여부 (성공 화면 전환용) */
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    watch,
    formState: { isSubmitting, isValidating, isValid },
  } = useForm<SignUpFormData>({
    // async validate가 있으니, onChange는 서버를 너무 많이 때림 → onBlur 권장
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      bio: "",
      profile_image: null,
    },
  })

  // 닉네임/이메일을 "onChange reValidate" 시 서버 호출이 잦아질 수 있으니,
  // watch + debounced를 이용해 필요할 때만 트리거하는 패턴도 가능.
  // (현재는 onBlur에서만 서버 validate 호출하므로, 디바운스는 예비로만 둠)
  const emailValue = watch("email")
  const nicknameValue = watch("nickname")
  const debouncedEmail = useDebounce(emailValue, 350)
  const debouncedNickname = useDebounce(nicknameValue, 350)
  const _debounced = useMemo(
    () => ({ debouncedEmail, debouncedNickname }),
    [debouncedEmail, debouncedNickname]
  )

  /**
   * 회원가입 submit 핸들러
   * - fetch는 4xx/5xx에서 throw 하지 않으므로 res.ok 기반으로 처리
   * - 서버 응답은 {ok, code, message, field} 형태를 가정
   */
  const handleSignUpSubmit = async (data: SignUpFormData) => {
    if (isSubmittingRef.current) return

    // RHF가 막지만, 방어적으로 한 번 더 체크
    if (!data.email || !data.password || !data.nickname) {
      toast.error("필수 항목을 확인해주세요.")
      return
    }

    try {
      isSubmittingRef.current = true

      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("nickname", data.nickname)
      formData.append("bio", data.bio ?? "")
      if (data.profile_image instanceof File) {
        formData.append("profile_image", data.profile_image)
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      })

      const json = await safeJson<ApiResponse<unknown>>(res)

      // 응답 파싱 실패/서버 다운
      if (!json) {
        toast.error(
          "서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요."
        )
        return
      }

      // 실패 처리(핵심): 여기서 code/field에 따라 setError/toast 분기
      if (!res.ok || !json.ok) {
        const err = json.ok
          ? { code: "INTERNAL_ERROR" as const, message: "요청에 실패했습니다." }
          : json

        switch (err.code) {
          case "DUPLICATE_EMAIL": {
            setError(
              "email",
              {
                type: "manual",
                message: err.message || "이미 가입된 이메일입니다.",
              },
              { shouldFocus: true }
            )
            toast.info("이미 가입된 이메일입니다. 로그인으로 이동할 수 있어요.")
            // 자동 이동은 사용자 입장에서 갑작스러울 수 있어 제거.
            // 원하면 버튼으로 제공하는 것이 더 안전.
            return
          }
          case "DUPLICATE_NICKNAME": {
            setError(
              "nickname",
              {
                type: "manual",
                message: err.message || "이미 사용 중인 닉네임 입니다",
              },
              { shouldFocus: true }
            )
            return
          }
          case "VALIDATION_FAILED":
          case "BAD_REQUEST": {
            // field가 내려오면 해당 필드에 에러를 붙임
            if (err.field === "email") {
              setError(
                "email",
                { type: "manual", message: err.message },
                { shouldFocus: true }
              )
              return
            }
            if (err.field === "nickname") {
              setError(
                "nickname",
                { type: "manual", message: err.message },
                { shouldFocus: true }
              )
              return
            }
            toast.error(err.message || "입력값을 확인해주세요.")
            return
          }
          default: {
            toast.error(err.message || "회원가입에 실패했습니다.")
            return
          }
        }
      }

      // 성공
      setIsSuccess(true)
      toast.success(json.message ?? "회원가입 완료!")
    } catch {
      // 네트워크/런타임 오류만 여기로 들어옴
      toast.error("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.")
    } finally {
      isSubmittingRef.current = false
    }
  }

  /**
   * 성공 화면
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
            환영합니다! 바로 서비스를 이용하실 수 있습니다.
          </p>
        </header>

        <div className={styles.actions}>
          <Button
            variant="green"
            title="홈으로 이동"
            onClick={() => router.push("/")}
            className={styles.submitButton}
          />
          <Button
            variant="base"
            title="로그인으로 이동"
            onClick={() => router.push("/login")}
            className={styles.secondaryButton}
          />
        </div>
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
          validate: async value => {
            // 빈 값이면 required가 처리
            if (!value) return true
            return await checkValidateClient({ key: "email", value })
          },
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
              status={getInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {fieldState.error && (
              <p className={styles.errorMessage}>{fieldState.error.message}</p>
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
              status={getInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {fieldState.error && (
              <p className={styles.errorMessage}>{fieldState.error.message}</p>
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
              status={getInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {fieldState.error && (
              <p className={styles.errorMessage}>{fieldState.error.message}</p>
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
          validate: async value => {
            if (!value) return true
            return await checkValidateClient({ key: "nickname", value })
          },
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
              status={getInputStatus(
                fieldState.isTouched,
                Boolean(fieldState.error),
                field.value ?? ""
              )}
            />
            {fieldState.error && (
              <p className={styles.errorMessage}>{fieldState.error.message}</p>
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
        title={
          isSubmittingRef.current || isSubmitting ? "가입 중..." : "가입하기"
        }
        type="submit"
        disabled={
          !isValid || isSubmitting || isValidating || isSubmittingRef.current
        }
        className={styles.submitButton}
      />
    </form>
  )
}
