import createClient from "../client"

// review 테이블 전체 불러오기
export async function selectAllReviews() {
  const supabase = createClient()

  const { data, error } = await supabase.from("review").select("*")

  if (error) {
    throw new Error(`전체 리뷰 불러오기 실패: ${error.message}`)
  }

  return data
}
