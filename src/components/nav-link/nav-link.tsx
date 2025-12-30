"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./nav-link.module.css"

export default function NavLink() {
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isMovie = pathname.startsWith("/movie")
  const isBook = pathname.startsWith("/book")

  const activeLineKey = isHome
    ? "activeHome"
    : isMovie
      ? "activeMovie"
      : "activeBook"
  return (
    <div className={styles.navLinkBox}>
      <Link href="/" className={isHome ? styles.isActive : ""}>
        홈
      </Link>
      <Link href="/movie" className={isMovie ? styles.isActive : ""}>
        영화
      </Link>
      <Link href="/book" className={isBook ? styles.isActive : ""}>
        도서
      </Link>

      <div className={`${styles.activeLine} ${styles[activeLineKey]}`} />
    </div>
  )
}
