import Home from "../components/main-body/home/home"
import {
  type BookItemProps,
  getAladdin,
} from "../libs/api/client/book/book-api"
import { type movieItemProps, TMDB } from "../libs/api/client/movie/movie-api"
import styles from "./page.module.css"

export interface PosterListProps {
  book: BookItemProps[]
  movie: movieItemProps[]
}

function toMessage(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback
}

export default async function HomePage() {
  const errors: string[] = []

  let bookBest: BookItemProps[] = []
  let movieBest: movieItemProps[] = []

  try {
    // 알라딘 베스트 도서 리스트
    const { item } = await getAladdin({
      type: "List",
      maxNum: 12,
      cover: "Big",
    })
    bookBest = item
  } catch (e) {
    errors.push(toMessage(e, "도서 데이터를 불러오지 못했어요."))
  }

  try {
    // 최신 인기 영화 리스트
    const { results } = await TMDB.getRecentMovies()
    movieBest = results
  } catch (e) {
    errors.push(toMessage(e, "영화 데이터를 불러오지 못했어요."))
  }

  // 영화 도서 배열 묶음 객체
  const posterList: PosterListProps = {
    book: bookBest,
    movie: movieBest,
  }

  return (
    <section className={styles.mainPageBox}>
      <Home
        posterList={posterList}
        TMDBPosterUrl={TMDB.posterURL}
        errors={errors}
      ></Home>
    </section>
  )
}
