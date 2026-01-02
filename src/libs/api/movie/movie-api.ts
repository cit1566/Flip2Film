// import "server-only"

// .env에 저장된 TMDB API Key 가져오기 (Bearer 토큰 방식)
const TMDB_READ_ACCESS_API = process.env.TMDB_READ_ACCESS_API_KEY

if (!TMDB_READ_ACCESS_API) {
  throw new Error(
    "TMDB_READ_ACCESS_API_KEY is not defined in environment variables"
  )
}

// TMDB API의 기본 URL
const BASE_URL = "https://api.themoviedb.org/3"

// fetch 요청 시 공통으로 사용할 옵션
export const TMDB_options = {
  method: "GET",
  headers: {
    accept: "application/json",
    // TMDB는 Bearer Token(읽기 전용 Access Token)으로 인증해야 함
    Authorization: `Bearer ${TMDB_READ_ACCESS_API}`,
  },
  next: { revalidate: 300 },
}

/**
 * 공통 요청 함수
 * - endpoint만 넣으면 자동으로 BASE_URL과 옵션을 적용하여 fetch 실행
 * - 공통적으로 에러 처리 및 JSON 변환 처리
 */
async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, TMDB_options)

  // 네트워크는 문제 없지만 API 자체가 실패한 경우
  if (!res.ok) {
    throw new Error(`TMDB API 에러: ${res.status}`)
  }

  // 정상 응답을 JSON으로 변환해 반환
  return res.json() as Promise<T>
}

export interface TMDBProps {
  posterURL: PosterPathProps
  getPosterUrl: (path: string, size: string) => string
  getMovies: (input: string | number) => Promise<MovieRoot>
  getMovieId: (input: string) => Promise<TmdbMovieDetail>
  getRecentMovies: () => Promise<MovieRoot>
}

/**
 * TMDB API 묶음 객체
 * - 영화 검색, 최신 영화 조회 등 기능별로 API 메서드를 제공
 */
export const TMDB: TMDBProps = {
  posterURL: {
    secure_base_url: "https://image.tmdb.org/t/p/",
    backdrop_sizes: {
      w300: "w300",
      w780: "w780",
      w1280: "w1280",
      original: "original",
    },
    logo_sizes: {
      w45: "w45",
      w92: "w92",
      w154: "w154",
      w185: "w185",
      w300: "w300",
      w500: "w500",
      original: "original",
    },
    poster_sizes: {
      w92: "w92",
      w154: "w154",
      w185: "w185",
      w342: "w342",
      w500: "w500",
      w780: "w780",
      original: "original",
    },
    profile_sizes: {
      w45: "w45",
      w185: "w185",
      h632: "h632",
      original: "original",
    },
    still_sizes: {
      w92: "w92",
      w185: "w185",
      w300: "w300",
      original: "original",
    },
  },

  getPosterUrl(path, size) {
    return `${TMDB.posterURL.secure_base_url}${size}/${path}`
  },

  /**
   * 영화 검색 API
   * @param input 검색어(문자열 또는 숫자)
   * @returns 검색 결과 JSON
   */
  getMovies(input) {
    return request(
      `/search/movie?query=${encodeURIComponent(
        input
      )}&include_adult=false&language=ko-KR&page=1`
    )
  },

  getMovieId(movieId) {
    return request(`/movie/${movieId}?language=ko-KR`)
  },
  /**
   * 최신 영화 정보 조회
   * @returns 현재 상영 중인 영화 목록 JSON
   */
  getRecentMovies() {
    return request("/movie/now_playing?language=ko-KR&page=1")
  },
}

// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// 영화 API 반환 type
export interface MovieRoot {
  page: number
  results: MovieItemProps[]
  total_pages: number
  total_results: number
}

export interface MovieItemProps {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

// -------------------------------------------------------------------------
// posterURL type 정의
export interface PosterPathProps {
  secure_base_url: string

  backdrop_sizes: {
    w300: "w300"
    w780: "w780"
    w1280: "w1280"
    original: "original"
  }

  logo_sizes: {
    w45: "w45"
    w92: "w92"
    w154: "w154"
    w185: "w185"
    w300: "w300"
    w500: "w500"
    original: "original"
  }

  poster_sizes: {
    w92: "w92"
    w154: "w154"
    w185: "w185"
    w342: "w342"
    w500: "w500"
    w780: "w780"
    original: "original"
  }

  profile_sizes: {
    w45: "w45"
    w185: "w185"
    h632: "h632"
    original: "original"
  }

  still_sizes: {
    w92: "w92"
    w185: "w185"
    w300: "w300"
    original: "original"
  }
}

// --------------------------------------------------------
// getMovieId
// --------------------------------------------------------
export interface TmdbCollection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface TmdbProductionCountry {
  iso_3166_1: string
  name: string
}

export interface TmdbSpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface TmdbMovieDetail {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: TmdbCollection | null
  budget: number
  genres: TmdbGenre[]
  homepage: string
  id: number
  imdb_id: string | null
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: TmdbProductionCompany[]
  production_countries: TmdbProductionCountry[]
  release_date: string // "YYYY-MM-DD"
  revenue: number
  runtime: number | null
  spoken_languages: TmdbSpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
