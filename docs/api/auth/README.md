# Auth API (Next.js App Router + Supabase)

> 이 문서는 Next.js App Router의 Route Handler(`app/api/**/route.ts`)로 구성된 인증(Auth) API를 한 파일로 정리합니다.  
> Base Path: `/api/auth`

---

## Overview

- **Runtime**: Route Handler는 **서버에서 실행**됩니다. (클라이언트에서 호출해도 서버에서 처리)
- **Auth**: Supabase **세션 쿠키 기반**(SSR 설정) 사용을 전제로 합니다.
- **Content-Type**: 기본 `application/json` (특별한 경우 제외)

---

## Routes (폴더 구조)

```txt
app/api/auth/
  signup/route.ts
  login/route.ts
  logout/route.ts
  callback/route.ts
  oauth/[provider]/route.ts           # optional
  password/
    reset-request/route.ts
    update/route.ts
  me/route.ts                         # optional
```

---

## Common Conventions

### Success Response (권장)

```json
{ "ok": true }
```

### Error Response (권장)

```json
{
  "error": {
    "message": "Human readable message",
    "code": "STRING_CODE",
    "status": 400
  }
}
```

### Notes

- **민감정보(비밀번호/토큰)**는 URL query로 보내지 말고 body 또는 header로 전달합니다.
- `next` 같은 리다이렉트 파라미터는 **내부 경로만 허용**하도록 sanitize 권장.

---

## 1) POST /api/auth/signup

이메일/비밀번호 기반 회원가입을 처리합니다.

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "email": "user@example.com",
  "password": "********",
  "name": "optional"
}
```

### Response (예시)

- `200 OK`

```json
{ "ok": true }
```

- `400 Bad Request`

```json
{
  "error": {
    "message": "Invalid payload",
    "code": "BAD_REQUEST",
    "status": 400
  }
}
```

### Notes

- 이메일 인증을 사용하는 경우, 가입 후 메일 링크 클릭 → `GET /callback`으로 돌아오도록 구성할 수 있습니다.

---

## 2) POST /api/auth/login

이메일/비밀번호 로그인 요청을 처리하고 세션(쿠키)을 생성합니다.

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

### Response (예시)

- `200 OK`

```json
{ "ok": true }
```

- `401 Unauthorized`

```json
{
  "error": {
    "message": "Invalid credentials",
    "code": "UNAUTHORIZED",
    "status": 401
  }
}
```

### Notes

- 로그인 성공 후 UI(헤더 프로필 등) 갱신이 필요하면 `/api/auth/me` 재조회 패턴을 자주 씁니다.

---

## 3) POST /api/auth/logout

로그아웃 요청을 처리하여 세션(쿠키)을 제거합니다.

### Request

- Body 없음(또는 빈 JSON)

### Response (예시)

- `200 OK`

```json
{ "ok": true }
```

---

## 4) GET /api/auth/callback

OAuth/이메일 확인/비밀번호 재설정 링크 등에서 전달된 `code`를 **세션으로 교환**하고 `next` 경로로 **리다이렉트**합니다.
(인증 플로우의 “공통 관문”)

### Query

- `code` (string, required): Supabase 인증 코드
- `next` (string, optional): 교환 후 이동할 내부 경로 (예: `/`, `/social`, `/reset-password`)

Example:

```
/api/auth/callback?code=XXXX&next=/social
```

### Response

- Redirect (302/303/307 등 구현/환경에 따라 다름)

### Notes

- 보안상 `next`는 내부 경로만 허용하도록 sanitize 권장
  - 예: `/dashboard` OK, `https://evil.com` NO

---

## 5) GET /api/auth/oauth/:provider (optional)

(선택) 소셜 로그인 플로우를 시작하는 엔드포인트입니다.
프론트에서 직접 `signInWithOAuth`를 호출할 수도 있으니, 프론트 단순화를 원할 때만 둡니다.

### Params

- `provider`: `google | kakao | ...`

### Query (optional)

- `next`: 로그인 완료 후 이동할 내부 경로

### Response

- provider 인증 페이지로 Redirect

---

## 6) POST /api/auth/password/reset-request

비밀번호 재설정 이메일 발송을 요청합니다.

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "email": "user@example.com"
}
```

### Response (예시)

- `200 OK`

```json
{ "ok": true }
```

### Notes

- 보통 메일 링크 클릭 후 `GET /callback`을 거쳐 최종 비밀번호 변경 화면으로 이동하게 구성합니다.
  - 예: `redirectTo = /api/auth/callback?next=/reset-password`

- 정책에 따라 “존재하지 않는 이메일”에도 동일 응답을 주는 방식을 고려할 수 있습니다.

---

## 7) POST /api/auth/password/update

recovery 세션 또는 로그인 세션이 잡힌 상태에서 새 비밀번호로 업데이트합니다.

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "newPassword": "********"
}
```

### Response (예시)

- `200 OK`

```json
{ "ok": true }
```

- `401 Unauthorized`

```json
{
  "error": {
    "message": "Not authorized",
    "code": "UNAUTHORIZED",
    "status": 401
  }
}
```

### Notes

- 비밀번호 정책(길이/특수문자 등)은 프론트/서버 모두에서 검증 권장

---

## 8) GET /api/auth/me (optional)

현재 로그인한 사용자 정보(및 필요 시 프로필 테이블)를 반환합니다.

### Request

- Auth: 세션 쿠키 필요

### Response (예시)

- `200 OK`

```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "profile": {
    "nickname": "optional",
    "profile_image_type": "storage|external|none",
    "profile_image_ref": "path-or-url"
  }
}
```

- `401 Unauthorized`

```json
{
  "error": { "message": "Not logged in", "code": "UNAUTHORIZED", "status": 401 }
}
```

### Notes

- 헤더 프로필/로그인 상태 동기화에 매우 유용합니다.

---

## Implementation Notes (권장)

### 신규 유저 판별/프로필 row 생성

로그인마다 `SELECT`로 신규/기존 판별하는 대신 아래 중 하나 권장:

1. **DB Trigger**: `auth.users` 생성 시 프로필 row 1회 자동 생성
2. **Upsert**: `insert ... on conflict do nothing` 또는 `upsert`로 멱등 처리

### 프로필 이미지 저장 전략

- Storage 업로드 이미지: DB에는 **path(키)** 저장, URL은 필요 시 생성
- Social avatar URL: DB에 external URL 저장하거나, 안정성이 중요하면 로그인 직후 Storage로 다운로드/업로드하여 path로 통일

```

원하면 이 파일명까지 정해서(예: `docs/api/auth.md` vs `docs/api/auth/README.md`) 프로젝트에 맞는 커밋 메시지까지 같이 뽑아줄게.
::contentReference[oaicite:0]{index=0}
```

```

```
