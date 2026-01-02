"use client"

import { useDebounce } from "@/hooks/useDebounce"
import type {
  MovieItemProps,
  TmdbMovieDetail,
} from "@/libs/api/movie/movie-api"
import { useQuery } from "@tanstack/react-query"
import { X } from "lucide-react"
import Image from "next/image"
import type { SetStateAction } from "react"
import { useState } from "react"
import styles from "./search-category-movie.module.css"

export type SearchMovieItem = Pick<
  MovieItemProps,
  "id" | "title" | "release_date" | "poster_path" | "vote_average"
>

type MovieDetail = TmdbMovieDetail

interface SearchCategorMovieProps {
  selectedId: number | null
  setSelectedId: (value: SetStateAction<number | null>) => void
}

export default function SearchCategoryMovie({
  selectedId,
  setSelectedId,
}: SearchCategorMovieProps) {
  const [q, setQ] = useState("")
  // const [selectedId, setSelectedId] = useState<number | null>(null)
  const debounced = useDebounce(q, 400)

  // 1) 검색 자동완성
  const searchQuery = useQuery({
    queryKey: ["TMDB-search", debounced],
    enabled: debounced.trim().length >= 2 && selectedId == null,
    queryFn: async (): Promise<{ items: SearchMovieItem[] }> => {
      const res = await fetch(
        `/api/TMDB/search?q=${encodeURIComponent(debounced)}`
      )
      if (!res.ok) throw new Error("search failed")
      return res.json()
    },
    staleTime: 1000 * 10,
  })

  // 2) 선택한 1개 상세
  const detailQuery = useQuery({
    queryKey: ["TMDB-item", selectedId],
    enabled: selectedId != null,
    queryFn: async (): Promise<MovieDetail> => {
      const res = await fetch(`/api/TMDB/item?itemId=${selectedId}`)

      if (!res.ok) throw new Error("detail failed")
      return res.json()
    },
    staleTime: 1000 * 10,
  })

  const items = searchQuery.data?.items ?? []

  const showList =
    debounced.trim().length >= 2 && items.length > 0 && selectedId == null
  return (
    <div className={styles.wrap}>
      <label htmlFor="search-category" className={styles.label}>
        영화 검색
        <span> *</span>
      </label>
      <input
        type="text"
        id="search-category"
        className={styles.input}
        value={q}
        onChange={e => {
          setQ(e.target.value)
          setSelectedId(null)
        }}
        placeholder="영화를 검색하세요"
      />

      <button
        type="button"
        className={styles.removeButton}
        onClick={() => setQ("")}
      >
        <X />
      </button>

      {/* 자동완성 리스트 */}
      {showList && (
        <ul className={styles.list} role="listBox">
          {items.map(it => (
            <li key={it.id} className={styles.listItem}>
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => {
                  setSelectedId(it.id)
                  setQ(it.title)
                }}
              >
                <Image
                  className={styles.thumb}
                  src={it.poster_path}
                  alt={it.title}
                  width={90}
                  height={130}
                />
                <div className={styles.itemText}>
                  <div className={styles.itemTitle}>{it.title}</div>
                  <div className={styles.itemMeta}>
                    {it.vote_average} · {it.release_date}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 선택 후 프리뷰 카드 */}
      {detailQuery.data && (
        <div className={styles.previewCard}>
          <div className={styles.previewRow}>
            <Image
              className={styles.previewThumb}
              width={90}
              height={130}
              src={detailQuery.data.poster_path ?? ""}
              alt={detailQuery.data.title}
            />

            <div className={styles.previewInfo}>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>
                  {detailQuery.data.title}
                </h2>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedId(null)}
                  aria-label="선택 해제"
                >
                  <X />
                </button>
              </div>

              <div className={styles.previewOriginalTitle}>
                {detailQuery.data.original_title}
              </div>

              <div className={styles.previewMetaLine}>
                개봉 : {detailQuery.data.release_date}
              </div>

              <div className={styles.previewMetaLine}>
                평점 : {detailQuery.data.vote_average}
              </div>

              <div className={`${styles.previewMetaLine} ${styles.genres}`}>
                {detailQuery.data.genres.map(it => {
                  return (
                    <div key={it.id} className={styles.genresItem}>
                      {it.name}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상태 메시지(선택) */}
      {debounced.trim().length >= 2 && selectedId == null && (
        <>
          {searchQuery.isLoading && (
            <p className={styles.stateText}>검색 중…</p>
          )}
          {searchQuery.isError && (
            <p className={styles.stateTextError}>검색에 실패했어요.</p>
          )}
          {!searchQuery.isLoading &&
            !searchQuery.isError &&
            items.length === 0 && (
              <p className={styles.stateText}>검색 결과가 없어요.</p>
            )}
        </>
      )}
    </div>
  )
}
