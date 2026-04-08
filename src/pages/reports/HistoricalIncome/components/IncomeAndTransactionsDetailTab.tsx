import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import CustomChart, { type ChartSeries } from '@/components/CustomChart';
import DateRangePicker from '@/components/DateRangePicker';
import { reportService, type HistoricalDataPoint } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils/dateUtils';
import { useToast } from '@/context/ToastContext';

interface TabProps { 
  refreshKey: number; 
}

type MetricView = 'BOTH' | 'INCOME' | 'MANAGED';

export default function IncomeAndTransactionsDetailTab({ refreshKey }: TabProps) {
  const { error, warning } = useToast();
  
  // Filtros internos
  const [metricView, setMetricView] = useState<MetricView>('BOTH');
  const [dates, setDates] = useState({ 
    from: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: formatDate(new Date()) 
  });
  
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<Record<string, HistoricalDataPoint[]>>({});
  const lastRefreshKey = useRef(refreshKey);

  // Validación de rango máximo 90 días (Igual a tu referencia)
  const isRangeValid = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  }, []);

  const fetchReport = useCallback(async (forceRefresh = false) => {
    // Verificación de seguridad antes de llamar a la API
    if (!isRangeValid(dates.from, dates.to)) {
      warning('Seleccione un rango máximo de 90 días');
      setData([]); 
      return;
    }

    const cacheKey = `${dates.from}_${dates.to}_${metricView}`;

    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      return;
    }

    if (forceRefresh) {
      delete cacheRef.current[cacheKey];
    }

    setLoading(true);
    try {
      const res = await reportService.getDailyComparative(
        dates.from, 
        dates.to, 
        'ALL', 
        metricView
      );
      const result = res.data?.data || [];
      cacheRef.current[cacheKey] = result;
      setData(result);
    } catch (err) {
      error('Error al cargar el comparativo diario');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dates, metricView, error, warning, isRangeValid]);

  useEffect(() => {
    const isManualRefresh = refreshKey !== lastRefreshKey.current;
    lastRefreshKey.current = refreshKey;
    fetchReport(isManualRefresh);
  }, [fetchReport, refreshKey]);

  const chartConfig = useMemo((): ChartSeries[] => {
    const config: ChartSeries[] = [];
    if (metricView === 'BOTH' || metricView === 'INCOME') {
      config.push({ key: 'income', label: 'Ingresos', type: 'bar', color: '#001eb4', showColorInAxis: true });
    }
    if (metricView === 'BOTH' || metricView === 'MANAGED') {
      config.push({ key: 'managed', label: 'Gestiones', type: 'bar', color: '#FFBE00', yAxisId: 'right', showColorInAxis: true });
    }
    return config;
  }, [metricView]);

  return (
    <div className="position-relative">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div>
            <label className="form-label">Métrica</label>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '200px' }}
              value={metricView}
              onChange={(e) => setMetricView(e.target.value as MetricView)}
            >
              <option value="BOTH">Todos (Ambos)</option>
              <option value="INCOME">Solo Ingresos</option>
              <option value="MANAGED">Solo Gestiones</option>
            </select>
          </div>
        </div>

        <div>
           <DateRangePicker 
             fromDate={dates.from} 
             toDate={dates.to} 
             showToday={false}
             onChange={(from, to) => setDates({ from, to })} 
           />
        </div>
      </div>

      {loading && <Loading fullScreen text="Cargando..." />}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 font-dm-bold text-secondary">
            Ingresos y/o Gestiones de <span className="text-muted fw-normal small">({dates.from} a {dates.to})</span>
          </h5>
        </div>
        <div className="card-body p-4">
          <CustomChart 
            data={data} 
            xAxisKey="date" 
            series={chartConfig} 
            height={450} 
            onlyDays={true} 
          />
        </div>
      </div>
    </div>
  );
}