import type { PropsWithChildren } from "react"
import Footer from "../../components/footer/footer"
import Header from "../../components/header/header"
import PageTransition from "../../components/page-transition/page-transition"
import styles from "./layout.module.css"

export default function NoNavLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 헤더 컴포넌트 */}
      <Header className={styles.header}></Header>
      {/* 메인 page.tsx */}
      <div className={styles.mainBody}>
        <div className={styles.container}>
          <PageTransition>{children}</PageTransition>
        </div>
      </div>

      {/* 푸터 컴포넌트 */}
      <Footer></Footer>
    </>
  )
}
