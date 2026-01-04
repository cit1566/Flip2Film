import Footer from "@/components/footer/footer"
import PageTransition from "@/components/page-transition/page-transition"
import type { PropsWithChildren } from "react"
import styles from "./layout.module.css"

export default function NoNavLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 헤더 컴포넌트 */}

      {/* 메인 page.tsx */}
      <div className={styles.mainBody}>
        <div className={styles.reviewHeader}>
          <div className={styles.reviewHeaderInner}>
            새글 작성
            <div className={styles.reviewHeaderButtonBox}>
              <button type="button">저장</button>
              <button type="button">발행</button>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <PageTransition>{children}</PageTransition>
        </div>
      </div>

      {/* 푸터 컴포넌트 */}
      <Footer></Footer>
    </>
  )
}
