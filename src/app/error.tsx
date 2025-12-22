"use client"

import { TriangleAlert, RotateCcw } from "lucide-react"
import styles from "./errorBoundary.module.css"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={styles.container}>
      <div role="alert" className={styles.errorBoundary}>
        <h2 className={styles.title}>
          <TriangleAlert />
          Error <span className={styles.subTitle}>오류</span>
        </h2>

        <div className={styles.errorMessage}>
          <span className={styles.decoStick} aria-hidden />
          <div className={styles.baseMessage}>
            <p className={styles.baseMessageInKorean}>
              요청하신 페이지를 처리 중에 오류가 발생했습니다. 서비스 이용에
              불편을 드려 죄송합니다.
            </p>
            <p className={styles.baseMessageInEnglish}>
              A system error occurred while processing your request. We
              apologize for the inconvenience. Please check URL and try again.
            </p>
          </div>

          {error.message && (
            <code className={styles.serverErrorMessage}>{error.message}</code>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={reset} className={styles.resetButton}>
            <RotateCcw size={18} />
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
