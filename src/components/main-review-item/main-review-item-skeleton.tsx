import styles from "./main-review-item-skeleton.module.css"

export default function MainReviewItemSkeleton() {
  return (
    <article
      className={styles.mainReviewItem}
      aria-busy="true"
      aria-label="리뷰 로딩 중"
    >
      {/* ------- 왼쪽 포스터 영역 ------- */}
      <div className={styles.posterWrapper} aria-hidden="true">
        <div className={styles.posterSkeleton} />
      </div>

      {/* ------- 오른쪽 텍스트 영역 ------- */}
      <div className={styles.textBox}>
        {/* 제목 + 본문 */}
        <div className={styles.linkArea}>
          {/* 제목 */}
          <div className={styles.titleSkeleton} />

          {/* 본문 미리보기 */}
          <div className={styles.plot}>
            <div className={styles.lineFull} />
            <div className={styles.lineMedium} />
            <div className={styles.lineShort} />
          </div>
        </div>

        {/* 카테고리 */}
        <div className={styles.categorySkeleton} />

        {/* 작성자 + 좋아요 */}
        <div className={styles.idWithLike}>
          <div className={styles.userSkeleton} />
          <div className={styles.likeSkeleton} />
        </div>
      </div>
    </article>
  )
}
