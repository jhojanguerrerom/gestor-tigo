import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import ResolutionFormTab from './components/ResolutionFormTab';
import PausedCasesTab from './components/PausedCasesTab';

export type CaseViewMode = 'RESOLUCION' | 'CONGELADOS';

export default function CaseManagementPage() {
  const [viewMode, setViewMode] = useState<CaseViewMode>('RESOLUCION');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <section className="container py-4">
      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Gestión de casos</h1>
          <button 
            type="button"
            className="btn btn-link p-0 ms-2" 
            onClick={handleRefresh}
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar datos"
          >
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="btn-group shadow-sm">
          <input 
            type="radio" 
            className="btn-check" 
            id="radioResolucion" 
            checked={viewMode === 'RESOLUCION'} 
            onChange={() => setViewMode('RESOLUCION')} 
          />
          <label className="btn btn-outline-primary" htmlFor="radioResolucion">Gestionar oferta</label>
          
          <input 
            type="radio" 
            className="btn-check" 
            style={{ pointerEvents: viewMode === 'RESOLUCION' ? 'none' : 'auto' }}
            id="radioCongelados" 
            checked={viewMode === 'CONGELADOS'} 
            onChange={() => setViewMode('CONGELADOS')} 
          />
          <label className="btn btn-outline-primary" htmlFor="radioCongelados">Ofertas pausadas</label>
        </div>
      </header>

      {viewMode === 'RESOLUCION' ? (
        <ResolutionFormTab refreshKey={refreshKey} />
      ) : (
        <PausedCasesTab 
          refreshKey={refreshKey} 
          onResumeSuccess={() => setViewMode('RESOLUCION')} 
        />
      )}
    </section>
  );
}