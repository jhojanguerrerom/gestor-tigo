import { useState, useEffect, useCallback, useMemo } from 'react';
import CustomChart, { type ChartSeries } from '@/components/CustomChart';
import { reportService } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils/dateUtils';
import DateRangePicker from '@/components/DateRangePicker';
import { useToast } from '@/context/ToastContext'; // Importamos el toast para las alertas

interface TabProps { 
  refreshKey: number; 
}

export default function IncomeDayTab({ refreshKey }: TabProps) {
  const { warning } = useToast(); // Hook para mostrar la advertencia de días
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAverageMode, setIsAverageMode] = useState(false);
  
  const [filters, setFilters] = useState({
    fromDate: formatDate(new Date()),
    toDate: formatDate(new Date())
  });

  // Validación de rango máximo 30 días
  const isRangeValid = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Límite de 30 días
  }, []);

  const fetchReport = useCallback(async () => {
    // Verificación antes de llamar a la API
    if (!isRangeValid(filters.fromDate, filters.toDate)) {
      warning('Seleccione un rango máximo de 30 días');
      setData([]); 
      return;
    }

    setLoading(true);
    try {
      // @ts-ignore
      const res: any = await reportService.getLiveIncome(filters.fromDate, filters.toDate);
      const result = res?.data?.data || [];
      const isAverage = res?.data?.is_average || false;
      
      setIsAverageMode(isAverage);

      const transformedData = result.map((item: any) => ({
        ...item,
        income: !isAverage ? item.quantity : null,
        average: isAverage ? item.quantity : null
      }));

      setData(transformedData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, isRangeValid, warning]); 

  useEffect(() => { 
    fetchReport(); 
  }, [fetchReport, refreshKey]);

  const handleRangeChange = (from: string, to: string) => {
    setFilters({ fromDate: from, toDate: to });
  };

  const chartConfig = useMemo((): ChartSeries[] => {
    const config: ChartSeries[] = [];

    if (!isAverageMode) {
      config.push({ 
        key: 'income', 
        label: 'Ingresos de hoy', 
        type: 'bar', 
        color: '#001eb4',
        showColorInAxis: true
      });
    }

    if (isAverageMode) {
      config.push({ 
        key: 'average', 
        label: 'Promedio del periodo', 
        type: 'bar', 
        color: '#FFBE00', 
        showColorInAxis: true
      });
    }

    return config;
  }, [isAverageMode]);

  return (
    <div className="position-relative">
      {loading && <Loading fullScreen text="Cargando análisis de ingresos..." />}
      
      <div className="d-flex align-items-end gap-2 flex-wrap mb-4 justify-content-end">
        <DateRangePicker 
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          onChange={handleRangeChange}
          labelStart="Desde:"
          labelEnd="Hasta:"
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 font-dm-bold text-secondary">
            {isAverageMode ? 'Promedio de Ingresos' : 'Ingresos'} por hora: {filters.fromDate} {filters.fromDate !== filters.toDate ? `a ${filters.toDate}` : ''}
          </h5>
        </div>
        <div className="card-body p-4">
          <CustomChart 
            data={data} 
            xAxisKey="hour" 
            isHourly={true}
            series={chartConfig} 
            height={450} 
          />
        </div>
      </div>
    </div>
  );
}