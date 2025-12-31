import AuthHeader from "@/components/atom/auth-header/auth-header"
import { UpdatePasswordForm } from "@/components/update-password/update-password-form/update-password-form"
import styles from "./page.module.css"

export default function UpdatePasswordPage() {
  return (
    <section className={styles.updatePasswordContainer}>
      <AuthHeader title="비밀번호 재설정" />
      <UpdatePasswordForm />
    </section>
  )
}
