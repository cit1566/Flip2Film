import ReviewCreateForm from "@/components/review/form/review-create-form"
import styles from "./page.module.css"

export default function ReviewCreatePage() {
  return (
    <section className={styles.reviewCreateSection}>
      <h1 className={styles.heading}>감상평 작성</h1>
      <p className={styles.subMessage}>
        영화나 도서에 대한 당신의 생각을 공유해주세요.
      </p>
      <ReviewCreateForm />
    </section>
  )
}
