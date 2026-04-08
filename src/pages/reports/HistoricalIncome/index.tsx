import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips'; 

import TendencyTab from './components/IncomeAndTransactionsMonthTab';
import ComparativeTab from './components/IncomeAndTransactionsDetailTab';
import LiveTab from './components/IncomeDayTab';

type IncomeViewMode = 'TENDENCY' | 'COMPARATIVE' | 'LIVE';

export default function IncomeAnalysisPage() {
  const [viewMode, setViewMode] = useState<IncomeViewMode>('TENDENCY');
  const [refreshKey, setRefreshKey] = useState(0);

  useBootstrapTooltips([viewMode, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <section className="container py-4">
      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0 text-primary">Ingresos y Gestiones</h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2 text-decoration-none shadow-none" 
            onClick={handleRefresh}
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar datos"
          >
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="btn-group shadow-sm border-2">
          <input 
            type="radio" className="btn-check" id="radioTendency" 
            autoComplete="off"
            checked={viewMode === 'TENDENCY'} 
            onChange={() => setViewMode('TENDENCY')} 
          />
          <label className="btn btn-outline-primary px-3" htmlFor="radioTendency">Vista mensual</label>
          
          <input 
            type="radio" className="btn-check" id="radioComp" 
            autoComplete="off"
            checked={viewMode === 'COMPARATIVE'} 
            onChange={() => setViewMode('COMPARATIVE')} 
          />
          <label className="btn btn-outline-primary px-3" htmlFor="radioComp">Rango personalizado</label>

          <input 
            type="radio" className="btn-check" id="radioLive" 
            autoComplete="off"
            checked={viewMode === 'LIVE'} 
            onChange={() => setViewMode('LIVE')} 
          />
          <label className="btn btn-outline-primary px-3" htmlFor="radioLive">Hoy</label>
        </div>
      </header>

      <div className="tab-content pt-2">
        {/* Los hijos gestionan sus propios filtros internos */}
        {viewMode === 'TENDENCY' && (
          <TendencyTab refreshKey={refreshKey} />
        )}
        
        {viewMode === 'COMPARATIVE' && (
          <ComparativeTab refreshKey={refreshKey} />
        )}
        
        {viewMode === 'LIVE' && (
          <LiveTab refreshKey={refreshKey} />
        )}
      </div>
    </section>
  );
}