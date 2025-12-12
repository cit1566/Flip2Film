"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import { useState } from "react"
import styles from "./my-profile-form.module.css"

export default function MyProfileForm() {
  const [email, _setEmail] = useState("example@exaple.com")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")
  const [_profileImage, setProfileImage] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.myProfileForm}>
      <ProfileUpload onChange={setProfileImage} />

      <Input label="이메일" type="email" value={email} disabled />

      <Input
        label="닉네임"
        type="text"
        value={nickname}
        placeholder="최소 2자, 최대 6자"
        onChange={e => setNickname(e.target.value)}
      />

      <Input
        label="소개"
        type="text"
        value={bio}
        placeholder="자기소개를 입력하세요"
        onChange={e => setBio(e.target.value)}
      />

      <div className={styles.formButton}>
        <Button
          title="계정 탈퇴"
          variant="warning"
          className={styles.deleteButton}
        />

        <span className={styles.divider}></span>

        <Button
          title="변경사항 저장"
          variant="green"
          type="submit"
          className={styles.saveButton}
        />
      </div>
    </form>
  )
}
