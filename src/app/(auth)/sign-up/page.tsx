import AuthHeader from "@/components/atom/auth-header/auth-header"
import SignUpForm from "@/components/sign-up/sign-up-form/sign-up-form"
import styles from "./page.module.css"

export default function SignUpPage() {
  return (
    <section className={styles.signUpPageContainer}>
      <AuthHeader title="회원가입" />
      <SignUpForm />
    </section>
  )
}
