/**
 * 알라딘 Open API Key
 */
const ALADDIN_OPEN_API_KEY = process.env.ALADDIN_OPEN_API_KEY

/**
 * 알라딘 Open API 기본 URL
 */
const ALADDIN_API_BASE_URL = "http://www.aladin.co.kr/ttb/api"

/**
 * 알라딘 API 공통 Query 파라미터
 */
const COMMON_QUERY_PARAMS =
  "&QueryType=Keyword" +
  "&start=1" +
  "&MaxResults=2" +
  "&SearchTarget=Book" +
  "&output=JS" +
  "&Version=20131101"

/**
 * 검색 API URL
 */
const SEARCH_API_URL = `${ALADDIN_API_BASE_URL}/ItemSearch.aspx?ttbkey=${ALADDIN_OPEN_API_KEY}${COMMON_QUERY_PARAMS}`

/**
 * 리스트 API URL
 */
const LIST_API_URL = `${ALADDIN_API_BASE_URL}/ItemList.aspx?ttbkey=${ALADDIN_OPEN_API_KEY}${COMMON_QUERY_PARAMS}`

/**
 * 알라딘 도서 검색 / 리스트 조회 함수
 *
 * @param query - 검색어
 * @param type - Search(검색) | List(목록)
 * @param cover - 표지 이미지 크기
 * @returns 알라딘 API 응답 JSON
 */
export async function getAladdin(
  query: string,
  type: "Search" | "List" = "Search",
  cover: "Big" | "MidBig" | "Mid" | "Small" = "Mid"
) {
  // 사용할 API URL 결정
  const baseUrl = type === "Search" ? SEARCH_API_URL : LIST_API_URL

  // Query 및 Cover 옵션 추가
  const requestUrl = `${baseUrl}&Query=${encodeURIComponent(query)}&Cover=${cover}`

  const response = await fetch(requestUrl)

  // API 요청 실패 처리
  if (!response.ok) {
    throw new Error(`알라딘 API 에러: ${response.status}`)
  }

  return response.json()
}
