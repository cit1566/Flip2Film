// app/auth/callback/route.ts
import { createClient } from "@/libs/supabase/server" // ✅ 너 파일 위치에 맞게 경로 수정
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  // code 없으면 로그인으로
  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  const supabase = await createClient()

  // ✅ 핵심: code → session 교환 (쿠키에 세션 저장됨)
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  // 교환 성공 → 원래 가려던 페이지로 이동
  return NextResponse.redirect(new URL(next, url.origin))
}
