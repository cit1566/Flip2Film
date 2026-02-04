// carousel-skeleton.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./carousel-skeleton.module.css"

interface CarouselSkeletonProps {
  /** 영화(큰 배너) 슬라이드 개수 */
  movieSlides?: number
  /** 책 슬라이드 개수(4개 묶음이 1슬라이드) */
  bookSlides?: number
}

export default function CarouselSkeleton({
  movieSlides = 3,
  bookSlides = 2,
}: CarouselSkeletonProps) {
  const totalSlides = movieSlides + bookSlides

  return (
    <div className={styles.carouselContainer} aria-busy="true">
      <div className={styles.carouselWrapper}>
        {/* 이전 버튼(비활성) */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          aria-label="이전 슬라이드"
          disabled
        >
          <ChevronLeft />
        </button>

        <div
          className={styles.carousel}
          role="status"
          aria-label="캐러셀 로딩 중"
        >
          <ul className={styles.scrollInner}>
            {/* Movie skeleton slides */}
            {Array.from({ length: movieSlides }, (_, idx) => (
              <li
                key={`movie-skel-${idx}`}
                className={`${styles.posterList} ${styles.movieList}`}
              >
                {/* 큰 배너 이미지 영역 */}
                <div className={`${styles.skeleton} ${styles.moviePoster}`} />

                {/* 설명 박스 */}
                <div className={styles.descriptionBox}>
                  <div className={styles.titleBlock}>
                    <div className={`${styles.skeleton} ${styles.titleLine}`} />
                    <div
                      className={`${styles.skeleton} ${styles.titleLine2}`}
                    />
                  </div>

                  <div className={styles.categoryDivBox}>
                    <div
                      className={`${styles.skeleton} ${styles.metaChip}`}
                      aria-hidden="true"
                    />
                    <div
                      className={`${styles.skeleton} ${styles.metaChip}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </li>
            ))}

            {/* Book skeleton slides (4 items each) */}
            {Array.from({ length: bookSlides }, (_, slideIdx) => (
              <li
                key={`book-skel-${slideIdx}`}
                className={`${styles.posterList} ${styles.bookList}`}
              >
                {Array.from({ length: 4 }, (_, itemIdx) => (
                  <div
                    key={`book-skel-item-${slideIdx}-${itemIdx}`}
                    className={styles.innerBookItem}
                  >
                    <div className={`${styles.skeleton} ${styles.bookCover}`} />
                    <div className={styles.bookText}>
                      <div
                        className={`${styles.skeleton} ${styles.bookTitle}`}
                      />
                      <div
                        className={`${styles.skeleton} ${styles.bookAuthor}`}
                      />
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* 다음 버튼(비활성) */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonNext}`}
          aria-label="다음 슬라이드"
          disabled
        >
          <ChevronRight />
        </button>
      </div>

      {/* 인디케이터(고정 개수, 비활성) */}
      <div className={styles.imageNumberBox} aria-hidden="true">
        <div className={styles.imageNumber}>
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={`indicator-skel-${index}`}
              type="button"
              className={styles.indicator}
              disabled
            >
              <span className={styles.circle} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
