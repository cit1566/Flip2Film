import "@/styles/main.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import type { PropsWithChildren } from "react"

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
        <main>{children}</main>
      </body>
    </html>
  )
}
