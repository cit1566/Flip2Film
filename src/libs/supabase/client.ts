import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import supabaseInfo from './info'

const { supabaseKey, supabaseUrl } = supabaseInfo

/**
 * Supabase 브라우저 클라이언트 생성 함수
 * - 클라이언트 컴포넌트(브라우저 환경)에서 Supabase 기능을 사용할 때 필요
 * - 인증, 데이터베이스 등 Supabase 기능을 사용할 수 있게 해줌
 */
export const createClient = () => {
  // Supabase 프로젝트의 URL과 공개 키를 사용하여
  // 타입이 지정된(Database 타입) 브라우저용 Supabase 클라이언트를 생성합니다.
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
