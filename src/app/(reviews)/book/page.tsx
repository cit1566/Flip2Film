import MainBody from "@/components/main-body/main-body"
import styles from "../../page.module.css"

export default function BookPage() {
  return (
    <section className={styles.mainPageBox}>
      <MainBody category="Book" />
    </section>
  )
}
