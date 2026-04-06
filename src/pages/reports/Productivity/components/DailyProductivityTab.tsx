import { Fragment, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import { reportService } from '@/api/services/reportService';
import Loading from '@/components/Loading';

// --- Interfaces ---
interface ManagedByDay {
  date: string;
  quantity: number;
}

interface DailyData {
  user_login: string;
  user_name: string;
  total_managed: number;
  daily_average: number;
  managed_by_day: ManagedByDay[];
}

interface DailyProductivityTabProps {
  fromDate: string;
  toDate: string;
  refreshKey: number;
}

const CellText = ({ value, className = '' }: { value?: string | number; className?: string }) => {
  const displayValue = value === undefined || value === null || value === '' || value === 0 ? '-' : String(value);
  const showTooltip = displayValue !== '-';
  return (
    <span
      className={`cell-text ${className}`}
      data-bs-toggle={showTooltip ? 'tooltip' : undefined}
      title={showTooltip ? displayValue : undefined}
    >
      {displayValue}
    </span>
  );
};

export default function DailyProductivityTab({ fromDate, toDate, refreshKey }: DailyProductivityTabProps) {
  const [data, setData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cacheRef = useRef<Record<string, DailyData[]>>({});
  const abortRef = useRef<AbortController | null>(null);
  const lastRefreshKey = useRef(refreshKey);

  const loadData = useCallback(async (forceRefresh = false) => {
    const cacheKey = `${fromDate}_${toDate}`;
    
    if (abortRef.current) abortRef.current.abort();

    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      return;
    }

    if (forceRefresh) {
      delete cacheRef.current[cacheKey];
    }

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await reportService.getDailyProductivity(fromDate, toDate, {
        signal: controller.signal
      });
      const result = res.data?.data || [];
      cacheRef.current[cacheKey] = result;
      setData(result);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      // Eliminada la notificación de error por Toast
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]); // Eliminado error de las dependencias

  useEffect(() => {
    const isManualRefresh = refreshKey !== lastRefreshKey.current;
    lastRefreshKey.current = refreshKey;

    loadData(isManualRefresh);

    return () => abortRef.current?.abort();
  }, [loadData, refreshKey]);

  const allDates = useMemo(() => {
    const dates = new Set<string>();
    data.forEach(u => u.managed_by_day?.forEach(d => dates.add(d.date)));
    return Array.from(dates).sort();
  }, [data]);

  const columns: DataTableColumn[] = useMemo(() => {
    const base: DataTableColumn[] = [{ header: 'Asesor' }];
    const dateCols = allDates.map(date => ({
      header: date.split('-').reverse().slice(0, 2).join('/')
    }));

    return [
      ...base, 
      ...dateCols, 
      { header: 'Promedio' }, 
      { header: 'Total' }
    ];
  }, [allDates]);

  return (
    <div className="position-relative">
      {loading && <Loading fullScreen text="Cargando reporte de productividad..." />}
      
      <DataTable<DailyData>
        rows={data}
        columns={columns}
        tooltipDeps={[data, searchQuery, allDates]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row) => `${row.user_login} ${row.user_name}`}
        pageSize={20}
        renderRow={(row) => (
          <Fragment key={row.user_login}>
            <tr>
              <td className="text-start ps-3">
                <span 
                  className="badge text-bg-blue" 
                  data-bs-toggle="tooltip" 
                  title={row.user_name}
                >
                  {row.user_login || '-'}
                </span>
              </td>
              
              {allDates.map(date => {
                const dayData = row.managed_by_day?.find(d => d.date === date);
                const val = dayData ? dayData.quantity : 0;
                return (
                  <td key={date}>
                    <CellText value={val} className="text-muted" />
                  </td>
                );
              })}

              <td className="fw-bold" data-bs-toggle="tooltip" title={`${row.daily_average}`}>
                {row.daily_average.toFixed(1)}
              </td>
              <td 
                className="table-active text-primary fw-bold text-center" 
                data-bs-toggle="tooltip" 
                title={`${row.total_managed}`}
              >
                {row.total_managed}
              </td>
            </tr>
          </Fragment>
        )}
      />
    </div>
  );
}