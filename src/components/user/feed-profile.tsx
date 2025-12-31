"use client"

import ProfilePicture from "@/components/user/profile-picture"
import { useState } from "react"
import Button from "../atom/button/button"
import styles from "./feed-profile.module.css"

export default function UserInfo() {
  const [subscribe, setSubscribe] = useState<Boolean>(false)
  return (
    <article className={styles.userInfoWrapper}>
      <ProfilePicture classStyle={styles.picture} />
      <div className={styles.contents}>
        <header className={styles.summary}>
          <div className={styles.summaryIdentitiy}>
            <h2 className={styles.nickname}>즐거운ㄴㅇㄹㄴㅇㄹㄴㅇㄴㅇㄹ</h2>
            <p className={styles.userName}>@ckwlgus</p>
          </div>
          <div className={styles.subscribe}>
            <Button
              variant={subscribe ? "base" : "green"}
              title={subscribe ? "언팔로우" : "팔로우"}
              type="button"
              onClick={() => {
                setSubscribe(state => !state)
              }}
              className={styles.followButton}
            />
          </div>
        </header>

        {/* 통계 */}
        <section className={styles.profileStats}>
          <dl className={styles.profileStatesInner}>
            <div>
              <dt>포스팅</dt>
              <dd>8</dd>
            </div>
            <div>
              <dt>팔로워</dt>
              <dd>130</dd>
            </div>
            <div>
              <dt>팔로잉</dt>
              <dd>45</dd>
            </div>
          </dl>
        </section>

        <p className={styles.bio}>
          130자 제한 Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Voluptatem necessitatibus dipisicing elit veritatis sit noptatem
          necessitatibus
        </p>
      </div>
    </article>
  )
}
