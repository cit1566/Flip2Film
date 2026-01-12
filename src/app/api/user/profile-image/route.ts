import { createClient } from "@/libs/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  // 로그인 확인 (쿠키 기반)
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // public.user fetch
  const { data: userRow, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  let profileImageUrl: string | null = null
  if (userRow.profile_image) {
    const { data } = supabase.storage
      .from("profile_image")
      .getPublicUrl(userRow.profile_image)

    // cash buster
    const bust = userRow.updated_at
      ? new Date(userRow.updated_at).getTime()
      : Date.now()

    profileImageUrl = `${data.publicUrl}?v=${bust}`
  }

  return NextResponse.json({
    id: userRow.id,
    nickname: userRow.nickname,
    bio: userRow.bio ?? null,
    email: userRow.email ?? null,
    profile_image: profileImageUrl,
  })
}
