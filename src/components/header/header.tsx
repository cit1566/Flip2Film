"use client"

import { useUserStore } from "@/features/auth/use-user-store"
import { useUserQuery } from "@/hooks/use-user-query"
import { logOut, supabase } from "@/libs/api/user/user-api"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import styles from "./header.module.css"

interface HeaderProps {
  className?: string | undefined
}

export default function Header({ className }: HeaderProps) {
  const [show, setShow] = useState(true)
  const lastScroll = useRef(0)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = useUserStore(state => state.user)
  const clearUser = useUserStore(state => state.clearUser)

  const { isLoading } = useUserQuery()

  const isUserComplete = user?.nickname && user.nickname !== "익명"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current > lastScroll.current) setShow(false)
      else setShow(true)
      lastScroll.current = current
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogOut = async () => {
    try {
      await logOut()
      clearUser()
      setIsProfileOpen(false)
      window.location.href = "/"
    } catch {
      toast.error("로그아웃 에러가 발생했습니다")
    }
  }

  const profileImageUrl = user?.profile_image
    ? supabase.storage.from("profile_image").getPublicUrl(user.profile_image)
        .data.publicUrl
    : "/default-profile.png"

  if (isLoading) return <div className={styles.headerPlaceholder} />

  return (
    <header
      className={`${styles.header} ${className ?? ""} ${show ? styles.show : styles.hide}`}
    >
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo/logo.svg"
            alt="로고"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className={styles.searchBox}>
          <button
            onClick={() => setSearchOpen(!isSearchOpen)}
            className={styles.searchButton}
          >
            <Search />
          </button>

          {isUserComplete ? (
            <div className={styles.profileWrapper} ref={dropdownRef}>
              <button
                className={styles.profileImageButton}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Image
                  src={profileImageUrl}
                  alt="프로필"
                  width={50}
                  height={50}
                  className={styles.profileImage}
                />
              </button>

              {isProfileOpen && (
                <div className={styles.dropdown}>
                  <Link
                    href="/my-posts"
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    나의 글
                  </Link>
                  <Link
                    href="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    설정
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogOut}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
