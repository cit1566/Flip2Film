"use client"

import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import styles from "./input.module.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  status?: "default" | "error" | "disabled" | "success"
  clearable?: boolean
  togglePassword?: boolean
  onClear?: () => void
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
  onClear,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `input-${label?.replace(/\s+/g, "").toLowerCase()}`
  const isPassword = type === "password"
  const isEmail = type === "email"
  const isText = type === "text"

  const [showPassword, setShowPassword] = useState(false)
  const actualType = isPassword && showPassword ? "text" : type

  const statusClass =
    status === "error"
      ? styles.inputError
      : status === "disabled"
        ? styles.inputDisabled
        : status === "success"
          ? styles.inputSuccess
          : ""

  return (
    <label htmlFor={inputId} className={styles.inputLabelWrapper}>
      {label && <span className={styles.inputLabel}>{label}</span>}

      <span className={styles.inputBox}>
        <input
          {...props}
          autoComplete="off"
          id={inputId}
          type={actualType}
          value={value ?? ""}
          onChange={onChange}
          disabled={status === "disabled" ? true : disabled}
          className={`${styles.inputField} ${statusClass}`}
        />

        {clearable && (isEmail || isText) && value && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => {
              onClear?.()
            }}
            aria-label="입력 내용 지우기"
          >
            <X />
          </button>
        )}

        {togglePassword && isPassword && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </span>
    </label>
  )
}
