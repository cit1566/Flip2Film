import { createClient } from "@/libs/supabase/server"
import type { User } from "@/libs/supabase/types"

interface createClientProps {
  email: User["email"]
  password: string
  bio: User["bio"]
  nickname: User["nickname"] | null
}

export default async function createUser({
  email,
  password,
  bio,
  nickname,
}: createClientProps) {
  if (!email) return

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname: nickname ?? email.split("@")[0], bio },
    },
  })

  if (error) throw error

  return data
}
