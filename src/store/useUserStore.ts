import { create } from "zustand"
import type { User } from "../libs/supabase/types"

interface userStoreProps {
  userId: string | null
  userData: User
}

// 사용자 상태 저장소
export const useUserStore = create<userStoreProps>(set => ({
  // state
  userId: null,
  userData: {
    bio: null,
    email: null,
    id: "",
    nickname: "",
    profile_image: null,
  },

  // action
  setUserId: (userId: string) => set({ userId }),

  setUserData: (userData: User) => set({ userData }),

  reset: () => {
    set({
      userId: null,
      userData: {
        bio: null,
        email: null,
        id: "",
        nickname: "",
        profile_image: null,
      },
    })
  },
}))
