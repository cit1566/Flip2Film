// POST /api/auth/signup
// body: { email, password, ... }
// 동작:
// supabase.auth.signUp(...)
// (선택) emailRedirectTo를 callback으로 지정해서 이메일 인증 후 돌아오게
