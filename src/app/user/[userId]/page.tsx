import UserInfo from "@/components/user/feed-profile"
import styles from "./page.module.css"
import FeedTaps from "../../../components/feed-taps/feed-taps"

export default function UserPage() {
  return (
    <section className={styles.profile}>
      <h1 className="sr-only">사용자 피드</h1>
      <UserInfo />
      <FeedTaps />
    </section>
  )
}
