"use client"

import listItemDummyData from "../../main-review-item/dummy.json"
import MainReviewItem from "../../main-review-item/main-review-item"
import Carousel from "./carousel/carousel"
import styles from "./home.module.css"

export default function Home() {
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
      <Carousel></Carousel>

      {/* 최다 좋아요 */}
      <div className={styles.mostLike}>
        <h3 className={styles.mostLikeTitle}>최다 좋아요 수 영화/도서</h3>
        <div className={styles.mostLikeItems}>
          {top5ToLiked.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => {
              return (
                <MainReviewItem
                  key={id + index}
                  title={title}
                  category={category}
                  content={content}
                  like={liked}
                  userId={review_owner_id}
                />
              )
            }
          )}
        </div>
      </div>

      {/* 최신 목록 */}
      <div className={styles.latestList}>
        <h3 className={styles.latestListTitle}>최신 작품 영화 감상평</h3>
        <div className={styles.latestListItems}>
          {latest5ListMovie.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => (
              <MainReviewItem
                key={id + index}
                title={title}
                category={category}
                content={content}
                like={liked}
                userId={review_owner_id}
              />
            )
          )}
        </div>
      </div>

      {/* 최신 목록 */}
      <div className={styles.latestList}>
        <h3 className={styles.latestListTitle}>최신 작품 도서 감상평</h3>
        <div className={styles.latestListItems}>
          {latest5ListBook.map(
            (
              { id, review_owner_id, title, content, category, liked },
              index
            ) => (
              <MainReviewItem
                key={id + index}
                title={title}
                category={category}
                content={content}
                like={liked}
                userId={review_owner_id}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
