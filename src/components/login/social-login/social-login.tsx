"use client"

import { signInWithSocial } from "@/libs/api/user/user-api"
import Image from "next/image"
import { toast } from "sonner"
import styles from "./social-login.module.css"

type Provider = "kakao" | "google"

export default function SocialLogin() {
  const handleLogin = async (provider: Provider) => {
    try {
      // 소셜로그인 API 함수 호출
      await signInWithSocial(provider)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "소셜 로그인 중 오류가 발생했습니다"
      )
    }
  }

  return (
    <div className={styles.socialContainer}>
      <p className={styles.textLabel}>간편 로그인으로 시작하기</p>

      <div className={styles.iconRow}>
        <button
          type="button"
          className={styles.kakaoBtn}
          onClick={() => handleLogin("kakao")}
          aria-label="카카오 로그인"
        >
          <Image
            src="/social-icons/kakao.svg"
            alt="카카오 로그인"
            width={40}
            height={40}
          />
        </button>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={() => handleLogin("google")}
          aria-label="구글 로그인"
        >
          <Image
            src="/social-icons/google.svg"
            alt="구글 로그인"
            width={40}
            height={40}
          />
        </button>
      </div>
    </div>
  )
}
