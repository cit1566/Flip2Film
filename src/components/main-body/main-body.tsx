"use client"

import { ArrowBigUp } from "lucide-react"
import { Suspense } from "react"
import itemListDummy from "../main-review-item/dummy.json"
import MainReviewItem from "../main-review-item/main-review-item"
import MainReviewItemSkeleton from "../main-review-item/main-review-item-skeleton"
import styles from "./main-body.module.css"

interface MainBodyProps {
  category: "Home" | "Movie" | "Book"
}

export default function MainBody({ category }: MainBodyProps) {
  const filterList = itemListDummy.filter(
    item => item.category === category.toLowerCase()
  )

  function handleClickPageUp() {
    const scrollY = window.scrollY
    if (scrollY > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className={styles.mainBodyBox}>
      <ul className={styles.contentBox}>
        {filterList.map(item => {
          return (
            <li key={item.id}>
              <Suspense fallback={<MainReviewItemSkeleton />}>
                <MainReviewItem
                  title={item.title}
                  category={item.category}
                  content={item.content}
                  like={item.liked}
                  userId={item.review_owner_id}
                />
              </Suspense>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={handleClickPageUp}
        className={styles.pageUpButton}
        aria-label="페이지 상단으로 이동"
      >
        <ArrowBigUp width={25} height={25} aria-hidden="true" />
      </button>
    </div>
  )
}
