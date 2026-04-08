import { Fragment, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import { reportService } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import DateRangePicker from '@/components/DateRangePicker';
import { formatDate } from '@/utils/dateUtils';
import { useToast } from '@/context/ToastContext';

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

interface TabProps {
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

export default function DailyProductivityTab({ refreshKey }: TabProps) {
  const { warning } = useToast();
  
  // --- Filtros Internos (Copiado de la estructura de referencia) ---
  const [dates, setDates] = useState({ 
    from: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: formatDate(new Date()) 
  });
  
  const [data, setData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cacheRef = useRef<Record<string, DailyData[]>>({});
  const lastRefreshKey = useRef(refreshKey);

  // Validación de rango máximo 90 días
  const isRangeValid = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  }, []);

  const loadData = useCallback(async (forceRefresh = false) => {
    if (!isRangeValid(dates.from, dates.to)) {
      warning('Seleccione un rango máximo de 90 días');
      setData([]);
      return;
    }

    const cacheKey = `${dates.from}_${dates.to}`;
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      return;
    }

    if (forceRefresh) delete cacheRef.current[cacheKey];

    setLoading(true);
    try {
      const res = await reportService.getDailyProductivity(dates.from, dates.to);
      const result = res.data?.data || [];
      cacheRef.current[cacheKey] = result;
      setData(result);
    } catch (err: any) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dates, isRangeValid, warning]);

  useEffect(() => {
    const isManualRefresh = refreshKey !== lastRefreshKey.current;
    lastRefreshKey.current = refreshKey;
    loadData(isManualRefresh);
  }, [loadData, refreshKey]);

  // --- Lógica de Columnas Dinámicas ---
  const allDates = useMemo(() => {
    const datesSet = new Set<string>();
    data.forEach(u => u.managed_by_day?.forEach(d => datesSet.add(d.date)));
    return Array.from(datesSet).sort();
  }, [data]);

  const columns: DataTableColumn[] = useMemo(() => {
    const base: DataTableColumn[] = [{ header: 'Asesor' }];
    const dateCols = allDates.map(date => ({
      header: date.split('-').reverse().slice(0, 2).join('/')
    }));
    return [...base, ...dateCols, { header: 'Promedio' }, { header: 'Total' }];
  }, [allDates]);

  return (
    <div className="position-relative">
      {/* SECCIÓN DE FILTROS: Idéntica a tu referencia */}
      <div className="d-flex flex-wrap justify-content-end align-items-center mb-4 gap-3">

        <div>
           <DateRangePicker 
             fromDate={dates.from} 
             toDate={dates.to} 
             showToday={false}
             onChange={(from, to) => setDates({ from: from, to: to })} 
           />
        </div>
      </div>

      {loading && <Loading fullScreen text="Cargando reporte..." />}
      
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 font-dm-bold text-secondary">
                Tabla de Productividad <span className="text-muted fw-normal small">({dates.from} a {dates.to})</span>
            </h5>
        </div>
        <div className="card-body p-0"> {/* p-0 para que la tabla ocupe todo el ancho del card */}
            <DataTable<DailyData>
                rows={data}
                columns={columns}
                tooltipDeps={[data, searchQuery, allDates]}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                getSearchText={(row) => `${row.user_login} ${row.user_name}`}
                pageSize={10}
                renderRow={(row) => (
                <Fragment key={row.user_login}>
                    <tr>
                    <td className="text-start ps-3">
                        <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={row.user_name}>
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
      </div>
    </div>
  );
}