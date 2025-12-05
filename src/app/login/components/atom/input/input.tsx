"use client"

import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import styles from "./input.module.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, type = "text", ...props }: InputProps) {
  const [value, setValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"
  const isEmail = type === "email"

  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.inputBox}>
        <input
          {...props}
          type={inputType}
          value={value}
          onChange={e => setValue(e.target.value)}
          className={styles.input}
        />

        {isEmail && value.length > 0 && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setValue("")}
            aria-label="입력 지우기"
          >
            <X />
          </button>
        )}

        {isPassword && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label="비밀번호 표시 토글"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
    </div>
  )
}
