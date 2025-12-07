import Image from "next/image"
import testMovieImage from "../../../public/movie-poster.webp"
import styles from "./profile-picture.module.css"

export default function ProfilePicture() {
  return (
    <figure className={styles.profilePictureWraper}>
      <Image
        className={styles.profilePicture}
        src={testMovieImage}
        alt="사용자 프로필"
        layout="responsive"
        priority
      />
    </figure>
  )
}
