"use client"

import { ArrowBigUp } from "lucide-react"
import itemListDummy from "../main-review-item/dummy.json"
import MainReviewItem from "../main-review-item/main-review-item"
import styles from "./main-body.module.css"

interface MainBodyProps {
  category: "Home" | "Movie" | "Book"
}

export default function MainBody({ category }: MainBodyProps) {
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
      <div className={styles.contentBox}>
        {itemListDummy.map(item => {
          return (
            <MainReviewItem
              key={item.id}
              title={item.title}
              category={item.category}
              content={item.content}
              like={item.liked}
              userId={item.review_owner_id}
            />
          )
        })}
      </div>
      <button
        type="button"
        onClick={handleClickPageUp}
        className={styles.pageUpButton}
        title="페이지 상단으로 이동"
      >
        <ArrowBigUp width={25} height={25} />
      </button>
    </div>
  )
}
