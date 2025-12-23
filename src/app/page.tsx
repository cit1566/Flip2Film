import Home from "../components/main-body/home/home"
import styles from "./page.module.css"

export default function HomePage() {
  return (
    <section className={styles.mainPageBox}>
      <Home></Home>
    </section>
  )
}
