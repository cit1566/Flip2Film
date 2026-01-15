// GET /api/auth/callback (가장 중요)
// 역할: Supabase가 준 code를 세션으로 교환하고(쿠키 세팅), next로 redirect
// 여기서 처리하는 것들:
// 소셜 로그인 callback
// 이메일 인증(회원가입 confirm) callback
// 비밀번호 재설정(recovery) callback
// 즉, **인증 플로우의 “공용 관문”**으로 둠.

import { createClient } from "@/libs/supabase/server"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

function sanitizeNext(next: string | null) {
  // 내부 경로만 허용 ("/", "/social", "/foo?bar=1" OK)
  if (!next) return "/"
  if (!next.startsWith("/")) return "/"
  if (next.startsWith("//")) return "/"
  return next
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = sanitizeNext(url.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  // ✅ (중요) PKCE code_verifier 쿠키가 lazy로 안 읽히는 케이스 방지
  //    - createClient 내부에서 이미 읽는다면 없어도 되지만, 넣어도 안전함
  ;(
    await // ✅ (중요) PKCE code_verifier 쿠키가 lazy로 안 읽히는 케이스 방지
    //    - createClient 내부에서 이미 읽는다면 없어도 되지만, 넣어도 안전함
    cookies()
  ).getAll()

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
