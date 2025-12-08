import { ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Review } from "../../libs/supabase/types"
import { extractImageSrcList } from "../../utils/extractImageSrcList"
import removeImageTags from "../../utils/removeImageTag"
import styles from "./main-review-item.module.css"

interface MainReviewItemProps {
  title: Review["title"]
  category: Review["category"]
  content: Review["content"]
  like: Review["liked"]
  userId: Review["review_owner_id"]
}

export default function MainReviewItem({
  title,
  category,
  content,
  like,
  userId,
}: MainReviewItemProps) {
  return (
    <article className={styles.mainReviewItem}>
      {/* ------- 왼쪽 포스터 영역 ------- */}
      <Link href="/" className={styles.posterLink}>
        <Image
          src={`${extractImageSrcList(content)}`}
          alt="포스터"
          width={200}
          height={300}
          className={styles.posterImage}
        />
      </Link>

      {/* ------- 오른쪽 텍스트 영역 ------- */}
      <div className={styles.textBox}>
        {/* 제목 + 상세정보 + 본문 전체가 클릭되도록 */}
        <Link href="/" className={styles.linkArea}>
          {/* 제목 */}
          <h2 className={styles.title}>{title}</h2>

          {/* 본문 미리보기 */}
          <div
            className={styles.plot}
            dangerouslySetInnerHTML={{ __html: removeImageTags(content) }}
          >
            {/* {content} */}
          </div>
        </Link>

        {/* 영화 or 도서 정보 */}
        <p className={styles.subjectDetail}>{category}</p>

        {/* 작성자 + 좋아요 */}
        <div className={styles.idWithLike}>
          {/* 작성자 */}
          <Link href="/" className={styles.userId}>
            <Image
              src="/next-js.svg"
              alt="사용자 프로필"
              width={20}
              height={20}
            />
            {userId}
          </Link>

          {/* 좋아요 수 */}
          <span className={styles.likes}>
            <ThumbsUp size={20} />
            <span>{like}</span>
          </span>
        </div>
      </div>
    </article>
  )
}
