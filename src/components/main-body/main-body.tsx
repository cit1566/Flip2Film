import Link from "next/link"
import itemListDummy from "../main-review-item/dummy.json"
import MainReviewItem from "../main-review-item/main-review-item"
import styles from "./main-body.module.css"

export default function MainBody() {
  return (
    <div className={styles.mainBodyBox}>
      <div className={styles.navLinkBox}>
        <Link href="/" className={styles.isActive}>
          홈
        </Link>
        <Link href="./movie">영화</Link>
        <Link href="./books">도서</Link>
        <div className={styles.activeLine}></div>
      </div>
      <div className={styles.contentBox}>
        {itemListDummy.map(item => {
          return (
            <MainReviewItem
              key={item.id}
              title={item.title}
              category={item.category}
              content={item.content}
              like={item.liked}
              userId={item.review_owner_id}
            />
          )
        })}
      </div>
    </div>
  )
}
