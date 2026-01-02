import type { MovieItemProps } from "@/libs/api/movie/movie-api"
import { TMDB } from "@/libs/api/movie/movie-api"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (q.length < 2) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const res = await TMDB.getMovies(q)
  const data = res.results

  const items: MovieItemProps[] = (data ?? [])
    .map(it => ({
      adult: it.adult,
      backdrop_path: it.backdrop_path,
      genre_ids: it.genre_ids,
      id: it.id,
      original_language: it.original_language,
      original_title: it.original_title,
      overview: it.overview,
      popularity: it.popularity,
      poster_path: TMDB.getPosterUrl(
        it.poster_path,
        TMDB.posterURL.poster_sizes.w92
      ),
      release_date: it.release_date,
      title: it.title,
      video: it.video,
      vote_average: it.vote_average,
      vote_count: it.vote_count,
    }))
    .slice(0, 8)

  return NextResponse.json({ items }, { status: 200 })
}
