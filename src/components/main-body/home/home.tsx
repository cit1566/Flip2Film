"use client"

import type { PosterPathProps } from "@/libs/api/movie/movie-api"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import type { PosterListProps } from "../../../app/page"
import listItemDummyData from "../../main-review-item/dummy.json"
import MainReviewItem from "../../main-review-item/main-review-item"
import Carousel from "./carousel/carousel"
import CarouselSkeleton from "./carousel/skeleton/carousel-skeleton"
import styles from "./home.module.css"

interface HomeProps {
  posterList: PosterListProps
  TMDBPosterUrl: PosterPathProps
  errors: string[]
}

export default function Home({
  posterList,
  TMDBPosterUrl,
  errors = [],
}: HomeProps) {
  // 영화 목록 리스트
  const movieList = listItemDummyData.filter(item => item.category === "movie")
  // 도서 목록 리스트
  const bookList = listItemDummyData.filter(item => item.category === "book")

  const displayedErrorsRef = useRef<Set<string>>(new Set())

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

  const hasAny =
    (posterList.book?.length ?? 0) > 0 || (posterList.movie?.length ?? 0) > 0

  useEffect(() => {
    errors.forEach(msg => {
      if (!displayedErrorsRef.current.has(msg)) {
        toast.error(msg)
        displayedErrorsRef.current.add(msg)
      }
    })
  }, [errors])

  return (
    <div className={styles.homeBox}>
      {hasAny ? (
        <Carousel
          posterList={posterList}
          TMDBPosterUrl={TMDBPosterUrl}
        ></Carousel>
      ) : (
        <CarouselSkeleton />
      )}

      {/* 중단 선 */}
      <div className={styles.breakLine}></div>

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
                  {/* <Suspense fallback={<MainReviewItemSkeleton />}> */}
                  <MainReviewItem
                    title={title}
                    category={category}
                    content={content}
                    like={liked}
                    userId={review_owner_id}
                  />
                  {/* </Suspense> */}
                </li>
              )
            }
          )}
        </ul>
      </section>

      {/* 중단 선 */}
      <div className={styles.breakLine}></div>

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
                {/* <Suspense fallback={<MainReviewItemSkeleton />}> */}
                <MainReviewItem
                  title={title}
                  category={category}
                  content={content}
                  like={liked}
                  userId={review_owner_id}
                />
                {/* </Suspense> */}
              </li>
            )
          )}
        </ul>
      </section>

      {/* 중단 선 */}
      <div className={styles.breakLine}></div>

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
                {/* <Suspense fallback={<MainReviewItemSkeleton />}> */}
                <MainReviewItem
                  title={title}
                  category={category}
                  content={content}
                  like={liked}
                  userId={review_owner_id}
                />
                {/* </Suspense> */}
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  )
}
