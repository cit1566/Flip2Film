"use client"

import { Plus } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import styles from "./profile-upload.module.css"

interface ProfileUploadProps {
  onChange?: (file: File | null) => void
}

export default function ProfileUpload({ onChange }: ProfileUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange?.(file)

    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
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

        <button
          type="button"
          className={styles.profileUploadButton}
          onClick={() => inputRef.current?.click()}
          aria-label="프로필 이미지 업로드"
        >
          <Plus aria-hidden="true" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.hiddenInput}
        />
      </div>
    </div>
  )
}
