import { createClient } from "../../supabase/client"
import type { UserInsert } from "../../supabase/types"

interface Props {
  email: UserInsert["email"]
  password: string
}

export default async function createUser({ email, password }: Props) {
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

  // const { error: profileError } = await supabase
  //   .from("user")
  //   .insert({ email, bio, nickname, profile_image, id: userId })

  // if (profileError) {
  //   throw new Error(profileError.message)
  // }

  return userId
}

export async function createUserInfo(userInfo: UserInsert) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("user").insert({
      ...userInfo,
    })

    if (error) {
      throw new Error(`사용자 추가 에러 발생 : ${error.message}`)
    }
  } catch (error) {
    return error
  }
}
