import { createClient } from "../../supabase/client"
import type { UserInsert } from "../../supabase/types"

interface Props {
  email: UserInsert["email"]
  password: string
  bio: UserInsert["bio"]
  nickname: UserInsert["nickname"]
  profile_image: UserInsert["profile_image"]
}

export default async function createUser({
  email,
  password,
  bio,
  nickname,
  profile_image,
}: Props) {
  const supabase = await createClient()
  if (!email) return

  const { data: auth, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !auth.user) {
    throw authError ?? new Error("회원가입 실패")
  }

  const userId = auth.user.id

  const { error: profileError } = await supabase
    .from("user")
    .insert({ email, bio, nickname, profile_image, id: userId })

  if (profileError) {
    throw new Error(profileError.message)
  }
}
