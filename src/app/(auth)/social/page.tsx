import { redirect } from "next/navigation"
import { supabase } from "../../../libs/supabase/server"
import SocialProfileClient from "./social-profile-client"

export default async function SocialPage() {
  // ✅ 서버에서 로그인 체크
  // 페이지 보호에는 getClaims 사용을 권장하는 안내가 있음.
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect("/login")

  // ✅ 프로필 완료 여부 확인
  const { data: row } = await supabase
    .from("user")
    .select("nickname")
    .eq("id", userId)
    .maybeSingle()

  if (row?.nickname && row.nickname !== "익명") {
    redirect("/")
  }

  return <SocialProfileClient />
}
