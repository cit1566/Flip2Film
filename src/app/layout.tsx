import '@/styles/main.css'
import { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Next.js 프로젝트 템플릿',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko-KR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
