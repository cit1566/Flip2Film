import Image from "next/image"
import testMovieImage from "../../../public/movie-poster.webp"
import styles from "./profile-picture.module.css"

interface ProfilePictureProps {
  classStyle?: string | undefined
}

export default function ProfilePicture({ classStyle }: ProfilePictureProps) {
  return (
    <figure className={`${styles.profilePictureWraper} ${classStyle}`}>
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
