import createClient from "../../supabase/client"

/**
 * Storage 전용 Supabase 클라이언트
 * - 이 파일은 "프로필 이미지 업로드 + URL 생성"만 담당
 */
export const supabase = createClient()

/** 기본 프로필 이미지 버킷명 */
const DEFAULT_BUCKET = "profile_image" as const

/** 업로드 최대 용량 (5MB) */
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024

/** 허용 MIME 타입 */
const ALLOWED_MIME = new Set(["image/png", "image/jpeg"])

/** 허용 확장자 */
const ALLOWED_EXT = new Set(["png", "jpg", "jpeg"])

/** 간단한 런타임 assert 유틸 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

/**
 * ✅ (복구) 파일 확장자 추출: getFileExtension
 * - 파일명에서 확장자를 우선 가져오고,
 * - 이상한 경우 MIME 타입 기반으로 fallback
 */
export function getFileExtension(file: File): "png" | "jpg" | "jpeg" {
  const ext = file.name.split(".").pop()?.toLowerCase()

  if (ext && ALLOWED_EXT.has(ext)) {
    return ext as "png" | "jpg" | "jpeg"
  }

  // 파일명이 이상할 수 있으니 MIME 기준 fallback
  return file.type === "image/png" ? "png" : "jpg"
}

/**
 * ✅ (복구) 업로드할 파일 검증: validateProfileImage
 * - 용량 제한
 * - MIME 타입 제한
 */
export function validateProfileImage(file: File, maxSize = DEFAULT_MAX_SIZE) {
  assert(file.size <= maxSize, "업로드 가능한 파일 크기(5MB)를 초과했습니다")
  assert(
    ALLOWED_MIME.has(file.type),
    "지원하지 않는 파일 형식입니다. (png, jpg/jpeg만 가능)"
  )
}

/**
 * 유니크 ID 생성
 * - 브라우저: crypto.randomUUID() 사용
 * - fallback: Math.random + Date.now()
 */
export function makeUuid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Math.random().toString(16).slice(2)}${Date.now()}`
}

/**
 * ✅ (복구) Storage에 저장될 파일 경로 생성: makeProfileImagePath
 * - URL 캐싱 문제를 피하려면 "매번 다른 파일명"이 가장 안전함
 * - userId 폴더 아래에 profile_시간_uuid.ext 형태로 저장
 */
export function makeProfileImagePath(userId: string, ext: string): string {
  return `${userId}/profile_${Date.now()}_${makeUuid()}.${ext}`
}

/** uploadProfileImage 옵션 */
export interface UploadProfileImageOptions {
  /** (선택) 기본값: "profile_image" */
  bucket?: string
  /** (선택) 기본값: 5MB */
  maxSize?: number
  /** (선택) 기본값: "3600" */
  cacheControl?: string
  /**
   * (선택) 기본값: false
   * - false: 새 파일로 업로드(추천, 캐시 문제 최소화)
   * - true : 동일 경로 덮어쓰기(캐시 이슈가 생기기 쉬움)
   */
  upsert?: boolean
}

/**
 * 프로필 이미지 업로드 함수
 * - 업로드 성공 시 { filePath, publicUrl } 반환
 * - 일반적으로 DB에는 publicUrl 대신 filePath를 저장하는 것을 추천(환경 바뀌어도 안전)
 */
export async function uploadProfileImage(
  userId: string,
  file: File,
  options: UploadProfileImageOptions = {}
): Promise<{ filePath: string; publicUrl: string }> {
  assert(userId, "userId는 필수입니다.")
  assert(file, "업로드할 파일이 필요합니다.")

  const bucket = options.bucket ?? DEFAULT_BUCKET
  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE
  const cacheControl = options.cacheControl ?? "3600"
  const upsert = options.upsert ?? false

  // 1) 파일 검증
  validateProfileImage(file, maxSize)

  // 2) 파일 경로 생성 (매번 달라지게 만들어 캐시 문제 방지)
  const ext = getFileExtension(file)
  const filePath = makeProfileImagePath(userId, ext)

  // 3) 업로드
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert,
      contentType: file.type,
      cacheControl,
    })

  if (uploadError) {
    throw new Error(`이미지 업로드 실패: ${uploadError.message}`)
  }

  // 4) public URL 생성 (버킷이 public이어야 사용 가능)
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return { filePath, publicUrl: data.publicUrl }
}

/** getProfileImageUrl 옵션 */
export interface GetProfileImageUrlOptions {
  /** (선택) 기본값: "profile_image" */
  bucket?: string
  /**
   * (선택) 캐시 버스터 값
   * - Date.now()
   * - DB의 updated_at
   * 등을 넣어 URL 뒤에 ?v=... 로 붙여 캐시 갱신 유도
   */
  bust?: string | number
}

/**
 * 저장해둔 filePath로부터 public URL을 만들고,
 * bust 옵션이 있으면 캐시버스터 쿼리(?v=)를 붙여줌.
 */
export function getProfileImageUrl(
  filePath: string | null | undefined,
  options: GetProfileImageUrlOptions = {}
): string | null {
  if (!filePath) return null

  const bucket = options.bucket ?? DEFAULT_BUCKET
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  const baseUrl = data.publicUrl
  const bust = options.bust

  // bust가 없으면 그대로 반환
  if (bust === undefined || bust === null || bust === "") {
    return baseUrl
  }

  // 이미 쿼리가 있으면 & 로, 없으면 ? 로 연결
  const joiner = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${joiner}v=${encodeURIComponent(String(bust))}`
}

/**
 * ✅ 호환용 alias (기존에 새 이름으로 import 해둔 곳이 있으면 안 깨지게)
 * - 필요 없으면 나중에 제거해도 됨.
 */
export const getExt = getFileExtension
export const validateImage = validateProfileImage
export const makeFilePath = makeProfileImagePath
