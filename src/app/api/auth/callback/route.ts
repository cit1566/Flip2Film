// app/api/auth/callback/route.ts
import { supabase } from "@/libs/supabase/server"
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

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
