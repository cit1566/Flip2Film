import { ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import styles from "./main-review-item.module.css"

export default function MainReviewItem() {
  return (
    <section className={styles.mainReviewItem}>
      {/* ------- 왼쪽 포스터 영역 ------- */}
      <Link href="/" className={styles.posterLink}>
        <Image
          src="/image/noImage.png"
          alt="poster"
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
          <h2 className={styles.title}>감상평 제목sdfsdfsdfsdfsdf</h2>

          {/* 본문 미리보기 */}
          <p className={styles.plot}>
            AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의
            통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다.
            그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는
            양날의 검이 될 수 있습니다. AI 코딩 도구에만 의존하는 주니어
            개발자는 경쟁력을 갖출 수 없기 때문입니다. 오히려 더 깊이 있게
            언어를 학습하고 좋은 질문을 할 수 있도록 문해력(Literacy)을 기르는
            것이 필요합니다. 다만 AI 도구를 완전히 배제하는 것이 아닌 학습을
            위한 파트너로서 활용할 것을 추천합니다.
          </p>
        </Link>

        {/* 영화 or 도서 정보 */}
        <p className={styles.subjectDetail}>
          영화 제목, 영화 개봉일, 영화 감독
        </p>

        {/* 작성자 + 좋아요 */}
        <div className={styles.idWithLike}>
          {/* 작성자 */}
          <Link href="/" className={styles.userId}>
            <Image
              src="/next-js.svg"
              alt="userProfile"
              width={20}
              height={20}
            />
            말랑콩떡
          </Link>

          {/* 좋아요 수 */}
          <span className={styles.likes}>
            <ThumbsUp size={20} color="#1ED534" />
            <span>25</span>
          </span>
        </div>
      </div>
    </section>
  )
}
