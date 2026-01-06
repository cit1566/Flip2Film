"use client"

import { logOut } from "@/libs/api/user/user-api"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import getUserProfileUrl from "../../libs/api/user/get-user-profile"
import { useUserStore } from "../../store/useUserStore"
import styles from "./header.module.css"
import ProfileSkeleton from "./profile/profile-skeleton"

interface HeaderProps {
  className?: string | undefined
}

export default function Header({ className }: HeaderProps) {
  const lastScroll = useRef(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(true)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const MIN_SCROLL = 50

  const user = useUserStore(state => state.userData)
  const userId = useUserStore(state => state.userId)

  const { data: profileImageUrl = "/default-profile.png", isLoading } =
    useQuery({
      queryKey: ["profileImageUrl", userId],
      queryFn: async () => {
        return await getUserProfileUrl(userId as string)
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!userId,
    })

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.code === "Escape") {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isProfileOpen])

  useEffect(() => {
    let rafId: number | null = null
    let latestY = window.scrollY // 스크롤 이벤트에서 최신값만 저장

    const update = () => {
      const current = latestY
      if (current > lastScroll.current) {
        if (current >= MIN_SCROLL) setShow(false)
      } else {
        setShow(true)
      }

      lastScroll.current = current
      rafId = null
    }

    const onScroll = () => {
      latestY = window.scrollY

      // 이미 한 프레임 예약돼 있으면 또 예약하지 않음(= 1프레임 1번)
      rafId ??= requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  const handleLogOut = async () => {
    try {
      toast.success("로그아웃되었습니다")
      setIsProfileOpen(false)
      await logOut()
      window.location.href = "/"
    } catch {
      toast.error("로그아웃 에러가 발생했습니다")
    }
  }

  const authReady = !!userId && isUserComplete // 너 기준 “로그인 상태”
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

          {authReady ? (
            <div className={styles.profileWrapper} ref={dropdownRef}>
              <button
                className={styles.profileImageButton}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                disabled={isLoading} // 로딩 중 클릭 방지
              >
                {isLoading ? (
                  <ProfileSkeleton />
                ) : (
                  <Image
                    src={profileImageUrl}
                    alt="프로필"
                    width={50}
                    height={50}
                    className={styles.profileImage}
                  />
                )}
              </button>

              {!isLoading && isProfileOpen && (
                <div className={styles.dropdown}>
                  {" "}
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
                  </button>{" "}
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
