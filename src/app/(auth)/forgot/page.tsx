import { ForgotPasswordForm } from "@/components/forgot-password/fotgot-password-form/forgot-password-form"
import styles from "./page.module.css"

export default function ForgotPasswordPage() {
  return (
    <section className={styles.container}>
      <ForgotPasswordForm />
    </section>
  )
}
