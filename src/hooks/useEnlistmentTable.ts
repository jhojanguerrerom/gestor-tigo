import { useEffect, useState } from 'react'
import { enlistmentService } from '@/api/services/enlistmentService'

export function useEnlistmentTable({ pageSize = 10, searchQuery = '', refreshKey = 0 }) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      let res;
      if (searchQuery) {
        res = await enlistmentService.searchByOferta(searchQuery, currentPage, pageSize);
      } else {
        res = await enlistmentService.getEnlistments(currentPage, pageSize);
      }
      setData(res.data.data);
      setTotal(res.data.pagination.total);
      setTotalPages(res.data.pagination.total_pages);
      setLoading(false);
    };
    fetchData();
  }, [currentPage, pageSize, searchQuery, refreshKey]);

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
