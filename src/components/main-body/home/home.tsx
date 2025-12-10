"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import styles from "./home.module.css"

export default function Home() {
  const [currentImageNum, setCurrentImageNum] = useState<number>(1)
  const [currentImageSize, setCurrentImageSize] = useState<number>(200)
  const imageMarker = useRef<HTMLDivElement>(null)
  const scrollInner = useRef<HTMLDivElement>(null)
  const activeImagepageNum = `image_${currentImageNum}`

  useEffect(() => {
    // 이미지 사이즈 - ex) "199.975px"
    let ImageSize: string | null = null

    // 이미지 사이즈 숫자만 - ex) 200
    let ImageSizeToNum: number = 0

    if (scrollInner.current?.children[0]) {
      ImageSize = getComputedStyle(
        scrollInner.current?.children[0]
      ).getPropertyValue("height")
      const removeImageSizeToPx = ImageSize.split("px", 1)
      ImageSizeToNum = Math.round(Number(...removeImageSizeToPx))
      setCurrentImageSize(ImageSizeToNum)
    }

    function handleResize() {
      if (scrollInner.current?.children[0]) {
        ImageSize = getComputedStyle(
          scrollInner.current?.children[0]
        ).getPropertyValue("height")
        const removeImageSizeToPx = ImageSize.split("px", 1)
        ImageSizeToNum = Math.round(Number(...removeImageSizeToPx))
      }
    }

    window.addEventListener("resize", handleResize)

    if (scrollInner.current) {
      switch (currentImageNum) {
        case 1:
          scrollInner.current.style.transform = `translateY(${0}px)`
          break
        case 2:
          scrollInner.current.style.transform = `translateY(-${ImageSize ?? "200px"})`
          break
        case 3:
          scrollInner.current.style.transform = `translateY(-${ImageSizeToNum * 2}px)`
          break
        case 4:
          scrollInner.current.style.transform = `translateY(-${ImageSizeToNum * 3}px)`
          break
        case 5:
          scrollInner.current.style.transform = `translateY(-${ImageSizeToNum * 4}px)`
          break
      }
    }
  }, [currentImageNum, currentImageSize])

  return (
    <div className={styles.homeBox}>
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
                key={index + 1}
                type="button"
                onClick={() => setCurrentImageNum(index + 1)}
                className={`${currentImageNum === index + 1 && styles.activeImagePageNum}`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
