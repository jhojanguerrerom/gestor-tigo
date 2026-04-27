import { useEffect, useState, useCallback } from 'react'

// 1. Definimos la forma de la función que carga los datos
type FetchFunction = (
  page: number, 
  pageSize: number, 
  searchQuery: string
) => Promise<any>;

// 2. Definimos qué recibe el hook
interface UseEnlistmentProps {
  pageSize?: number;
  searchQuery?: string;
  refreshKey?: number;
  fetchFn: FetchFunction;
}

// 3. ESTA ES LA QUE BUSCABAS: Definimos qué devuelve el hook
// Al ponerle nombre, el error ts(2339) desaparecerá
interface UseEnlistmentReturn {
  data: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  loadData: () => Promise<void>; // <--- Aquí incluimos la función
}

export function useEnlistmentTable({ 
  pageSize = 10, 
  searchQuery = '', 
  refreshKey = 0,
  fetchFn 
}: UseEnlistmentProps): UseEnlistmentReturn { // <--- Le decimos al hook que use esa interfaz
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchFn(currentPage, pageSize, searchQuery);
      
      // Mapeo de la respuesta según tu API
      setData(res.data?.data || []);
      setTotal(res.data?.pagination?.total || 0);
      setTotalPages(res.data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setData([]);
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchQuery, fetchFn]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  // IMPORTANTE: Retornamos todo lo que definimos en la interfaz arriba
  return {
    data,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    loadData // <--- Ahora sí es visible para PausedCasesTab
  };
}