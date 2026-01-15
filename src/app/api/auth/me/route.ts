// GET /api/auth/me (선택)
// “헤더에 프로필 표시” 같은 용도로 유용
// 동작:
// supabase.auth.getUser() + 필요하면 public.user_profiles 조회
// TanStack Query에서 /api/auth/me를 쿼리로 쓰기 딱 좋음
