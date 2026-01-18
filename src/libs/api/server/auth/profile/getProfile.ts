import { createClient } from "@/libs/supabase/server"

export default async function getProfileUrl(profilePath: string) {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from("profile_image")
    .getPublicUrl(profilePath)

  if (!data.publicUrl)
    throw new Error(
      "프로필 이미지 경로 생성 에러 : 해당 데이터의 경로를 생성할 수 없습니다."
    )

  return data.publicUrl
}
