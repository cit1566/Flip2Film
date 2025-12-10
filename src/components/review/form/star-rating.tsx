"use client"

import { LucideStar } from "lucide-react"
import { useState } from "react"
import styles from "./star-rating.module.css"

const STARS = [1, 2, 3, 4, 5]

export default function StarRating() {
  const [rating, setRating] = useState(5)

  return (
    <>
      <div className={styles.StarsWrapper}>
        {STARS.map(star => (
          <label key={star} className={styles.starLabel}>
            <input
              type="radio"
              name="rating"
              className={styles.radioButton}
              value={star}
              onChange={() => setRating(star)}
            />
            <LucideStar
              className={`${styles.star} ${star <= rating ? styles.active : ""}`}
            />
          </label>
        ))}
      </div>
      <p className={styles.text}>별점을 선택해주세요.</p>
    </>
  )
}
