"use client"

import { Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import styles from "./profile-upload.module.css"

interface ProfileUploadProps {
  onChange?: (file: File | null) => void
}

export default function ProfileUpload({ onChange }: ProfileUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange?.(file)

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
    }
  }

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileImageBox}>
        <Image
          src={previewImage ?? "/profile/default-profile.png"}
          alt="프로필 이미지"
          width={90}
          height={90}
          className={styles.profileImage}
        />

        <label
          htmlFor="profileUploadInput"
          className={styles.profileUploadButton}
          aria-label="프로필 이미지 추가"
        >
          <Plus aria-hidden="true" />
        </label>

        <input
          id="profileUploadInput"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
          className={styles.hiddenInput}
        />
      </div>
    </div>
  )
}
