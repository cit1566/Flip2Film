"use client"

import FeedCard from "./feed-card"
import styles from "./feed-taps.module.css"
import { useState } from "react"
import NoReviews from "./no-reviews"

export default function FeedTaps() {
  const [selectedTab, setSelectedTab] = useState(0)

  // const tabs = [
  //   {
  //     id: "tab1",
  //     label: "전체글",
  //     items: [
  //       { id: 1, title: "카드 1", description: "설명 1" },
  //       { id: 2, title: "카드 2", description: "설명 2" },
  //     ],
  //   },
  //   {
  //     id: "tab2",
  //     label: "영화",
  //     items: [
  //       { id: 3, title: "카드 3", description: "설명 3" },
  //       { id: 4, title: "카드 4", description: "설명 4" },
  //       { id: 5, title: "카드 4", description: "설명 4" },
  //       { id: 6, title: "카드 4", description: "설명 4" },
  //       { id: 7, title: "카드 4", description: "설명 4" },
  //       { id: 8, title: "카드 4", description: "설명 4" },
  //     ],
  //   },
  //   {
  //     id: "tab3",
  //     label: "도서",
  //     items: [],
  //   },
  // ]

  return (
    <section className={styles.feedTapsSection}>
      <h2 className="sr-only">사용자 감상평 피드</h2>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, index) => (
            <button
              className={
                selectedTab === index
                  ? `${styles.tab} ${styles.isActive}`
                  : styles.tab
              }
              key={tab.id}
              role="tab"
              id={tab.id}
              aria-selected={selectedTab === index}
              aria-controls={`${tab.id}-panel`}
              tabIndex={selectedTab === index ? 0 : -1}
              onClick={() => setSelectedTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab, index) => (
          <div
            className={styles.tabPanel}
            key={`${tab.id}-panel`}
            role="tabpanel"
            id={`${tab.id}-panel`}
            aria-labelledby={tab.id}
            hidden={selectedTab !== index ? true : undefined}
            tabIndex={0}
          >
            {tab.items.length === 0 ? (
              <NoReviews />
            ) : (
              <ul className={styles.reviewList}>
                {tab.items.map(item => (
                  <li className={styles.listItem} key={item.id}>
                    <FeedCard {...item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
