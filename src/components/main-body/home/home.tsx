import Image from "next/image"
import styles from "./home.module.css"

export default function Home() {
  return (
    <div className={styles.homeBox}>
      <div className={styles.carousel}>
        <Image
          src="/movie-poster.webp"
          alt="연습 포스터"
          width={50}
          height={100}
        ></Image>
        <Image
          src="/movie-poster.webp"
          alt="연습 포스터"
          width={50}
          height={100}
        ></Image>
        <Image
          src="/movie-poster.webp"
          alt="연습 포스터"
          width={50}
          height={100}
        ></Image>
        <Image
          src="/movie-poster.webp"
          alt="연습 포스터"
          width={50}
          height={100}
        ></Image>
        <Image
          src="/movie-poster.webp"
          alt="연습 포스터"
          width={50}
          height={100}
        ></Image>
      </div>
    </div>
  )
}
