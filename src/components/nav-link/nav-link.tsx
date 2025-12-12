import Link from "next/link"
import styles from "./nav-link.module.css"

interface NavLinkProps {
  category: "Home" | "Movie" | "Book"
}
export default function NavLink({ category }: NavLinkProps) {
  const activeLineKey = `active${category}`

  return (
    <div className={styles.navLinkBox}>
      <Link href="/" className={`${category === "Home" && styles.isActive}`}>
        홈
      </Link>
      <Link
        href="./movie"
        className={`${category === "Movie" && styles.isActive}`}
      >
        영화
      </Link>
      <Link
        href="./book"
        className={`${category === "Book" && styles.isActive}`}
      >
        도서
      </Link>
      {/* 활성화 탭 밑줄 */}
      <div className={`${styles.activeLine} ${styles[activeLineKey]}`}></div>
    </div>
  )
}
