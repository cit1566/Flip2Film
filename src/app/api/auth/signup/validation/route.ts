import { createClient } from "@/libs/supabase/server"
import { VALIDATION_PATTERNS } from "@/utils/commonConstants/validation"
import { NextResponse } from "next/server"

// type
type Key = "email" | "nickname"

const MESSAGE: Record<Key, string> = {
  email: "이미 가입된 사용자입니다.",
  nickname: "이미 사용중인 닉네임입니다.",
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    key?: Key
    value?: string
  } | null

  const key = body?.key
  const rawValue = body?.value ?? ""

  if (key !== "email" && key !== "nickname") {
    return NextResponse.json(
      { ok: false, message: "Invalid key" },
      { status: 400 }
    )
  }

  const value = rawValue.trim()

  /**
   * 포인트 :
   * 중복 체크는 "형식이 맞을 때만" DB 조회하는게 좋음.
   * (형식 검증은 RHF의 required/pattern에서 이미 처리)
   */

  if (key === "email") {
    if (!value || !VALIDATION_PATTERNS.email.value.test(value)) {
      return NextResponse.json({ ok: true }) // 형식이 틀리면 중복체크 스킵
    }
  } else {
    if (!value || value.length < 2) {
      return NextResponse.json({ ok: true })
    }
  }

  const supabase = await createClient()

  const normalized = key === "email" ? value.toLowerCase() : value

  const { data, error } = await supabase
    .from("user")
    .select("id")
    .eq(key, normalized)
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { ok: false, message: "Database Error" },
      { status: 500 }
    )
  }

  // 존재하면 ok:false + 메시지 / 없으면 ok:true
  return NextResponse.json(
    data ? { ok: false, message: MESSAGE[key] } : { ok: true }
  )
}
