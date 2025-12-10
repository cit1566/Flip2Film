"use client"
import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import Link from "next/link"
import { useState } from "react"
import styles from "./login-form.module.css"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <Input
        label="이메일"
        type="email"
        placeholder="example@example.com"
        clearable
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={styles.loginFormEmailInput}
      />

      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        togglePassword
        value={password}
        onChange={e => setPassword(e.target.value)}
        className={styles.loginFormPasswordInput}
      />

      <Button
        variant="green"
        title="로그인"
        type="submit"
        className={styles.loginFormSubmitButton}
      />

      <div className={styles.loginFormBottomLinks}>
        <Link href="/auth/sign-up" className={styles.loginFormLink}>
          회원가입
        </Link>

        <span className={styles.loginFormSeparator}>/</span>

        <Link href="/auth/forgot" className={styles.loginFormLink}>
          비밀번호 찾기
        </Link>
      </div>
    </form>
  )
}
