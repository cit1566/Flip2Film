import Image from "next/image"
import testMovieImage from "../../../../public/movie-poster.webp"
import styles from "./item-card.module.css"

interface Item {
  title: string
  releaseDate: number
  director: string
  genre: string
  casts: string
}

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <article className={styles.article}>
      <div className={styles.itemImageContainer}>
        <figure className={styles.itemImageWraper}>
          <Image
            src={testMovieImage}
            className={styles.itemImage}
            alt={`${item.title}`}
            width={1280}
            height={1920}
            sizes="(max-width: 480px) 90px, 144px"
            priority
          />
        </figure>
      </div>
      <div className={styles.itemDetail}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.detail}>개봉 : {item.releaseDate}</p>
        <p className={styles.detail}>감독 : {item.director}</p>
        <p className={styles.detail}>장르 : {item.genre}</p>
        <p className={styles.detail}>출연 : {item.casts}</p>
      </div>
    </article>
  )
}
