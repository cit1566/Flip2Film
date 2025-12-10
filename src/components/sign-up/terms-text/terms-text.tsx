import styles from "./terms-text.module.css"

export default function TermsText() {
  return (
    <p className={styles.termsText}>
      회원가입 시 Flip2Film <strong>서비스 약관</strong> 및<br />
      <strong>개인정보 처리방침</strong>에 동의하는 것으로 처리됩니다.
    </p>
  )
}
