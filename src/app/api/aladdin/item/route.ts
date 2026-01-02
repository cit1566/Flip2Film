import { NextResponse } from "next/server"

const BASE = "https://www.aladin.co.kr/ttb/api"
const COMMON = "&output=JS&Version=20131101"

export async function GET(req: Request) {
  const key = process.env.ALADDIN_OPEN_API_KEY
  if (!key)
    return NextResponse.json({ message: "Missing API key" }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")

  if (!itemId) {
    return NextResponse.json({ message: "itemId required" }, { status: 400 })
  }

  const url =
    `${BASE}/ItemLookUp.aspx?ttbkey=${key}${COMMON}` +
    "&itemIdType=ItemId" +
    `&ItemId=${encodeURIComponent(itemId)}` +
    "&Cover=Big"

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json(
      { message: `Aladdin error ${res.status}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  const item = data?.item?.[0]

  if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 })

  // 프리뷰 카드에 필요한 것만
  return NextResponse.json(
    {
      itemId: item.itemId,
      title: item.title,
      author: item.author,
      pubDate: item.pubDate,
      cover: item.cover,
      categoryName: item.categoryName,
      description: item.description,
      isbn13: item.isbn13,
    },
    { status: 200 }
  )
}
