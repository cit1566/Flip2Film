import { supabase } from "@/libs/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // 로그인 상태가 아니면 체크 의미 없으니 401 처리(선택)
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const nickname = (searchParams.get("nickname") ?? "").trim()

  if (nickname.length < 2) return NextResponse.json({ ok: true })

  const { data, error } = await supabase
    .from("user")
    .select("id")
    .eq("nickname", nickname)
    .neq("id", userId)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 400 }
    )
  }

  if (data?.id) {
    return NextResponse.json({
      ok: false,
      message: "이미 사용 중인 닉네임입니다",
    })
  }

  return NextResponse.json({ ok: true })
}
