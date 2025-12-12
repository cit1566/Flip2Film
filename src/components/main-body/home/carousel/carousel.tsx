import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useDebounceCallback } from "../../../../hooks/useDebounceCallback"
import styles from "./carousel.module.css"

export default function Carousel() {
  const [currentImageNum, setCurrentImageNum] = useState<number>(0)
  const [currentImageSize, setCurrentImageSize] = useState<number>(200)
  const imageMarker = useRef<HTMLDivElement>(null)
  const scrollInner = useRef<HTMLDivElement>(null)
  const activeImagepageNum = `image_${currentImageNum + 1}`

  const getImageHeight = useDebounceCallback(() => {
    const firstImage = scrollInner.current?.children[0]
    if (!firstImage) return

    const heightStr = getComputedStyle(firstImage).getPropertyValue("height")
    const height = Math.round(Number(heightStr.replace("px", "")))
    setCurrentImageSize(height)

    return height
  }, 200)

  useEffect(() => {
    getImageHeight()

    const getTranslateYoffset = (imageHeight: number, currentIndex: number) => {
      return -(currentIndex * imageHeight)
    }
    const transformOffset = `translateY(${getTranslateYoffset(
      currentImageSize,
      currentImageNum
    )}px)`

    if (scrollInner.current) {
      scrollInner.current.style.transform = transformOffset
    }

    window.addEventListener("resize", getImageHeight)

    return () => window.removeEventListener("resize", getImageHeight)
  }, [currentImageNum, currentImageSize, getImageHeight])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageNum(num => (num >= 4 ? 0 : num + 1))
    }, 6000)

    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <div className={styles.carousel}>
        <div ref={scrollInner} className={styles.scrollInner}>
          <Image
            src="/movie-poster.webp"
            alt="연습 포스터"
            width={50}
            height={100}
          ></Image>
          <Image
            src="/movie-poster.webp"
            alt="연습 포스터"
            width={50}
            height={100}
          ></Image>
          <Image
            src="/movie-poster.webp"
            alt="연습 포스터"
            width={50}
            height={100}
          ></Image>
          <Image
            src="/movie-poster.webp"
            alt="연습 포스터"
            width={50}
            height={100}
          ></Image>
          <Image
            src="/movie-poster.webp"
            alt="연습 포스터"
            width={50}
            height={100}
          ></Image>
        </div>
      </div>
      {/* 캐러셀 넘버 컴포넌트 */}
      <div className={styles.imageNumberBox}>
        <div
          ref={imageMarker}
          className={`${styles.currentImageMarker} ${styles[activeImagepageNum]}`}
        ></div>
        <div className={styles.imageNumber}>
          {Array.from({ length: 5 }, (_, index) => {
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentImageNum(index)
                }}
                className={`${currentImageNum === index && styles.activeImagePageNum}`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
