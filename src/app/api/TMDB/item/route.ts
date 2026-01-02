import { NextResponse } from "next/server"
import { TMDB } from "../../../../libs/api/movie/movie-api"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")

  if (!itemId) {
    return NextResponse.json({ message: "itemId required" }, { status: 400 })
  }
  const res = await TMDB.getMovieId(itemId)

  const posterUrl = (data: string | null): string => {
    if (data) return TMDB.getPosterUrl(data, TMDB.posterURL.poster_sizes.w92)

    return "asdf"
  }

  const poster_url = posterUrl(res.poster_path)
  return NextResponse.json(
    {
      ...res,
      poster_path: poster_url,
    },
    { status: 200 }
  )
}
