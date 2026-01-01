import SignUpForm from "@/components/sign-up/sign-up-form/sign-up-form"
import SignUpHeader from "@/components/sign-up/sign-up-header/sign-up-header"
import styles from "./page.module.css"

export default function SignUpPage() {
  return (
    <section className={styles.signUpPageContainer}>
      <SignUpHeader />
      <SignUpForm />
    </section>
  )
}
