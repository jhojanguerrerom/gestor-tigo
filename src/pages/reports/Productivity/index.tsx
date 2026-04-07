import { useState, useMemo, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import DateRangePicker from '@/components/DateRangePicker';
import { formatDate, addDays } from '@/utils/dateUtils';
import { useToast } from '@/context/ToastContext';
import HourlyTab from './components/HourlyTab';
import DailyProductivityTab from './components/DailyProductivityTab';

type ViewMode = 'HOURLY' | 'DAILY';

export default function ManagementByHourPage() {
  const { warning, error } = useToast(); // Usamos warning para el rango
  const today = useMemo(() => new Date(), []);
  
  const [viewMode, setViewMode] = useState<ViewMode>('HOURLY');
  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(addDays(today, 1)));
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => setRefreshKey(prev => prev + 1), []);

  const handleDateChange = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    
    // 1. Validación: Fecha inicio mayor a fin
    if (start > end) {
      error("La fecha inicial no puede ser posterior a la final");
      return; // Bloqueamos el cambio
    }

    // Calcular diferencia
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 2. Validación: Máximo 90 días (Sin ajuste automático)
    if (diffDays > 90) {
      warning("Seleccione un rango máximo de 90 días");
      return; // Bloqueamos el cambio
    }

    // Si todo está correcto, actualizamos
    setFromDate(from);
    setToDate(to);
  };

  return (
    <section className="container py-4">
      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0 text-primary">
            {viewMode === 'HOURLY' ? 'Gestión por horas' : 'Gestión por fechas'}
          </h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2 text-decoration-none shadow-none" 
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar tabla"
            onClick={handleRefresh}>
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          {viewMode === 'DAILY' && (
            <DateRangePicker 
              fromDate={fromDate} 
              toDate={toDate} 
              onChange={handleDateChange} 
              showToday={false}
            />
          )}

          <div className="btn-group shadow-sm border-2">
            <input 
              type="radio" className="btn-check" id="radioHourly" 
              checked={viewMode === 'HOURLY'} 
              onChange={() => setViewMode('HOURLY')} 
            />
            <label className="btn btn-outline-primary px-4" htmlFor="radioHourly">Hoy</label>
            
            <input 
              type="radio" className="btn-check" id="radioDaily" 
              checked={viewMode === 'DAILY'} 
              onChange={() => setViewMode('DAILY')} 
            />
            <label className="btn btn-outline-primary px-4" htmlFor="radioDaily">Por fecha</label>
          </div>
        </div>
      </header>

      <div className="tab-content border-top pt-4">
        {viewMode === 'HOURLY' ? (
          <HourlyTab refreshKey={refreshKey} />
        ) : (
          <DailyProductivityTab 
            fromDate={fromDate} 
            toDate={toDate} 
            refreshKey={refreshKey} 
          />
        )}
      </div>
    </section>
  );
}