// .env에 저장된 TMDB API Key 가져오기 (Bearer 토큰 방식)
const TMDB_READ_ACCESS_API_KEY = process.env.TMDB_READ_ACCESS_API_KEY

if (!TMDB_READ_ACCESS_API_KEY) {
  throw new Error(
    "TMDB_READ_ACCESS_API_KEY is not defined in environment variables"
  )
}

// TMDB API의 기본 URL
const BASE_URL = "https://api.themoviedb.org/3"

// fetch 요청 시 공통으로 사용할 옵션
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    // TMDB는 Bearer Token(읽기 전용 Access Token)으로 인증해야 함
    Authorization: `Bearer ${TMDB_READ_ACCESS_API_KEY}`,
  },
}

/**
 * 공통 요청 함수
 * - endpoint만 넣으면 자동으로 BASE_URL과 옵션을 적용하여 fetch 실행
 * - 공통적으로 에러 처리 및 JSON 변환 처리
 */
async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options)

  // 네트워크는 문제 없지만 API 자체가 실패한 경우
  if (!res.ok) {
    throw new Error(`TMDB API 에러: ${res.status}`)
  }

  // 정상 응답을 JSON으로 변환해 반환
  return res.json() as Promise<T>
}

/**
 * TMDB API 묶음 객체
 * - 영화 검색, 최신 영화 조회 등 기능별로 API 메서드를 제공
 */
export const TMDB = {
  posterURL: {
    secure_base_url: "https://image.tmdb.org/t/p/",
    backdrop_sizes: ["w300", "w780", "w1280", "original"],
    logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
    poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    profile_sizes: ["w45", "w185", "h632", "original"],
    still_sizes: ["w92", "w185", "w300", "original"],
  },
  /**
   * 영화 검색 API
   * @param input 검색어(문자열 또는 숫자)
   * @returns 검색 결과 JSON
   */
  getMovies(input: string | number) {
    return request(
      `/search/movie?query=${encodeURIComponent(
        input
      )}&include_adult=false&language=ko-KR&page=1`
    )
  },

  /**
   * 최신 영화 정보 조회
   * @returns 현재 상영 중인 영화 목록 JSON
   */
  getRecentMovies() {
    return request("/movie/now_playing?language=ko-KR&page=1")
  },
}
