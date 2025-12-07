import ProfilePicture from "@/components/user/profile-picture"
import styles from "./feed-profile.module.css"

export default function UserInfo() {
  return (
    <div className={styles.userInfoWrapper}>
      <div className={styles.summary}>
        <ProfilePicture />
        <div className={styles.summaryTexts}>
          <h2 className={styles.nickname}>즐거운 차지현</h2>
          <p className={styles.reviewCounts}>영화 8개 • 도서 0개</p>
        </div>
      </div>
      <p className={styles.bio}>
        130자 제한 Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Voluptatem necessitatibus dipisicing elit veritatis sit noptatem
        necessitatibus
      </p>
    </div>
  )
}
