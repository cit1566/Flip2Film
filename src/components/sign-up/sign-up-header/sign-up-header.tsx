"use client"

import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./sign-up-header.module.css"

export default function SignUpHeader() {
  const router = useRouter()

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => router.push("/login")}
        aria-label="뒤로가기"
      >
        <MoveLeft />
      </button>

      <h1 className={styles.headerTitle}>회원가입</h1>
    </header>
  )
}
