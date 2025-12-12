import ReviewDetailContent from "@/components/review/detail/review-detail-content"
import ReviewContentBox from "@/components/review/review-content-box"
import ItemCard from "../../../components/review/detail/item-card"
import styles from "./page.module.css"

const testReview = {
  category: "movie",
  title: "긴장감 넘치는 스릴러의 정석",
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi doloribus nulla quisquam sit! Rem facilis deleniti repudiandae provident voluptatibus cumque deserunt fuga voluptatum! Rem nostrum autem temporibus minus, reprehenderit necessitatibus.",
  created_at: "2025년 12월 10일",
  is_public: true,
  liked: 7,
  rating: 4,
  review_owner_id: "홍길동이",
  spoiler: false,
}

const testMovie = {
  title: "시간 없음 안죽음",
  releaseDate: 2025,
  director: "크리스토퍼 놀란 감독사마",
  genre: "Thriller",
  casts: "김조이, 이현수, 지한석",
}

export default function ReviewDetailPage() {
  return (
    <div className={styles.reviewDetail}>
      <ReviewContentBox>
        <ItemCard item={testMovie} />
      </ReviewContentBox>
      <ReviewContentBox>
        <ReviewDetailContent review={testReview} />
      </ReviewContentBox>
    </div>
  )
}
