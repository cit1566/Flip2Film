import createClient from "../../supabase/client"
import type { UserInsert } from "../../supabase/types"

const supabase = createClient()

interface Props {
  email: UserInsert["email"]
  password: string
  bio: UserInsert["bio"]
  nickname: UserInsert["nickname"]
  profile_image: UserInsert["profile_image"] | File
}

// SignUp => Auth 사용자 등록
export default async function createUser({
  email,
  password,
  bio,
  nickname,
  profile_image,
}: Props) {
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

  return auth.user
}

// 사용자 토큰 발행
export async function login(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (!data) {
    throw new Error(`로그인 에러 발생!${error}`)
  }

  return data
}

// User Table Create
export async function insertUser() {
  const supabase = createClient()
  const myData = await supabase.auth.getSession()
  const metadata = myData.data.session?.user.user_metadata

  if (!metadata) return
  const { error } = await supabase.from("user").insert({
    email: metadata.email,
    nickname: metadata.nickname,
    bio: metadata.bio,
    profile_image: metadata.profile_image,
    id: metadata.sub,
  })

  if (error) {
    throw new Error(
      `에러 발생! 사용자의 정보를 추가하지 못하였습니다! : ${error.message} `
    )
  }
}

// logout function
export function logOut() {
  const supabase = createClient()
  supabase.auth.signOut()
}
