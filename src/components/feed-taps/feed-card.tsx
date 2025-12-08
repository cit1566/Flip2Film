import Image from "next/image"
import Link from "next/link"
import testMovieImage from "../../../public/movie-poster.webp"
import styles from "./feed-card.module.css"

const IMAGE_SIZE = {
  width: 250,
  height: 371,
}

export default function FeedCard(item) {
  return (
    <Link href="/" className={styles.reviewLink}>
      <Image
        src={testMovieImage}
        alt="{영화/도서} {이름}"
        width={IMAGE_SIZE.width}
        height={IMAGE_SIZE.height}
        layout="responsive"
        className={styles.cardImage}
        priority
      />
    </Link>
  )
}
