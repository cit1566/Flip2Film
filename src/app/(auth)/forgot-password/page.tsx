import AuthHeader from "@/components/atom/auth-header/auth-header"
import { ForgotPasswordForm } from "@/components/forgot-password/fotgot-password-form/forgot-password-form"
import styles from "./page.module.css"

export default function ForgotPasswordPage() {
  return (
    <section className={styles.forgotPasswordContainer}>
      <AuthHeader title="비밀번호 찾기" />
      <ForgotPasswordForm />
    </section>
  )
}
