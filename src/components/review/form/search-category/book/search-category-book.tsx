"use client"

import { useDebounce } from "@/hooks/useDebounce"
import type { BookItemProps } from "@/libs/api/book/book-api"
import { useQuery } from "@tanstack/react-query"
import { X } from "lucide-react"
import Image from "next/image"
import type { SetStateAction } from "react"
import { useState } from "react"
import styles from "./search-category-book.module.css"

// ✅ 네 타입 참고: BookItemProps 기반으로 필요한 필드만 Pick

export type SearchBookItem = Pick<
  BookItemProps,
  "itemId" | "title" | "author" | "pubDate" | "cover"
>

type BookDetail = Pick<
  BookItemProps,
  | "itemId"
  | "title"
  | "author"
  | "pubDate"
  | "cover"
  | "categoryName"
  | "description"
  | "isbn13"
>

interface SearchCategorBookProps {
  selectedId: number | null
  setSelectedId: (value: SetStateAction<number | null>) => void
}

export default function SearchCategorBook({
  selectedId,
  setSelectedId,
}: SearchCategorBookProps) {
  const [q, setQ] = useState("")
  const debounced = useDebounce(q, 400)
  // const [selectedId, setSelectedId] = useState<number | null>(null)

  // 1) 검색 자동완성
  const searchQuery = useQuery({
    queryKey: ["aladdin-search", debounced],
    enabled: debounced.trim().length >= 2 && selectedId == null,
    queryFn: async (): Promise<{ items: SearchBookItem[] }> => {
      const res = await fetch(
        `/api/aladdin/search?q=${encodeURIComponent(debounced)}&limit=8`
      )
      if (!res.ok) throw new Error("search failed")
      return res.json()
    },
    staleTime: 1000 * 10,
  })

  // 2) 선택한 1개 상세
  const detailQuery = useQuery({
    queryKey: ["aladdin-item", selectedId],
    enabled: selectedId != null,
    queryFn: async (): Promise<BookDetail> => {
      const res = await fetch(`/api/aladdin/item?itemId=${selectedId}`)
      if (!res.ok) throw new Error("detail failed")
      return res.json()
    },
    staleTime: 1000 * 60,
  })

  const items = searchQuery.data?.items ?? []

  const showList =
    debounced.trim().length >= 2 && items.length > 0 && selectedId == null

  return (
    <div className={styles.wrap}>
      <label htmlFor="search-category" className={styles.label}>
        도서 검색
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
        placeholder="도서명을 검색하세요"
      />
      <button
        type="button"
        className={styles.removeButton}
        onClick={() => {
          setQ("")
        }}
      >
        <X />
      </button>

      {/* 자동완성 리스트 */}
      {showList && (
        <ul className={styles.list} role="listbox">
          {items.map(it => (
            <li key={it.itemId} className={styles.listItem}>
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => {
                  setSelectedId(it.itemId)
                  setQ(it.title)
                }}
              >
                <Image
                  className={styles.thumb}
                  src={it.cover}
                  alt={it.title}
                  width={90}
                  height={130}
                />
                <div className={styles.itemText}>
                  <div className={styles.itemTitle}>{it.title}</div>
                  <div className={styles.itemMeta}>
                    {it.author} · {it.pubDate}
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
              src={detailQuery.data.cover}
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

              <div className={styles.previewAuthor}>
                {detailQuery.data.author}
              </div>

              <div className={styles.previewMetaLine}>
                출간: {detailQuery.data.pubDate}
              </div>

              {detailQuery.data.categoryName && (
                <div className={styles.previewMetaLine}>
                  카테고리: {detailQuery.data.categoryName}
                </div>
              )}
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
