// POST /api/auth/password/reset-request
// body: { email }
// 동작:
// supabase.auth.resetPasswordForEmail(email, { redirectTo: <callback url> })
// 유저는 메일 링크 클릭 → callback으로 들어오고 → 세션 교환 후 /reset-password 같은 페이지로 보내는 흐름
