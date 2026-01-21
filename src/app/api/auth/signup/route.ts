// POST /api/auth/signup
// body: { email, password, ... }
// 동작:
// supabase.auth.signUp(...)
// (선택) emailRedirectTo를 callback으로 지정해서 이메일 인증 후 돌아오게

import {
  getFileExtension,
  makeProfileImagePath,
} from "@/libs/api/client/user/profile-image"
import createUser from "@/libs/api/server/auth/createUser"
import setProfileStorage from "@/libs/api/server/auth/profile/setProfilestore"
import { NextResponse } from "next/server"
import updateUser from "../../../../libs/api/server/auth/user/updateUser"

export async function POST(req: Request) {
  try {
    const { origin } = new URL(req.url)

    // 요청값 JSON -> Object로 변경
    const inputForm = await req.formData()

    const email = inputForm.get("email") as string
    const password = inputForm.get("password") as string
    const nickname = inputForm.get("nickname") as string
    const bio = inputForm.get("bio") as string
    const profile_image = inputForm.get("profile_image") as File | null

    // supabase.auth.signUp() -> 메타 데이터 : 닉네임, 바이오 추가
    const { user } = await createUser(
      {
        email,
        password,
        nickname,
        bio,
      },
      origin
    )

    if (profile_image && user) {
      const ext = getFileExtension(profile_image)
      const filePath = makeProfileImagePath(user.id, ext)

      // 스토리지 사용자 프로필 저장 및 filePath값 반환
      await setProfileStorage(profile_image, filePath)

      // 스토리지에 저장된 사용자의 프로필 path 유저 테이블에 저장
      await updateUser({ profile_image: filePath }, user.id)
    }
    return NextResponse.json({ ok: true, user }, { status: 200 })
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ message: err.message }, { status: 501 })
    return NextResponse.json({ err }, { status: 500 })
  }
}
