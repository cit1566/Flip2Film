import {
  getFileExtension,
  makeProfileImagePath,
} from "@/libs/api/client/user/profile-image"
import type { UserUpdate } from "@/libs/supabase/types"
import updateUser from "../user/updateUser"
import setProfileStorage from "./setProfilestore"

export default async function setProfileImage(file: File, userId: string) {
  const ext = getFileExtension(file)
  const filePath = makeProfileImagePath(userId, ext)

  try {
    // 스토리지 사용자 프로필 저장 및 filePath값 반환
    await setProfileStorage(file, filePath)

    // 스토리지에 저장된 사용자의 프로필 path 유저 테이블에 저장
    await updateUser(
      { profile_image: filePath } satisfies Partial<UserUpdate>,
      userId
    )
  } catch (error) {
    if (error instanceof Error) throw error.message
    throw error
  }
}
