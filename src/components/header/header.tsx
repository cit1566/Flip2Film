"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import styles from "./header.module.css"

interface HeaderProps {
  className?: string | undefined
}

export default function Header({ className }: HeaderProps) {
  const [show, setShow] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const SCROLL_THRESHOLD = 50
    const SCROLL_DELTA = 5

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY

          // 최상단에서는 항상 표시
          if (currentScroll <= SCROLL_THRESHOLD) {
            setShow(true)
            setLastScroll(currentScroll)
            ticking.current = false
            return
          }

          // 변화량이 작으면 무시
          if (Math.abs(currentScroll - lastScroll) < SCROLL_DELTA) {
            ticking.current = false
            return
          }

          // 방향에 따라 표시/숨김
          if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
            setShow(false)
          } else if (currentScroll < lastScroll) {
            setShow(true)
          }

          setLastScroll(currentScroll)
          ticking.current = false
        })

        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  return (
    <header
      aria-hidden={!show}
      className={`${styles.header} ${className} ${show ? styles.show : styles.hide}`}
    >
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} aria-label="메인 페이지로 이동">
          <Image
            src="/logo/logo.svg"
            alt="Flip2Film 로고"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className={styles.searchBox}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label="검색 열기"
            aria-expanded={isSearchOpen}
            aria-controls="search-panel"
            onClick={() => {
              setSearchOpen(bool => !bool)
            }}
          >
            <Search aria-hidden="true" />
          </button>

          <Link
            href="/auth/login"
            role="link"
            className={styles.loginLink}
            aria-label="로그인 페이지로 이동"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  )
}
