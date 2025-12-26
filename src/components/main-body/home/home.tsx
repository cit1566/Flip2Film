"use client"

import type { BookItemProps } from "@/libs/api/book/book-api"
import type { movieItemProps } from "@/libs/api/movie/movie-api"
import { Suspense } from "react"
import listItemDummyData from "../../main-review-item/dummy.json"
import MainReviewItem from "../../main-review-item/main-review-item"
import MainReviewItemSkeleton from "../../main-review-item/main-review-item-skeleton"
import Carousel from "./carousel/carousel"
import styles from "./home.module.css"

interface HomeProps {
  posterList: PosterListProps
}

export interface PosterListProps {
  book: BookItemProps[]
  movie: movieItemProps[]
}

export default function Home({ posterList }: HomeProps) {
  // 영화 목록 리스트
  const movieList = listItemDummyData.filter(item => item.category === "movie")
  // 도서 목록 리스트
  const bookList = listItemDummyData.filter(item => item.category === "book")

  const top5ToLiked = [...listItemDummyData]
    .sort((a, b) => b.liked - a.liked)
    .slice(0, 5)

  const latest5ListMovie = [...movieList]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  const latest5ListBook = [...bookList]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  return (
    <div className={styles.homeBox}>
      <Carousel posterList={posterList}></Carousel>

      {/* 최다 좋아요 */}
      <section className={styles.mostLike} aria-labelledby="mostLikeTitle">
        <h2 id="mostLikeTitle" className={styles.mostLikeTitle}>
          최다 좋아요 수 영화/도서
        </h2>
        <ul className={styles.mostLikeItems}>
          {top5ToLiked.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => {
              return (
                <li key={id + index}>
                  <Suspense fallback={<MainReviewItemSkeleton />}>
                    <MainReviewItem
                      title={title}
                      category={category}
                      content={content}
                      like={liked}
                      userId={review_owner_id}
                    />
                  </Suspense>
                </li>
              )
            }
          )}
        </ul>
      </section>

      {/* 최신 목록 */}
      <section className={styles.latestList} aria-labelledby="latestListMovie">
        <h2 id="latestListMovie" className={styles.latestListTitle}>
          최신 작품 영화 감상평
        </h2>
        <ul className={styles.latestListItems}>
          {latest5ListMovie.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => (
              <li key={id + index}>
                <Suspense fallback={<MainReviewItemSkeleton />}>
                  <MainReviewItem
                    title={title}
                    category={category}
                    content={content}
                    like={liked}
                    userId={review_owner_id}
                  />
                </Suspense>
              </li>
            )
          )}
        </ul>
      </section>

      {/* 최신 목록 */}
      <section className={styles.latestList} aria-labelledby="latestListBook">
        <h2 id="latestListBook" className={styles.latestListTitle}>
          최신 작품 도서 감상평
        </h2>
        <ul className={styles.latestListItems}>
          {latest5ListBook.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => (
              <li key={id + index}>
                <Suspense fallback={<MainReviewItemSkeleton />}>
                  <MainReviewItem
                    key={id + index}
                    title={title}
                    category={category}
                    content={content}
                    like={liked}
                    userId={review_owner_id}
                  />
                </Suspense>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  )
}
