"use client"

import { useState } from "react"
import FeedCard from "./feed-card"
import styles from "./feed-taps.module.css"
import DUMMYData from "./feed.json"
import NoReviews from "./no-reviews"

// -----------------------------------------------------------
// 타입
export interface CardItem {
  id: number
  title: string
  description: string
}

export interface Tab {
  id: string
  label: string
  items: CardItem[]
}

export type TabsData = Tab[]

// -----------------------------------------------------------

export default function FeedTaps() {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabs: TabsData = DUMMYData

  return (
    <section className={styles.feedTapsSection}>
      <h2 className="sr-only">사용자 감상평 피드</h2>

      <div className={styles.tabsContainer}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={tab.id}
              aria-selected={selectedTab === index}
              aria-controls={`${tab.id}-panel`}
              tabIndex={selectedTab === index ? 0 : -1}
              className={`${styles.tab} ${
                selectedTab === index ? styles.isActive : ""
              }`}
              onClick={() => setSelectedTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tabs.map((tab, index) => (
          <div
            key={`${tab.id}-panel`}
            role="tabpanel"
            id={`${tab.id}-panel`}
            aria-labelledby={tab.id}
            hidden={selectedTab !== index}
            className={styles.tabPanel}
          >
            {tab.items.length === 0 ? (
              <NoReviews />
            ) : (
              <ul className={styles.reviewList}>
                {tab.items.map(item => (
                  <li key={item.id} className={styles.listItem}>
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
