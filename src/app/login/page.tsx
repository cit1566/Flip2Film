import LoginForm from "./components/login-form/login-form"
import SocialLogin from "./components/social-login/social-login"
import styles from "./login.module.css"

export default function LoginPage() {
  return (
    <section className={styles.container}>
      <div className={styles.logoArea}>
        <img
          src="/logo/logo.svg"
          alt="Flip2Film 로고"
          className={styles.logo}
        />
        <h1 className={styles.title}>Flip2Film</h1>
      </div>

      <h2 className={styles.loginTitle}>로그인</h2>

      <LoginForm />

      <div className={styles.dividerWrapper}>
        <span className={styles.dividerLine}></span>
        <span className={styles.dividerText}>OR</span>
        <span className={styles.dividerLine}></span>
      </div>

      <SocialLogin />
    </section>
  )
}
