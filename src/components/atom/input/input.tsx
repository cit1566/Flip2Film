"use client"

import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import styles from "./input.module.css"

/**
 * 공통 Input 컴포넌트
 *
 * - clearable(X 버튼), togglePassword(비밀번호 보기) 기능 선택적 제공
 * - default / error / disabled 상태 스타일 선택해서 사용하면 됌
 *
 * 예시:
 * <Input label="이메일" type="email" clearable />
 * <Input label="비밀번호" type="password" togglePassword />
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  status?: "default" | "error" | "disabled"
  clearable?: boolean
  togglePassword?: boolean
}

export default function Input({
  label,
  status = "default",
  type = "text",
  clearable,
  togglePassword,
  disabled,
  value,
  onChange,
  id,
  ...props
}: InputProps) {
  const isPassword = type === "password"
  const isEmail = type === "email"
  const inputId = id ?? `input-${label}`

  const [showPassword, setShowPassword] = useState(false)

  const actualType = isPassword && showPassword ? "text" : type

  const statusClass =
    status === "error"
      ? styles.inputError
      : status === "disabled"
        ? styles.inputDisabled
        : ""

  return (
    <label htmlFor={inputId} className={styles.inputContainer}>
      {label && <span className={styles.inputLabel}>{label}</span>}

      <input
        {...props}
        id={inputId}
        type={actualType}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${styles.inputField} ${statusClass}`}
      />

      {clearable && isEmail && value && (
        <button
          type="button"
          className={styles.iconButton}
          onClick={() =>
            onChange?.({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          aria-label="내용 지우기"
        >
          <X />
        </button>
      )}

      {togglePassword && isPassword && (
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "비밀번호 표시" : "비밀번호 숨기기"}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      )}
    </label>
  )
}
