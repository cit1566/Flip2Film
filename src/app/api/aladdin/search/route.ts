import type { SearchBookItem } from "@/components/review/form/search-category/book/search-category-book"
import { getAladdin } from "@/libs/api/book/book-api"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()
  const limit = Math.min(Number(searchParams.get("limit") ?? 8), 20)

  if (q.length < 2) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const data = await getAladdin({
    type: "Search",
    query: q,
    maxNum: limit,
    cover: "Big",
  })

  // const data = (await res.json()) as { item?: BookItemProps[] }

  const items: SearchBookItem[] = (data.item ?? []).map(it => ({
    itemId: it.itemId,
    title: it.title,
    author: it.author,
    pubDate: it.pubDate,
    cover: it.cover,
  }))

  return NextResponse.json({ items }, { status: 200 })
}
