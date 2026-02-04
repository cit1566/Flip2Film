import createClient from "../../../supabase/client"
import { getUser } from "./profile"

export default async function getUserProfileUrl(
  userId: string
): Promise<string> {
  try {
    const supabase = createClient()
    const userData = await getUser(userId)

    if (!userData) throw new Error("사용자의 정보가 존재하지 않습니다")

    const path = userData.profile_image
    if (!path) throw new Error("사용자의 프로필 이미지가 존재하지 않습니다")

    const Profile_Url = await supabase.storage
      .from("profile_image")
      .getPublicUrl(path)

    return Profile_Url.data.publicUrl
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error))
  }
}
