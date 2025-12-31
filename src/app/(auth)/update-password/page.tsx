import { UpdatePasswordForm } from "@/components/update-password/update-password-form/update-password-form"
import styles from "./page.module.css"

export default function UpdatePasswordPage() {
  return (
    <section className={styles.container}>
      <UpdatePasswordForm />
    </section>
  )
}
