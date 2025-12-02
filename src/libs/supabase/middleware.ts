import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import supabaseInfo from './info'
import type { Database } from './database.types'

const { supabaseKey, supabaseUrl } = supabaseInfo

/**
 * Next.js 미들웨어/서버 사이드에서 Supabase 클라이언트 생성
 * - 요청(request) 객체를 받아 쿠키 인증을 처리
 * - 응답에 필요한 쿠키를 포함시켜 반환
 *
 * @returns {NextResponse} NextResponse 객체 (supabaseResponse)
 * - 미들웨어는 실제로 Supabase 클라이언트를 반환하지 않고
 *   인증/세션 관련 쿠키를 포함한 응답 객체만 반환합니다.
 * - Supabase 클라이언트는 미들웨어 내에서 인증 검증, 세션 갱신 등에만 사용되고
 *   외부에서 직접 사용할 일이 없기 때문입니다.
 */
export const createClient = (request: NextRequest): NextResponse => {
  // 응답 객체 생성 (헤더 그대로 전달)
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Supabase 프로젝트의 URL과 공개 키를 사용하여
  // 타입이 지정된(Database 타입) 미들웨어용 Supabase 서버 클라이언트를 생성합니다.
  // - 클라이언트와 동일하게, 미들웨어에서도 타입 추론 및 안전성을 확보할 수 있습니다.
  // - 미들웨어에서 쿼리하거나 인증 정보를 다룰 때 타입 오류를 미리 방지할 수 있습니다.
  const _supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    // 옵션 설정
    {
      cookies: {
        // 모든 쿠키 가져오기
        getAll() {
          return request.cookies.getAll()
        },
        // 여러 개의 쿠키를 한 번에 저장하기
        setAll(cookiesToSet) {
          supabaseResponse = NextResponse.next({ request })

          // 쿠키 배열을 돌면서 각각 저장
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 응답 객체 반환
  return supabaseResponse
}

// --------------------------------------------------------------------------

// Next.js 미들웨어
// 미들웨어는 요청(Request)와 응답(Response) 사이에 위치하여,
// 요청을 가로채 인증/세션 쿠키를 검사 및 갱신하는 용도입니다.

// Supabase 클라이언트
// 미들웨어 내부에서만 사용되어, 세션 검증/쿠키 갱신 등 인증 관련 작업을 수행합니다.
// 외부에서 데이터를 읽거나 쓰는 용도로 사용하지 않습니다.

// NextResponse 반환값
// 미들웨어의 반환값은 항상 NextResponse 객체여야 하며,
// 이 객체에 인증/세션 쿠키를 포함시켜 브라우저로 돌려보내는 것이 목적입니다.

// --------------------------------------------------------------------------
