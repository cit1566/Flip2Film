# API Documentation

이 문서는 Next.js App Router의 Route Handler(`app/api/**/route.ts`)로 구성된 내부 API를 설명합니다.

## Base

- Base Path: `/api`
- Content-Type: `application/json` (특별한 경우 제외)
- 인증: Supabase 세션 쿠키 기반(SSR 설정 사용 시)

## 공통 응답 규칙(권장)

- 성공: 2xx + JSON(필요 시)
- 실패: 4xx/5xx + JSON

### 공통 에러 포맷(권장)

```json
{
  "error": {
    "message": "Human readable message",
    "code": "STRING_CODE",
    "status": 400
  }
}
```
