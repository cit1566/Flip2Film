import { create } from "zustand"
import type { User } from "../libs/supabase/types"

interface userStoreProps {
  // state
  userId: string | null
  userData: User
  // actions
  setUserId: (userId: string) => void
  setUserData: (userData: User) => void
  reset: () => void
}

const initialUserData: User = {
  bio: null,
  email: null,
  id: "",
  nickname: "",
  profile_image: null,
}

// 사용자 상태 저장소
export const useUserStore = create<userStoreProps>(set => ({
  // state
  userId: null,
  userData: initialUserData,

  // action
  setUserId: (userId: string) => set({ userId }),

  setUserData: (userData: User) => set({ userData }),

  reset: () => {
    set({
      userId: null,
      userData: initialUserData,
    })
  },
}))
