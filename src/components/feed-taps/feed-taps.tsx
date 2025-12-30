"use client"

import { useState } from "react"
import FeedCard from "./feed-card"
import styles from "./feed-taps.module.css"
import DUMMYData from "./feed.json"
import NoReviews from "./no-reviews"

// -----------------------------------------------------------
// 카드 아이템 타입
export interface CardItem {
  id: number
  title: string
  description: string
}

// 탭 타입
export interface Tab {
  id: string
  label: string
  items: CardItem[]
}

// 전체 데이터 타입
export type TabsData = Tab[]

// -----------------------------------------------------------

export default function FeedTaps() {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: TabsData = DUMMYData

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
