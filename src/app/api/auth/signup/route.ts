// POST /api/auth/signup
// body: { email, password, ... }
// 동작:
// supabase.auth.signUp(...)
// (선택) emailRedirectTo를 callback으로 지정해서 이메일 인증 후 돌아오게

import createUser from "@/libs/api/server/auth/createUser"
import setProfileImage from "@/libs/api/server/auth/profile/setProfile"
import { createClient } from "@/libs/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // 서버 Supabase Client 생성
  const supabase = await createClient()

  const { data: currentUser, error } = await supabase.auth.getClaims()
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 })

  if (!currentUser?.claims.sub)
    return NextResponse.json(
      { message: "사용자의 정보를 불러올 수 없습니다." },
      { status: 401 }
    )
  // 요청값 JSON -> Object로 변경
  const inputForm = await req.json()

  // supabase.auth.signUp() -> 메타 데이터 : 닉네임, 바이오 추가
  const result = await createUser({ ...inputForm })

  await setProfileImage(inputForm.profile_image, currentUser?.claims.sub)

  return NextResponse.json({ ...result }, { status: 200 })
}
