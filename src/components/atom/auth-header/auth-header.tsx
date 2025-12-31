"use client"

import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./auth-header.module.css"

interface AuthHeaderProps {
  title: string
}

export default function AuthHeader({ title }: AuthHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push("/login")
  }

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
        aria-label="뒤로가기"
      >
        <MoveLeft />
      </button>

      <h1 className={styles.headerTitle}>{title}</h1>
    </header>
  )
}
