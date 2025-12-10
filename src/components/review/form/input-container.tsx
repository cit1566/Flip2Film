import type { PropsWithChildren } from "react"
import styles from "./input-container.module.css"

export default function InputContainer({ children }: PropsWithChildren) {
  return <div className={styles.inputContainer}>{children}</div>
}
