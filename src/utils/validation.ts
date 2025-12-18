// 회원가입 & 로그인 정규식 검사 공통 상수/함수로 따로 분리

export const VALIDATION_PATTERNS = {
  email: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "올바른 이메일 형식이 아닙니다",
  },
  password: {
    value:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,}$/,
    message: "영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다",
  },
} as const
