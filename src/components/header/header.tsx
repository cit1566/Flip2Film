import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import styles from "./header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <Link href="/" className={styles.logo} aria-label="메인 페이지로 이동">
        <Image
          src="/icon/logo.svg"
          alt="Flip2Film 로고"
          width={50}
          height={50}
          priority
        />
      </Link>

      {/* Right Area: Search + Login */}
      <div className={styles.searchBox}>
        <button
          type="button"
          className={styles.searchButton}
          aria-label="검색 열기"
        >
          <Search aria-hidden="true" />
        </button>

        <Link
          href="/"
          className={styles.loginLink}
          aria-label="로그인 페이지로 이동"
        >
          로그인
        </Link>
      </div>
    </header>
  )
}
