"use client"

import { Plus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { validateProfileImage } from "../../../libs/api/user"
import styles from "./profile-upload.module.css"

interface ProfileUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
}

export default function ProfileUpload({ value, onChange }: ProfileUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isInvalidType, setIsInvalidType] = useState(false)

  useEffect(() => {
    if (!value) {
      setPreviewImage(null)
      return
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewImage(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    }

    return
  }, [value])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/png", "image/jpeg"]

    if (!allowedTypes.includes(file.type)) {
      e.target.value = ""
      onChange(null)
      setIsInvalidType(true)
      return
    }
    validateProfileImage(file)

    setIsInvalidType(false)
    onChange(file)
  }

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileImageBox}>
        <Image
          src={previewImage ?? "/profile/default-profile.png"}
          alt="프로필 이미지 미리보기"
          width={90}
          height={90}
          className={styles.profileImage}
          unoptimized
          priority
        />

        <label
          htmlFor="profile-upload"
          className={styles.profileUploadButton}
          aria-label="프로필 이미지 업로드"
        >
          <Plus aria-hidden="true" />
        </label>

        <input
          id="profile-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
          aria-describedby="profile-upload-help"
          className={styles.hiddenInput}
        />
      </div>

      {isInvalidType && (
        <p
          id="profile-upload-help"
          className={styles.profileHelpText}
          aria-live="polite"
        >
          .PNG 또는 .JPEG 형식의 이미지만
          <br /> 업로드할 수 있습니다
        </p>
      )}
    </div>
  )
}
