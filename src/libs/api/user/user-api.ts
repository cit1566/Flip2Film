import { toast } from "sonner"
import createClient from "../../supabase/client"
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
    options: {
      data: {
        nickname,
        bio,
        profile_image: profile_image ?? null,
      },
    },
  })

  if (authError || !auth.user) {
    throw authError ?? new Error("회원가입 실패")
  }

  console.log(auth.user)
  console.log(auth.session)
  // const userId = auth.user.id

  // const { error: profileError } = await supabase
  //   .from("user")
  //   .insert({ email, bio, nickname, profile_image, user_id: userId })

  // if (profileError) {
  //   throw new Error(profileError.message)
  // }

  // return auth.user
}

export async function login(email: string, password: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!data) {
      throw new Error(`로그인 에러 발생!${error}`)
    }
  } catch (err) {
    toast(`로그인 에러가 발생하였습니다.${err}`)
  }
}

export async function insertUser() {
  const supabase = await createClient()
  const myData = await supabase.auth.getSession()
  const metadata = myData.data.session?.user.user_metadata
  console.log(metadata)
  if (!metadata) return
  const { error } = await supabase.from("user").insert({
    email: metadata.email,
    nickname: metadata.nickname,
    bio: metadata.bio,
    profile_image: metadata.profile_image,
    id: metadata.sub,
  })

  console.log(error)
}

export function logOut() {
  const supabase = createClient()
  supabase.auth.signOut()
}
