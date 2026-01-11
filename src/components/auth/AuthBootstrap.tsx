"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { getBrowserSession, getUser } from "../../libs/api/user"
import { supabase } from "../../libs/supabase/client"
import { useUserStore } from "../../store/useUserStore"

export default function AuthBootstrap() {
  // ✅ Zustand store의 setter/initializer들
  // - setUserId: userId 저장
  // - setUserData: 유저 프로필(닉네임/바이오/프로필 이미지 등) 저장
  // - reset: 로그아웃/세션 만료 시 store를 초기 상태로 되돌림
  const setUserId = useUserStore(s => s.setUserId)
  const setUserData = useUserStore(s => s.setUserData)
  const reset = useUserStore(s => s.reset)

  useEffect(() => {
    // ✅ 1) 새로고침/첫 진입 시:
    // 브라우저에 저장된 세션(토큰)이 있는지 확인하고,
    // 있으면 그 세션의 user 정보를 store에 복구해줌.
    const getUserData = async (): Promise<void> => {
      // getBrowserSession: 내부적으로 supabase.auth.getSession() 같은 걸 감싼 함수라고 가정
      const user = await getBrowserSession()
      // 세션이 없으면(=로그인 상태 아님) 아무것도 하지 않음
      if (!user) return
      const {
        user: { id },
      } = user

      // ✅ userId 저장(헤더 등에서 로그인 유무 판단/쿼리 enabled 용도로 사용)
      setUserId(id)
      const userData = await getUser(id)
      if (userData) {
        setUserData({ ...userData })
      } else {
        toast.error("사용자의 정보가 존재하지 않습니다.")
      }
    }

    // ✅ 컴포넌트 마운트 직후(앱 시작/새로고침 포함) 세션 확인 실행
    getUserData()

    // ✅ 2) 로그인/로그아웃/토큰 갱신 등 “인증 상태 변화”를 실시간으로 감지
    // - 로그아웃되거나 세션이 없어지면 reset()으로 store 초기화
    // - 세션이 생기면 userId를 store에 저장
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // 세션이 없으면(=로그아웃, 만료 등) store를 초기화해서
        // UI가 “로그인 버튼” 상태로 바뀌게 함
        if (!session?.user) {
          reset()
          return
        }

        // 세션이 있으면 userId만이라도 최신값으로 저장
        // (필요하면 setUserData도 여기서 함께 갱신해 “단일 경로”로 통일하는 것도 좋음)
        // setUserId(session.user.id)
        await getUserData()
      }
    )

    // ✅ 클린업:
    // 컴포넌트 언마운트 시(auth 이벤트 구독 해제) 메모리 누수 방지
    return () => sub.subscription.unsubscribe()
  }, [setUserData, setUserId, reset])

  // 이 컴포넌트는 화면에 아무것도 렌더링하지 않고 “세션 복구/구독”만 담당
  return null
}
