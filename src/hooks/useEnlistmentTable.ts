import { useEffect, useState } from 'react'
import { enlistmentService } from '@/api/services/enlistmentService'

export function useEnlistmentTable({ pageSize = 10, searchQuery = '' }) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    enlistmentService.getEnlistments(currentPage, pageSize)
      .then((res) => {
        setData(res.data.data)
        setTotal(res.data.pagination.total)
        setTotalPages(res.data.pagination.total_pages)
      })
      .finally(() => setLoading(false))
  }, [currentPage, pageSize])

  // TODO: Implement search on backend if available, else filter client-side

  return {
    data,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  }
}
