import styles from "./profile-skeleton.module.css"

export default function ProfileSkeleton() {
  return <div className={styles.profileSkeleton} aria-label="loading profile" />
}
