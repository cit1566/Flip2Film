"use client"

import { ArrowBigUp } from "lucide-react"
import Link from "next/link"
import itemListDummy from "../main-review-item/dummy.json"
import MainReviewItem from "../main-review-item/main-review-item"
import styles from "./main-body.module.css"

interface MainBodyProps {
  category: "Home" | "Movie" | "Book"
}

export default function MainBody({ category }: MainBodyProps) {
  const activeLineKey = `active${category}`

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
      <div className={styles.navLinkBox}>
        <Link href="/" className={`${category === "Home" && styles.isActive}`}>
          홈
        </Link>
        <Link
          href="./movie"
          className={`${category === "Movie" && styles.isActive}`}
        >
          영화
        </Link>
        <Link
          href="./book"
          className={`${category === "Book" && styles.isActive}`}
        >
          도서
        </Link>
        {/* 활성화 탭 밑줄 */}
        <div className={`${styles.activeLine} ${styles[activeLineKey]}`}></div>
      </div>
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
