"use client"

import createClient from "@/libs/supabase/client"
import Image from "next/image"
import { toast } from "sonner"
import styles from "./social-login.module.css"

type Provider = "kakao" | "google"

export default function SocialLogin() {
  const supabase = createClient()

  const handleLogin = async (provider: Provider) => {
    try {
      const redirectTo = `${window.location.origin}/auth/social`

      const params =
        provider === "google"
          ? { prompt: "consent select_account" }
          : { prompt: "login" }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: params,
        },
      })

      if (error) {
        toast.error("소셜 로그인에 실패했습니다")
        return
      }
    } catch {
      toast.error("소셜 로그인 중 오류가 발생했습니다")
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
