import type { ReviewPartial } from "@/libs/supabase/types.ts"
import { LucideHeart, LucidePen, LucideStar, LucideTrash2 } from "lucide-react"
import styles from "./review-detail-content.module.css"

interface ReviewDetailProps {
  review: ReviewPartial
}

export default function ReviewDetailContent({ review }: ReviewDetailProps) {
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{review.title}</h1>

      <div className={styles.topContentsWrapper}>
        <div className={styles.user}>
          <div className={styles.profilePicture}>
            {/* <ProfilePicture /> */}
          </div>
          <div className={styles.texts}>
            <p className={styles.userName}>{review.review_owner_id}</p>
            <p className={styles.createdAt}>{review.created_at}</p>
          </div>
        </div>
        <div className={styles.rating}>
          <LucideStar className={`${styles.star} ${styles.active}`} />
          <LucideStar className={`${styles.star} ${styles.active}`} />
          <LucideStar className={`${styles.star} ${styles.active}`} />
          <LucideStar className={`${styles.star} ${styles.active}`} />
          <LucideStar className={styles.star} />
          <span className={styles.starNumber}>{review.rating}.0</span>
        </div>
      </div>

      <span className={styles.divider}></span>
      <div className={styles.reviewContent}>{review.content}</div>
      <span className={styles.divider}></span>

      <div className={styles.buttons}>
        <div className={styles.like}>
          <button type="button" className={styles.reviewButton}>
            <span className={styles.icon}>
              <LucideHeart className={styles.likeIcon} />
            </span>
            <span className={styles.likeText}>좋아요</span>
            <span className={styles.likeNumber}>{review.liked}</span>
          </button>
        </div>
        <div className={styles.reviewManage}>
          <button type="button" className={styles.reviewButton}>
            <span className={styles.icon}>
              <LucidePen className={styles.editIcon} />
            </span>
            <span className={styles.editText}>수정</span>
          </button>
          <button type="button" className={styles.reviewButton}>
            <span className={styles.icon}>
              <LucideTrash2 className={styles.deleteIcon} />
            </span>
            <span className={styles.deleteText}>삭제</span>
          </button>
        </div>
      </div>
    </article>
  )
}
