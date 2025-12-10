"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import styles from "./home.module.css"

export default function Home() {
  const [currentImageNum, setCurrentImageNum] = useState<number>(1)
  const imageMarker = useRef<HTMLDivElement>(null)

  const activeImagepageNum = `image_${currentImageNum}`

  return (
    <div className={styles.homeBox}>
      <div className={styles.carousel}>
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
