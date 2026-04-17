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
  
  const [dates, setDates] = useState({ 
    from: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: formatDate(new Date()) 
  });
  
  const [data, setData] = useState<DailyData[]>([]);
  // Nuevo estado para el total global del response
  const [totalManaged, setTotalManaged] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cacheRef = useRef<Record<string, DailyData[]>>({});
  const lastRefreshKey = useRef(refreshKey);

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
      
      // Guardamos el total_managed que viene en la raíz del response (701)
      setTotalManaged(res.data?.total_managed || 0);
      
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

  const allDates = useMemo(() => {
    const datesSet = new Set<string>();
    data.forEach(u => u.managed_by_day?.forEach(d => datesSet.add(d.date)));
    return Array.from(datesSet).sort();
  }, [data]);

  // Sumatoria manual solo para las columnas de los días
  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    allDates.forEach(date => {
      totals[date] = data.reduce((acc, curr) => {
        const day = curr.managed_by_day?.find(d => d.date === date);
        return acc + (day ? day.quantity : 0);
      }, 0);
    });
    return totals;
  }, [allDates, data]);

  const columns: DataTableColumn[] = useMemo(() => {
    const base: DataTableColumn[] = [{ header: 'Asesor' }];
    const dateCols = allDates.map(date => ({
      header: date.split('-').reverse().slice(0, 2).join('/')
    }));
    return [...base, ...dateCols, { header: 'Promedio' }, { header: 'Total' }];
  }, [allDates]);

  return (
    <div className="position-relative">
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
        <div className="card-body p-0">
          <h5 className="mb-2 font-dm-bold text-secondary">
            Tabla de productividad <span className="text-muted fw-normal small">({dates.from} a {dates.to})</span>
          </h5>
          <DataTable<DailyData>
              rows={data}
              columns={columns}
              // Añadimos totalManaged a las dependencias de tooltips
              tooltipDeps={[data, searchQuery, allDates, totalManaged]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              getSearchText={(row) => `${row.user_login} ${row.user_name}`}
              pageSize={50}
              renderRow={(row) => (
              <Fragment key={row.user_login}>
                  <tr>
                    <td className="text-center p-0">
                      
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

                    <td className="fw-bold" data-bs-toggle="tooltip" title={String(row.daily_average)}>
                      {row.daily_average.toFixed(1)}
                    </td>
                    <td className="table-active text-primary fw-bold text-center" data-bs-toggle="tooltip" title={String(row.total_managed)}>
                      {row.total_managed}
                    </td>
                  </tr>

                  {/* Fila de Totales al final */}
                  {data.indexOf(row) === data.length - 1 && (
                    <tr className="table-light fw-bold">
                      <td className="text-center ps-3">TOTAL</td>
                      {allDates.map(date => (
                        <td key={`total-${date}`}>
                          <CellText value={dailyTotals[date]} />
                        </td>
                      ))}
                      {/* Celda vacía para la columna 'Promedio' */}
                      <td>-</td>
                      {/* Gran Total: Usamos el 701 del response directamente */}
                      <td className="table-primary text-primary text-center" data-bs-toggle="tooltip" title={String(totalManaged)}>
                        {totalManaged}
                      </td>
                    </tr>
                  )}
              </Fragment>
              )}
          />
      </div>
    </div>
  );
}