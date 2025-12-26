import { useDebounceCallback } from "@/hooks/useDebounceCallback"
import { TMDB } from "@/libs/api/movie/movie-api"
import { Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useId, useRef, useState, useCallback, useMemo } from "react"
import type { PosterListProps } from "../home"
import styles from "./carousel.module.css"

interface CarouselProps {
  posterList: PosterListProps
}

// 유틸리티 함수: 배열을 N개씩 묶기
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// 유틸리티 함수: Transform offset 계산
const getTranslateYOffset = (
  imageHeight: number,
  currentIndex: number
): string => {
  return `translateY(${-(currentIndex * imageHeight)}px)`
}

export default function Carousel({ posterList }: CarouselProps) {
  const [currentImageNum, setCurrentImageNum] = useState<number>(0)
  const [currentImageSize, setCurrentImageSize] = useState<number>(200)

  const scrollInner = useRef<HTMLUListElement>(null)
  const id = useId()

  // TMDB 포스터 URL 생성
  const TMDB_POSTER_BASE_URL = useMemo(
    () =>
      TMDB.posterURL.secure_base_url + TMDB.posterURL.backdrop_sizes.original,
    []
  )

  // 영화 데이터 (최대 3개)
  const movieList = useMemo(
    () => posterList.movie.slice(0, 3),
    [posterList.movie]
  )

  // 책 데이터를 4개씩 묶기
  const bookSlides = useMemo(
    () => chunkArray(posterList.book, 4),
    [posterList.book]
  )

  // 전체 슬라이드 개수
  const totalSlides = movieList.length + bookSlides.length

  // 이미지 높이 측정 (debounce 적용)
  const getImageHeight = useDebounceCallback(() => {
    const firstImage = scrollInner.current?.children[0]
    if (!firstImage) return

    const heightStr = getComputedStyle(firstImage).getPropertyValue("height")
    const height = Math.round(Number(heightStr.replace("px", "")))
    setCurrentImageSize(height)
  }, 200)

  // Transform 적용
  useEffect(() => {
    if (!scrollInner.current) return

    const transformOffset = getTranslateYOffset(
      currentImageSize,
      currentImageNum
    )
    scrollInner.current.style.transform = transformOffset
  }, [currentImageNum, currentImageSize])

  // 리사이즈 이벤트 리스너
  useEffect(() => {
    getImageHeight()
    window.addEventListener("resize", getImageHeight)
    return () => window.removeEventListener("resize", getImageHeight)
  }, [getImageHeight])

  // 슬라이드 변경 핸들러
  const handleSlideChange = useCallback((index: number) => {
    setCurrentImageNum(index)
  }, [])

  // 자동 슬라이드 (필요시 주석 해제)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageNum(num => (num >= totalSlides - 1 ? 0 : num + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [totalSlides])

  return (
    <>
      <div className={styles.carousel}>
        <ul ref={scrollInner} className={styles.scrollInner}>
          {/* 영화 포스터 렌더링 */}
          {movieList.map(movie => (
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
                priority
              />
              <div className={styles.descriptionBox}>
                <h2 className={styles.posterTitle}>
                  <span className={styles.english}>{movie.original_title}</span>
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
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
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
    </>
  )
}
