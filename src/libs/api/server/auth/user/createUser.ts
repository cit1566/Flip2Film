import { createClient } from "@/libs/supabase/server"
import type { User } from "@/libs/supabase/types"

interface createClientProps {
  email: User["email"]
  password: string
  bio: User["bio"]
  nickname: User["nickname"] | null
}

export default async function createUser(
  { email, password, bio, nickname }: createClientProps,
  origin: string
) {
  if (!email) throw new Error("이메일이 존재하지 않습니다.")

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname: nickname ?? email.split("@")[0], bio },
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) throw error

  return data
}
