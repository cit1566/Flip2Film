"use client"

import Button from "@/components/atom/button/button"
import ToggleButton from "@/components/atom/toggle/toggle-button"
import ReviewContentBox from "@/components/review/review-content-box"
import type { Review } from "@/libs/supabase/types"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import Tiptap from "../../tiptap/tiptap"
import ReviewCategory from "./category"
import Input from "./input"
import Label from "./label"
import styles from "./review-create-form.module.css"
import StarRating from "./star-rating"

type ReviewFormData = Review

export default function ReviewCreateForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      category: "movie",
      rating: 5,
      is_public: true,
      spoiler: false,
    },
  })

  // 실시간 글자 수 카운트
  const titleValue = watch("title") || ""
  const titleLength = titleValue.length

  async function onSubmit(data: ReviewFormData) {
    const loadingToast = toast.loading("리뷰를 등록하는 중...")

    try {
      console.log("제출된 데이터:", data)

      // Supabase 저장 로직
      // const { data: insertedData, error } = await supabase
      //   .from('reviews')
      //   .insert({
      //     category: data.category,
      //     item_id: data.item_id,
      //     title: data.title,
      //     content: data.content,
      //     rating: data.rating,
      //     is_public: data.is_public,
      //     spoiler: data.spoiler,
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;

      // 성공 토스트
      toast.success("리뷰가 등록되었습니다.", {
        id: loadingToast,
      })
    } catch {
      toast.error("리뷰 등록에 실패했습니다. 다시 시도해주세요.", {
        id: loadingToast,
      })
    }
  }

  return (
    <form className={styles.inputsContainer}>
      {/* 리뷰 카테고리 */}
      <Controller
        name="category"
        control={control}
        rules={{ required: "카테고리를 선택해주세요" }}
        render={({ field, fieldState }) => (
          <ReviewCategory
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {/* 검색 */}
      <ReviewContentBox>
        <Input
          labelText="영화/도서 검색"
          id="item_id"
          type="text"
          mandatory={true}
          placeholder="영화 또는 도서명을 검색하세요."
          error={errors.item_id?.message}
          {...register("item_id", {
            required: "영화 또는 도서를 선택해주세요",
            validate: value =>
              value.trim() !== "" || "영화 또는 도서를 선택해주세요",
          })}
        />

        {/* 리뷰 작성(제목, 내용) */}

        <Input
          labelText="제목"
          id="title"
          type="text"
          mandatory={true}
          currentLength={titleLength}
          maxLength={10}
          error={errors.title?.message}
          {...register("title", {
            required: "제목을 입력해주세요",
            maxLength: {
              value: 10,
              message: "제목은 10자 이내로 입력해주세요",
            },
            validate: value => value.trim() !== "" || "제목을 입력해주세요",
          })}
        />
        <Tiptap />
        {/* <Textarea
          labelText="감상평"
          id="content"
          mandatory={true}
          secondInput={true}
          rows={8}
          error={errors.content?.message}
          {...register("content", {
            required: "감상평을 입력해주세요",
            maxLength: {
              value: 10,
              message: "감상평은 10자 이내로 입력해주세요",
            },
            validate: value => value.trim() !== "" || "감상평을 입력해주세요",
          })}
        /> */}
        <p className={styles.letterLimit}>0 / 10000</p>

        {/* 별점 */}

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} />
          )}
        />

        {/* 리뷰 공개 설정 */}

        <Label labelText="공개 여부" id="is_public" />
        <div className={styles.toggleContainer}>
          <p className={styles.reviewPublicMessage}>
            다른 사용자에게 내 감상평을 공개합니다.
          </p>
          <Controller
            name="is_public"
            control={control}
            render={({ field }) => (
              <ToggleButton
                checked={field.value}
                id="is_public"
                name="is_public"
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </ReviewContentBox>

      {/* 폼 제출 */}
      <div className={styles.submitButtonsContainer}>
        <Button
          title={isSubmitting ? "등록 중..." : "등록"}
          variant="green"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
        <Button
          title="취소"
          variant="base"
          type="button"
          onClick={() => window.history.back()}
        />
      </div>
    </form>
  )
}
