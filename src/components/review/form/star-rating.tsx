"use client"

import { LucideStar } from "lucide-react"
import styles from "./star-rating.module.css"

const STARS = [1, 2, 3, 4, 5]

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export default function StarRating({ value, onChange }: StarRatingProps) {
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
              checked={value === star}
              onChange={() => onChange(star)}
            />
            <LucideStar
              className={`${styles.star} ${star <= value ? styles.active : ""}`}
            />
          </label>
        ))}
      </div>
      <p className={styles.text}>별점을 선택해주세요.</p>
    </>
  )
}
