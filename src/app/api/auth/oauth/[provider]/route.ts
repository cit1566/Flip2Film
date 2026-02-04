// A안(추천): 클라이언트에서 OAuth 시작 + 서버 callback에서 code 교환
// 클라이언트: supabase.auth.signInWithOAuth({ provider, options: { redirectTo: /api/auth/callback?next=... }})
// 서버: GET /api/auth/callback에서 code를 exchangeCodeForSession로 교환하고 원하는 페이지로 redirect
// ✅ 장점: 라우트가 단순하고 Supabase 권장 플로우랑 잘 맞음
