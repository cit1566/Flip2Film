import { supabase } from "@/libs/supabase/server"
import { NextResponse } from "next/server"

interface Body {
  nickname?: string | null
  bio?: string | null
  profile_image?: string | null // storage filePath
}

export async function POST(req: Request) {
  // ✅ 인증 확인 (서버)
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as Body
  const nickname = (body.nickname ?? "익명").trim()
  const bio = body.bio ?? null
  const profile_image = body.profile_image ?? null

  // ✅ 닉네임 중복 최종 체크
  if (nickname.length >= 2 && nickname !== "익명") {
    const { data: dup, error: dupErr } = await supabase
      .from("user")
      .select("id")
      .eq("nickname", nickname)
      .neq("id", userId)
      .maybeSingle()

    if (dupErr) {
      return NextResponse.json({ message: dupErr.message }, { status: 400 })
    }
    if (dup?.id) {
      return NextResponse.json(
        { message: "이미 사용 중인 닉네임입니다" },
        { status: 409 }
      )
    }
  }

  // ✅ row가 없을 수도 있으니 upsert
  const { data, error } = await supabase
    .from("user")
    .upsert({ id: userId, nickname, bio, profile_image }, { onConflict: "id" })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data })
}
