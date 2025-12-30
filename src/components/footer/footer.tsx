import Image from "next/image"
import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* 브렌드 / 카피라이트 */}
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brandLogo}>
            <Image
              src="/logo/logo.svg"
              alt="Flip2Film"
              width={40}
              height={40}
            />
            <span>Flip2Film</span>
          </Link>
          <p className={styles.footerCopy}>
            Copyright © 2025 Flip2Film. All right reserved
          </p>
        </div>

        {/* 푸터 네비게이션 */}
        <nav className={styles.footerNav} aria-label="푸터 네비게이션">
          <div className={styles.footerNavGroup}>
            <h2 className={styles.footerNavTitle}>Contact</h2>
            <ul className={styles.footerNavList}>
              <li>
                <Link href="mailto:cit1566@gmail.com">cit1566@gmail.com</Link>
              </li>
              <li>
                <Link href="mailto:tldhs123e@gmail.com">
                  tldhs123e@gmail.com
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerNavGroup}>
            <h2 className={styles.footerNavTitle}>Socials</h2>
            <ul className={styles.footerNavList}>
              <li>
                <Link
                  href="https://velog.io/@cit1566/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Velog
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/cit1566/Flip2Film"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerNavGroup}>
            <h2 className={styles.footerNavTitle}>Etc</h2>
            <ul className={styles.footerNavList}>
              <li>
                <Link href="/team">팀 소개</Link>
              </li>
              <li>
                <Link href="/feedback">서비스 피드백</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  )
}
