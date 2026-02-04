import "@/styles/main.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { StrictMode, type PropsWithChildren } from "react"
import { Toaster } from "sonner"
import Footer from "../components/footer/footer"
import ClientLayoutContent from "./client-layout-content"

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
        <StrictMode>
          <ClientLayoutContent>{children}</ClientLayoutContent>
          <Footer></Footer>
          <Toaster position="top-center" richColors />
        </StrictMode>
      </body>
    </html>
  )
}
