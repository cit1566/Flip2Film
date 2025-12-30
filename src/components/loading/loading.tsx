import { LoaderCircle } from "lucide-react"
import styles from "./loading.module.css"

export default function LoadingPage() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingInnerBox}>
        <LoaderCircle width={50} height={50} />
        <p>잠시만 기다려 주세요.</p>
      </div>
    </div>
  )
}
