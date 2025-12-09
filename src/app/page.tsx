import Home from "../components/main-body/home/home"
import NavLink from "../components/nav-link/nav-link"
import styles from "./page.module.css"

export default function HomePage() {
  return (
    <section className={styles.mainPageBox}>
      <NavLink category="Home"></NavLink>
      {/* <MainBody category="Home" /> */}
      <Home></Home>
    </section>
  )
}
