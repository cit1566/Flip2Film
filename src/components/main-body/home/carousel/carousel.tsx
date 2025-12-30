import type { PosterListProps } from "@/app/page"
import { useDebounceCallback } from "@/hooks/useDebounceCallback"
import type { PosterPathProps } from "@/libs/api/movie/movie-api"
import chunkArray from "@/utils/chunkArray"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import styles from "./carousel.module.css"

interface CarouselProps {
  posterList: PosterListProps
  TMDBPosterUrl: PosterPathProps
}

// 유틸리티 함수: Transform offset 계산
const getTranslateXOffset = (
  imageWidth: number,
  currentIndex: number
): string => {
  return `translateX(${-(currentIndex * imageWidth)}px)`
}

export default function Carousel({ posterList, TMDBPosterUrl }: CarouselProps) {
  const [currentImageNum, setCurrentImageNum] = useState<number>(0)
  const [currentImageSize, setCurrentImageSize] = useState<number>(1280)

  const scrollInner = useRef<HTMLUListElement>(null)
  const id = useId()

  // TMDB 포스터 URL 생성
  const TMDB_POSTER_BASE_URL = useMemo(
    () => TMDBPosterUrl.secure_base_url + TMDBPosterUrl.backdrop_sizes.original,
    [TMDBPosterUrl]
  )

  // 영화 데이터 (최대 3개)
  const movieList = useMemo(
    () => posterList.movie.filter(m => m.backdrop_path).slice(0, 3),
    [posterList.movie]
  )

  // 책 데이터를 4개씩 묶기
  const bookSlides = useMemo(
    () =>
      chunkArray(
        posterList.book.filter(book => book.cover),
        4
      ),
    [posterList.book]
  )

  // 전체 슬라이드 개수
  const totalSlides = movieList.length + bookSlides.length

  // 이미지 너비 측정 (debounce 적용)
  const getImageWidth = useDebounceCallback(() => {
    const firstImage = scrollInner.current?.children[0]
    if (!firstImage) return

    const widthStr = getComputedStyle(firstImage).getPropertyValue("width")
    const width = Math.round(Number(widthStr.replace("px", "")))
    setCurrentImageSize(width)
  }, 200)

  // Transform 적용
  useEffect(() => {
    if (!scrollInner.current) return

    const transformOffset = getTranslateXOffset(
      currentImageSize,
      currentImageNum
    )
    scrollInner.current.style.transform = transformOffset
  }, [currentImageNum, currentImageSize])

  // 리사이즈 이벤트 리스너
  useEffect(() => {
    getImageWidth()
    window.addEventListener("resize", getImageWidth)
    return () => window.removeEventListener("resize", getImageWidth)
  }, [getImageWidth])

  // 슬라이드 변경 핸들러
  const handleSlideChange = useCallback((index: number) => {
    setCurrentImageNum(index)
  }, [])

  // 이전 슬라이드
  const handlePrevSlide = useCallback(() => {
    setCurrentImageNum(num => (num <= 0 ? totalSlides - 1 : num - 1))
  }, [totalSlides])

  // 다음 슬라이드
  const handleNextSlide = useCallback(() => {
    setCurrentImageNum(num => (num >= totalSlides - 1 ? 0 : num + 1))
  }, [totalSlides])

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      if (totalSlides === 0) return
      setCurrentImageNum(num => (num >= totalSlides - 1 ? 0 : num + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [totalSlides])

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        {/* 이전 버튼 */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          onClick={handlePrevSlide}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft />
        </button>

        <div className={styles.carousel}>
          <ul ref={scrollInner} className={styles.scrollInner}>
            {/* 영화 포스터 렌더링 */}
            {movieList.map((movie, index) => (
              <li
                className={`${styles.posterList} ${styles.movieList}`}
                key={`movie-${movie.id}`}
              >
                <Image
                  className={styles.poster}
                  src={`${TMDB_POSTER_BASE_URL}${movie.backdrop_path}`}
                  alt={movie.title}
                  width={1280}
                  height={400}
                  priority={index === 0}
                />
                <div className={styles.descriptionBox}>
                  <h2 className={styles.posterTitle}>
                    <span className={styles.english}>
                      {movie.original_title}
                    </span>
                    <br />
                    <span className={styles.korean}>{movie.title}</span>
                  </h2>
                  <div className={styles.categoryDivBox}>
                    <p className={styles.releaseDate}>{movie.release_date}</p>
                    <p className={styles.voteAverage}>
                      <Star />
                      {movie.vote_average}
                    </p>
                  </div>
                </div>
              </li>
            ))}

            {/* 책 포스터 렌더링 (4개씩 묶음) */}
            {bookSlides.map((bookSlide, slideIndex) => (
              <li
                className={`${styles.posterList} ${styles.bookList}`}
                key={`book-slide-${id}-${slideIndex}`}
              >
                {bookSlide.map(book => (
                  <div key={book.itemId} className={styles.innerBookItem}>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        className={styles.poster}
                        src={book.cover}
                        alt={book.title}
                        width={200}
                        height={290}
                      />
                    </a>
                    <div className={styles.descriptionBox}>
                      <h2>{book.title}</h2>
                      <p>{book.author}</p>
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* 다음 버튼 */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonNext}`}
          onClick={handleNextSlide}
          aria-label="다음 슬라이드"
        >
          <ChevronRight />
        </button>
      </div>

      {/* 캐러셀 인디케이터 */}
      <div className={styles.imageNumberBox}>
        <div className={styles.imageNumber}>
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={`indicator-${index}`}
              type="button"
              onClick={() => handleSlideChange(index)}
              className={
                currentImageNum === index ? styles.activeImagePageNum : ""
              }
              aria-label={`슬라이드 ${index + 1}로 이동`}
            >
              <span className={styles.circle} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
