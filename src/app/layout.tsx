import "@/styles/main.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import type { PropsWithChildren } from "react"
import Header from "../components/header/header"
import PageTransition from "../components/page-transition/page-transition"
import styles from "./layout.module.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "Next.js 프로젝트 템플릿",
}

const pretendard = localFont({
  variable: "--pretendard",
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko-KR">
      <body className={pretendard.className}>
        <Providers>
          {/* 헤더 컴포넌트 */}
          <Header className={styles.header}></Header>
          {/* 메인 page.tsx */}
          <PageTransition className={styles.container}>
            {children}
          </PageTransition>
          <footer className={styles.footer}>
            © Flip2Film All rights reserved. @GitHub
          </footer>
          {children}
        </Providers>
      </body>
    </html>
  )
}
