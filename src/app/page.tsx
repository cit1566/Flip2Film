import MainBody from "../components/main-body/main-body"
import styles from "./page.module.css"

export default function HomePage() {
  return (
    <section className={styles.mainPageBox}>
      <MainBody category="Home" />
    </section>
  )
}
