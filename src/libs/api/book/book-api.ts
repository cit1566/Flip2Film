/**
 * 알라딘 Open API Key
 */
const ALADDIN_OPEN_API_KEY = process.env.ALADDIN_OPEN_API_KEY

if (!ALADDIN_OPEN_API_KEY) {
  throw new Error(
    "ALADDIN_OPEN_API_KEY is not defined in environment variables"
  )
}

/**
 * 알라딘 Open API 기본 URL
 */
const ALADDIN_API_BASE_URL = "https://www.aladin.co.kr/ttb/api"

/**
 * 알라딘 API 공통 Query 파라미터
 */
const COMMON_QUERY_PARAMS =
  "&start=1" + "&SearchTarget=Book" + "&output=JS" + "&Version=20131101"

/**
 * 검색 API URL
 */
const SEARCH_API_URL = `${ALADDIN_API_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADDIN_OPEN_API_KEY}${COMMON_QUERY_PARAMS}`

/**
 * 리스트 API URL
 */
const LIST_API_URL = `${ALADDIN_API_BASE_URL}/ItemList.aspx?ttbkey=${ALADDIN_OPEN_API_KEY}${COMMON_QUERY_PARAMS}`

// 공통 타입
interface CommonParams {
  maxNum?: number
  cover?: "Big" | "MidBig" | "Mid" | "Small"
}

// 검색 타입
interface KeywordSearchParams extends CommonParams {
  type: "Search"
  query: string
}

// 신간 도서 리스트 타입
interface ItemNewSpecialParams extends CommonParams {
  type: "List"
}

type GetAladdinParams = KeywordSearchParams | ItemNewSpecialParams

/**
 * 알라딘 도서 검색 / 리스트 조회 함수
 *
 * @param query - 검색어
 * @param type - Search(검색) | List(목록)
 * @param queryType - Keyword(제목 + 저자) = 기본값, ItemNewSpecial(주목할 만한 신간 리스트)
 * @param cover - 표지 이미지 크기
 * @returns 알라딘 API 응답 JSON
 */
export async function getAladdin(params: GetAladdinParams) {
  const { type, maxNum = 5, cover = "Mid" } = params

  // 사용할 API URL 결정
  const baseUrl = type === "Search" ? SEARCH_API_URL : LIST_API_URL

  // API Type 결정
  let QueryType = "Keyword"

  if (type === "List") {
    QueryType = "ItemNewSpecial"
  }

  // 사용자 입력 데이터
  let queryParam = ""

  if (type === "Search") {
    queryParam = `&Query=${encodeURIComponent(params.query)}`
  }

  // Query 및 Cover 옵션 추가
  const requestUrl =
    `${baseUrl}` +
    `${queryParam}` +
    `&QueryType=${QueryType}` +
    `&MaxResults=${maxNum}` +
    `&Cover=${cover}`

  const response = await fetch(requestUrl)

  // API 요청 실패 처리
  if (!response.ok) {
    throw new Error(`알라딘 API 에러: ${response.status}`)
  }

  return response.json()
}
