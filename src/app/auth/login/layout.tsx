import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "로그인 | Flip2Film",
  description:
    "Flip2Film 계정에 로그인하여 영화·도서 리뷰를 작성하고 개인 맞춤 콘텐츠를 확인해보세요",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "로그인 | Flip2Film",
    description: "Flip2Film 계정에 로그인하고 리뷰 활동을 시작하세요",
    siteName: "Flip2Film",
    type: "website",
  },
}

export default function AuthLayout({ children }: PropsWithChildren) {
  return <>{children}</>
}
