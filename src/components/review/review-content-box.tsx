import type { PropsWithChildren } from "react"
import styles from "./review-content-box.module.css"

export default function ReviewContentBox({ children }: PropsWithChildren) {
  return <div className={styles.reviewContentBox}>{children}</div>
}
