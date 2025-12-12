import Button from "@/components/atom/button/button"
import styles from "./category.module.css"
import ReviewContentBox from "@/components/review/review-content-box"
import Label from "./label"

export default function ReviewCategory() {
  return (
    <ReviewContentBox>
      <Label labelText="카테고리" id="category" mandatory={true} />
      <div className={styles.categoryButtonsContainer}>
        <Button title="영화" variant="green" />
        <Button title="도서" variant="base" />
      </div>
    </ReviewContentBox>
  )
}
