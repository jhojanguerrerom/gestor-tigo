import { useMemo, useState, useEffect } from 'react'

interface UseTableSearchPaginationParams<T> {
  rows: T[]
  searchQuery: string
  pageSize?: number
  getSearchText: (row: T) => string
}

export function useTableSearchPagination<T>({
  rows,
  searchQuery,
  pageSize = 10,
  getSearchText,
}: UseTableSearchPaginationParams<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return rows
    }

    return rows.filter((row) => getSearchText(row).toLowerCase().includes(query))
  }, [rows, searchQuery, getSearchText])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredRows.length)
  const pagedRows = filteredRows.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return {
    filteredRows,
    pagedRows,
    totalPages,
    safePage,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
  }
}
