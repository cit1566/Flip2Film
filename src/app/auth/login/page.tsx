import LoginForm from "@/components/login/login-form/login-form"
import SocialLogin from "@/components/login/social-login/social-login"
import Image from "next/image"
import styles from "./page.module.css"

export default function LoginPage() {
  return (
    <section className={styles.loginPageContainer}>
      <header className={styles.loginPageLogoSection}>
        <Image
          src="/logo/logo.svg"
          alt="Flip2Film 로고"
          width={80}
          height={80}
        />
        <h1 className={styles.loginPageLogoTitle}>Flip2Film</h1>
      </header>

      <h2 className={styles.loginPageHeading}>로그인</h2>

      <LoginForm />

      <div className={styles.loginPageDivider}>
        <span className={styles.loginPageDividerLine}></span>
        <span className={styles.loginPageDividerText}>OR</span>
        <span className={styles.loginPageDividerLine}></span>
      </div>

      <SocialLogin />
    </section>
  )
}
