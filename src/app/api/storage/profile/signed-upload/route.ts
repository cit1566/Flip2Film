import { createClient } from "@/libs/supabase/server"
import { NextResponse } from "next/server"

const BUCKET = "profile_image"
const ALLOWED_EXT = new Set(["png", "jpg", "jpeg"])

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { ext } = (await req.json()) as { ext: string }
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ message: "Invalid extension" }, { status: 400 })
  }

  const fileName = `profile_${Date.now()}_${crypto.randomUUID()}.${ext}`
  const filePath = `${userId}/${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(filePath, { upsert: true })

  if (error || !data) {
    return NextResponse.json(
      { message: error?.message ?? "signed upload 생성 실패" },
      { status: 400 }
    )
  }

  // SDK 버전에 따라 data 구조는 다를 수 있으나 token/path를 제공함
  return NextResponse.json({
    filePath,
    token: data.token,
  })
}
