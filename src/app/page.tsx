import Home from "../components/main-body/home/home"
import { getAladdin } from "../libs/api/book/book-api"
import { TMDB } from "../libs/api/movie/movie-api"
import styles from "./page.module.css"

export default async function HomePage() {
  // 알라딘 베스트 도서 리스트
  const { item: bookBest } = await getAladdin({
    type: "List",
    maxNum: 12,
    cover: "Big",
  })

  // 최신 인기 영화 리스트
  const { results: movieBest } = await TMDB.getRecentMovies()

  // 영화 도서 배열 묶음 객체
  const posterList = {
    book: bookBest,
    movie: movieBest,
  }

  return (
    <section className={styles.mainPageBox}>
      <Home posterList={posterList}></Home>
    </section>
  )
}
