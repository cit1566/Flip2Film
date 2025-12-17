import Button from "@/components/atom/button/button"
import ReviewContentBox from "@/components/review/review-content-box"
import styles from "./category.module.css"
import Label from "./label"

interface ReviewCategoryProps {
  value: string
  onChange: (value: string) => void
  error?: string | undefined
}

export default function ReviewCategory({
  value,
  onChange,
  error,
}: ReviewCategoryProps) {
  return (
    <ReviewContentBox>
      <Label labelText="카테고리" id="category" mandatory={true} />
      <div className={styles.categoryButtonsContainer}>
        <Button
          title="영화"
          variant={value === "movie" ? "green" : "base"}
          onClick={() => onChange("movie")}
          type="button"
        />
        <Button
          title="도서"
          variant={value === "book" ? "green" : "base"}
          onClick={() => onChange("book")}
          type="button"
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </ReviewContentBox>
  )
}
