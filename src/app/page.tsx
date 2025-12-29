"server client"

import { toast } from "sonner"
import Home from "../components/main-body/home/home"
import { type BookItemProps, getAladdin } from "../libs/api/book/book-api"
import { type movieItemProps, TMDB } from "../libs/api/movie/movie-api"
import styles from "./page.module.css"

export default async function HomePage() {
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
  } catch (error) {
    toast.error(`Error : ${error}`)
  }

  try {
    // 최신 인기 영화 리스트
    const { results } = await TMDB.getRecentMovies()
    movieBest = results
  } catch (error) {
    toast.error(`Error : ${error}`)
  }

  // 영화 도서 배열 묶음 객체
  const posterList = {
    book: bookBest,
    movie: movieBest,
  }

  return (
    <section className={styles.mainPageBox}>
      <Home posterList={posterList} TMDBPosterUrl={TMDB.posterURL}></Home>
    </section>
  )
}
