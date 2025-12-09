"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./header.module.css"

interface HeaderProps {
  className?: string | undefined
}

export default function Header({ className }: HeaderProps) {
  const [show, setShow] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current > lastScroll) {
        setShow(false)
      } else {
        setShow(true)
      }

      setLastScroll(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  return (
    <header
      className={`${styles.header} ${className} ${show ? styles.show : styles.hide}`}
    >
      {/* Logo */}
      <Link href="/" className={styles.logo} aria-label="메인 페이지로 이동">
        <Image
          src="/logo/logo.svg"
          alt="Flip2Film 로고"
          width={40}
          height={40}
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
          href="/auth/login"
          className={styles.loginLink}
          aria-label="로그인 페이지로 이동"
        >
          로그인
        </Link>
      </div>
    </header>
  )
}
