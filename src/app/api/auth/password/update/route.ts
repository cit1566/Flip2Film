// POST /api/auth/password/update
// body: { newPassword }
// 동작:
// “복구(recovery) 세션”이 잡혀 있는 상태에서 supabase.auth.updateUser({ password: newPassword })
// 이 라우트는 보통 새 비번 입력 폼 제출에 연결
