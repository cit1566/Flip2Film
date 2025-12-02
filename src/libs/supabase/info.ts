// Supabase 프로젝트 URL과 익명 키를 환경변수에서 가져옴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 프로젝트 URL, 익명 키 유효성 검사
// 환경변수에 값이 없으면 에러 발생 (설정 누락 방지)
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '.env 파일에 Supabase 프로젝트 URL과 익명 키가 포함되어 있지 않습니다.'
  )
}

const supabaseInfo = { supabaseUrl, supabaseKey }

export default supabaseInfo
