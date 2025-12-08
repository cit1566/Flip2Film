import Header from "../components/header/header"
import MainBody from "../components/main-body/main-body"
import styles from "../styles/main-page.module.css"

export default function HomePage() {
  return (
    <section className={styles.homePageBox}>
      <Header className={styles.header}></Header>
      <main className={styles.mainContents}>
        <MainBody />
      </main>
    </section>
  )
}
