import { Suspense } from "react"
import LoadingPage from "../components/loading/loading"
import Home from "../components/main-body/home/home"
import NavLink from "../components/nav-link/nav-link"
import styles from "./page.module.css"

export default function HomePage() {
  return (
    <section className={styles.mainPageBox}>
      <Suspense fallback={<LoadingPage />}>
        <NavLink category="Home"></NavLink>
        <Home></Home>
      </Suspense>
    </section>
  )
}
