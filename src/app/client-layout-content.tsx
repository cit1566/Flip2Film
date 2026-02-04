"use client"

import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"
import Header from "../components/header/header"
import NavLink from "../components/nav-link/nav-link"
import PageTransition from "../components/page-transition/page-transition"
import Providers from "../libs/tanstack-query/providers"
import styles from "./layout.module.css"

export default function ClientLayoutContent({ children }: PropsWithChildren) {
  const pathname = usePathname()

  // 인증 페이지인지 확인
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot") ||
    pathname.startsWith("/social") ||
    pathname.startsWith("/update-password")

  return (
    <Providers>
      {/* 인증 페이지가 아닐 때만 헤더 표시 */}
      {!isAuthPage && <Header className={styles.header}></Header>}
      {/* 메인 page.tsx */}
      <div className={styles.mainBody}>
        <div className={styles.container}>
          <NavLink></NavLink>
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </Providers>
  )
}
