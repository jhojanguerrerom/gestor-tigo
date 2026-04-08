import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import HourlyTab from './components/HourlyTab';
import DailyProductivityTab from './components/DailyProductivityTab';

type ViewMode = 'HOURLY' | 'DAILY';

export default function ManagementByHourPage() {
  // Estado para controlar qué pestaña se muestra
  const [viewMode, setViewMode] = useState<ViewMode>('HOURLY');
  
  // Llave para forzar la recarga de datos en los hijos desde el botón global
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <section className="container py-4">
      {/* HEADER: Título dinámico y Botón de Refresh */}
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
            title="Actualizar datos"
            onClick={handleRefresh}
          >
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        {/* SELECTOR DE VISTA: Formato btn-group (Hoy / Por fecha) */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="btn-group shadow-sm border-2">
            <input 
              type="radio" 
              className="btn-check" 
              id="radioHourly" 
              autoComplete="off"
              checked={viewMode === 'HOURLY'} 
              onChange={() => setViewMode('HOURLY')} 
            />
            <label className="btn btn-outline-primary px-4" htmlFor="radioHourly">
              Hoy
            </label>
            
            <input 
              type="radio" 
              className="btn-check" 
              id="radioDaily" 
              autoComplete="off"
              checked={viewMode === 'DAILY'} 
              onChange={() => setViewMode('DAILY')} 
            />
            <label className="btn btn-outline-primary px-4" htmlFor="radioDaily">
              Por fecha
            </label>
          </div>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO: Renderizado condicional de Tabs */}
      <div className="tab-content pt-2">
        {viewMode === 'HOURLY' ? (
          <HourlyTab refreshKey={refreshKey} />
        ) : (
          <DailyProductivityTab refreshKey={refreshKey} />
        )}
      </div>
    </section>
  );
}