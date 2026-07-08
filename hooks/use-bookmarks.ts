"use client"

import { useMemo } from "react"
import { useGlobalSearchContext } from "@/contexts/global-search-context"

export function useBookmarks() {
  const { bookmarks, results, toggleBookmark } = useGlobalSearchContext()

  const bookmarkedResults = useMemo(() => {
    const map = new Map(results.map((item) => [item.id, item]))
    return bookmarks
      .map((bookmark) => ({
        bookmark,
        result: map.get(bookmark.resultId) ?? null,
      }))
      .filter((item) => Boolean(item.result))
  }, [bookmarks, results])

  const pinnedBookmarks = useMemo(
    () => bookmarkedResults.filter((item) => item.bookmark.pinned),
    [bookmarkedResults]
  )

  const recentBookmarks = useMemo(
    () => [...bookmarkedResults].sort((left, right) => right.bookmark.createdAt - left.bookmark.createdAt).slice(0, 6),
    [bookmarkedResults]
  )

  return {
    bookmarks,
    bookmarkedResults,
    pinnedBookmarks,
    recentBookmarks,
    toggleBookmark,
  }
}
