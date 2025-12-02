import { createServerClient } from '@supabase/ssr'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'
import supabaseInfo from './info'
import type { Database } from './database.types'

const { supabaseKey, supabaseUrl } = supabaseInfo

// 쿠키 저장소 타입 정의 (Next.js에서 쿠키를 다루는 객체 타입)
type CookieStore = ReturnType<typeof cookies>

/**
 * Supabase 클라이언트 생성 함수
 * - cookieStore를 받아 서버에서
 *   Supabase 인증을 처리할 수 있도록 설정
 */
export const createClient = (
  cookieStore: CookieStore | ReadonlyRequestCookies
) => {
  // Supabase 프로젝트의 URL과 공개 키를 사용하여
  // 타입이 지정된(Database 타입) 서버용 Supabase 클라이언트를 생성합니다.
  // - 클라이언트와 동일하게, 서버에서도 타입 추론 및 안전성을 확보할 수 있습니다.
  // - 서버에서 쿼리하거나 인증 정보를 다룰 때 타입 오류를 미리 방지할 수 있습니다.
  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    // 옵션 설정
    {
      cookies: {
        // 모든 쿠키 가져오기
        async getAll() {
          return (await cookieStore).getAll()
        },
        // 여러 개의 쿠키를 한 번에 저장하기
        async setAll(cookiesToSet) {
          try {
            // 쿠키 배열을 돌면서 각각 저장
            for (const { name, value, options } of cookiesToSet) {
              ;(await cookieStore).set(name, value, options)
            }
          } catch {
            // setAll 메서드가 서버 컴포넌트에서 실행된 경우를 경고
            // 서버 컴포넌트에서 실행됐다는 메시지이니, 만약 로그인 상태를
            // 자동으로 관리해주는 미들웨어가 있으면 신경 쓸 필요 없음.
            //
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
