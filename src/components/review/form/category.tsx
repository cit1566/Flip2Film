import Button from "@/components/atom/button/button"
import styles from "./category.module.css"
import InputContainer from "./input-container"
import Label from "./label"

export default function ReviewCategory() {
  return (
    <InputContainer>
      <Label labelText="카테고리" id="category" mandatory={true} />
      <div className={styles.categoryButtonsContainer}>
        <Button title="영화" variant="green" />
        <Button title="도서" variant="base" />
      </div>
    </InputContainer>
  )
}
