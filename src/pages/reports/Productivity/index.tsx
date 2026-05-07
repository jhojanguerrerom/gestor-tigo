import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import HourlyTab from './components/HourlyTab';
import DailyProductivityTab from './components/DailyProductivityTab';
import PendingByConceptTab from './components/PendingByConceptTab';


type ViewMode = 'HOURLY' | 'DAILY' | 'PENDING';

export default function ManagementByHourPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('HOURLY');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <section className="container py-4">
      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">
            {viewMode === 'HOURLY' && 'Gestión por horas de hoy'}
            {viewMode === 'DAILY' && 'Gestión por fechas'}
            {viewMode === 'PENDING' && 'Ofertas pendientes'}
          </h1>
          <button onClick={handleRefresh} className="btn btn-link p-0 ms-2 shadow-none" data-bs-placement="right" data-bs-toggle="tooltip" title="Actualizar datos">
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="btn-group shadow-sm border-2">
            <input type="radio" className="btn-check" id="radioHourly" checked={viewMode === 'HOURLY'} onChange={() => setViewMode('HOURLY')} />
            <label className="btn btn-outline-primary px-3" htmlFor="radioHourly">Gestiones de hoy</label>
            
            <input type="radio" className="btn-check" id="radioDaily" checked={viewMode === 'DAILY'} onChange={() => setViewMode('DAILY')} />
            <label className="btn btn-outline-primary px-3" htmlFor="radioDaily">Gestiónes por fecha</label>

            <input disabled type="radio" className="btn-check" id="radioPending" checked={viewMode === 'PENDING'} onChange={() => setViewMode('PENDING')} />
            <label className="btn btn-outline-primary px-3" htmlFor="radioPending">Ofertas pendientes</label>
          </div>
        </div>
      </header>

      <div className="tab-content pt-2">
        {viewMode === 'HOURLY' && <HourlyTab refreshKey={refreshKey} />}
        {viewMode === 'DAILY' && <DailyProductivityTab refreshKey={refreshKey} />}
        {viewMode === 'PENDING' && <PendingByConceptTab refreshKey={refreshKey} />}
      </div>
    </section>
  );
}