"use client"

import SearchCategorBook from "@/components/review/form/search-category/book/search-category-book"
import SearchCategoryMovie from "@/components/review/form/search-category/movie/search-category-movie"
import { useState } from "react"
import styles from "./page.module.css"

// type ReviewFormData = Review

export default function ReviewCreatePage() {
  const [categoryIsBook, setCategoryIsBook] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <section className={styles.reviewCreateSection}>
      <h1 className={styles.heading}>감상평 작성</h1>
      <p className={styles.subMessage}>
        영화나 도서에 대한 당신의 생각을 공유해주세요.
      </p>

      <form className={styles.reviewCreateForm}>
        {/* 카테고리 */}
        <div className={styles.category}>
          <h2>
            카테고리 <span>*</span>
          </h2>
          <div className={styles.categoryInput}>
            <label className={styles.radioButton}>
              <input
                type="radio"
                id="category-book"
                name="category"
                value="book"
                className={styles.radioInput}
                onClick={() => setCategoryIsBook(true)}
                defaultChecked
              />
              <span className={styles.radioText}>도서</span>
            </label>

            <label className={styles.radioButton}>
              <input
                type="radio"
                id="category-movie"
                name="category"
                value="movie"
                className={styles.radioInput}
                onClick={() => setCategoryIsBook(false)}
              />
              <span className={styles.radioText}>영화</span>
            </label>
          </div>
        </div>

        <div className="breakLine"></div>

        {/* 도서/영화 검색 */}
        <div className={styles.searchCategory}>
          {categoryIsBook ? (
            <SearchCategorBook
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <SearchCategoryMovie
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
        </div>
      </form>
    </section>
  )
}
