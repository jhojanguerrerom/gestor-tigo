import { useEffect, useState, useCallback } from 'react'

// 1. Definimos la forma de la función que esperamos
type FetchFunction = (
  page: number, 
  pageSize: number, 
  searchQuery: string
) => Promise<any>; // Puedes cambiar 'any' por el tipo de respuesta de tu API si lo tienes

interface UseEnlistmentProps {
  pageSize?: number;
  searchQuery?: string;
  refreshKey?: number;
  fetchFn: FetchFunction; // <--- Aquí aplicamos el tipo
}

export function useEnlistmentTable({ 
  pageSize = 10, 
  searchQuery = '', 
  refreshKey = 0,
  fetchFn 
}: UseEnlistmentProps) {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchFn(currentPage, pageSize, searchQuery);
      
      // Ajusta estas rutas según la estructura real de tu respuesta de API
      setData(res.data?.data || []);
      setTotal(res.data?.pagination?.total || 0);
      setTotalPages(res.data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setData([]);
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchQuery, fetchFn])

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  return {
    data,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  }
}