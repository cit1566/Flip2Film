"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import styles from "./header.module.css"
import { useDropdown } from "./hooks/use-drop-down"
import { useHeaderVisivility } from "./hooks/use-header-visibility"
import { useLogout } from "./hooks/use-logout"
import { useMeProfile } from "./hooks/use-me-profile"
import ProfileSkeleton from "./profile/profile-skeleton"

interface HeaderProps {
  className?: string | undefined
}

export default function Header({ className }: HeaderProps) {
  const { show } = useHeaderVisivility(50)
  const [isSearchOpen, setSearchOpen] = useState(false)

  const {
    ref: dropdownRef,
    open: isProfileOpen,
    setOpen: setIsProfileOpen,
  } = useDropdown<HTMLDivElement>()
  const { authReady, profileImageUrl, isLoading } = useMeProfile()

  const logoutMutation = useLogout()

  const handleLogOut = async () => {
    try {
      toast.success("로그아웃되었습니다")
      setIsProfileOpen(false)
      await logoutMutation.mutateAsync()
      window.location.href = "/"
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e?.message ?? "로그아웃 에러가 발생했습니다.")
      }
    }
  }

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
