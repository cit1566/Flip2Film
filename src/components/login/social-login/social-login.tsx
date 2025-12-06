import styles from "./social-login.module.css"

export default function SocialLogin() {
  return (
    <div className={styles.socialContainer}>
      <p className="text-label">간편 로그인으로 시작하기</p>

      <div className={styles.iconRow}>
        <button type="button" className={styles.kakaoBtn}>
          <img src="/social-icons/kakao.svg" alt="카카오 로그인" />
        </button>

        <button type="button" className={styles.googleBtn}>
          <img src="/social-icons/google.svg" alt="구글 로그인" />
        </button>
      </div>
    </div>
  )
}
