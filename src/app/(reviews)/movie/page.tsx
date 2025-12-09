import MainBody from "@/components/main-body/main-body"
import NavLink from "@/components/nav-link/nav-link"
import styles from "../../page.module.css"

export default function MoviePage() {
  return (
    <section className={styles.mainPageBox}>
      <NavLink category="Movie"></NavLink>
      <MainBody category="Movie" />
    </section>
  )
}
