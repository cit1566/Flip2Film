"use client"

import Button from "@/components/atom/button/button"
import ToggleButton from "@/components/atom/toggle/toggle-button"
import { useState } from "react"
import ReviewCategory from "./category"
import Input from "./input"
import ReviewContentBox from "@/components/review/review-content-box"
import styles from "./review-create-form.module.css"
import Label from "./label"
import StarRating from "./star-rating"

export default function ReviewCreateForm() {
  const [isPublic, setIsPublic] = useState(true)

  return (
    <form className={styles.inputsContainer}>
      {/* 리뷰 카테고리 */}
      <ReviewCategory />

      {/* 검색 */}
      <ReviewContentBox>
        <Input
          labelText="영화/도서 검색"
          id="item"
          name="item"
          type="text"
          mandatory={true}
          placeholder="영화 또는 도서명을 검색하세요."
        />
      </ReviewContentBox>

      {/* 리뷰 작성(제목, 내용) */}
      <ReviewContentBox>
        <Input
          labelText="제목"
          id="title"
          name="title"
          type="text"
          mandatory={true}
        />
        <Input
          labelText="감상평"
          id="review"
          name="review"
          type="text"
          mandatory={true}
          secondInput={true}
        />
        <p className={styles.letterLimit}>0 / 10000</p>
      </ReviewContentBox>

      {/* 별점 */}
      <ReviewContentBox>
        <StarRating />
      </ReviewContentBox>

      {/* 리뷰 공개 설정 */}
      <ReviewContentBox>
        <Label labelText="공개 여부" id="is_public" />
        <div className={styles.toggleContainer}>
          <p className={styles.reviewPublicMessage}>
            다른 사용자에게 내 감상평을 공개합니다.
          </p>
          <ToggleButton
            checked={isPublic}
            id="is_public"
            name="is_public"
            onChange={value => setIsPublic(value)}
          />
        </div>
      </ReviewContentBox>

      {/* 폼 제출 */}
      <div className={styles.submitButtonsContainer}>
        <Button title="등록" variant="green" type="submit" />
        <Button title="취소" variant="base" />
      </div>
    </form>
  )
}
