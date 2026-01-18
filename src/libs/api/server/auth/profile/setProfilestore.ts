import { createClient } from "@/libs/supabase/server"
import PROFILE from "./profileConst"

export default async function setProfileStorage(
  file: File,
  profilePath: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from(PROFILE.STORAGE)
    .upload(profilePath, file, {
      upsert: false,
      contentType: file.type,
    })

  if (error)
    throw new Error(`프로필 이미지 스토리지 업로드 에러 : ${error.message}`)

  return data.path
}
