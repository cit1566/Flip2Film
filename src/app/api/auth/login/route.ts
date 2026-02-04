// POST /api/auth/login
// body: { email, password }
// 동작:
// supabase.auth.signInWithPassword(...)
// 성공 시 서버에서 세션 쿠키가 세팅되도록(SSR 클라이언트 사용)
