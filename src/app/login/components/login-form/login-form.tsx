import Button from "../atom/button/button"
import Input from "../atom/input/input"
import styles from "./login-form.module.css"

export default function LoginForm() {
  return (
    <form className={styles.form}>
      <div className={styles.inputEmail}>
        <Input
          type="email"
          label="이메일"
          placeholder="example@Flip2Film.com"
        />
      </div>

      <div className={styles.inputPassword}>
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <Button label="로그인" type="submit" />

      <div className={styles.bottomLinks}>
        <a href="/signup">회원가입</a>
        <span>/</span>
        <a href="/forgot">비밀번호 찾기</a>
      </div>
    </form>
  )
}
