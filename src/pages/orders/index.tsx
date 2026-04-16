// src/pages/orders/OrdersHomePage/index.tsx
import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import { enlistmentService } from '@/api/services/enlistmentService';
import ManagementModal from './components/ManagementModal';
import OfferHistoryModal from './components/OfferHistoryModal'; // 1. Importar el modal
import Loading from '@/components/Loading';
import OpenOrdersTab from './components/OpenOrdersTab';
import InTransitOrdersTab from './components/InTransitOrdersTab';

export type ViewMode = 'ABIERTO' | 'TRAMITE';

export default function OrdersHomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('ABIERTO');
  const [refreshKey, setRefreshKey] = useState(0);

  // --- ESTADOS PARA MODAL DE GESTIÓN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfertaId, setSelectedOfertaId] = useState('');
  const [selectedInTransit, setSelectedInTransit] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- 2. ESTADOS PARA MODAL DE HISTORIAL ---
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyOfertaId, setHistoryOfertaId] = useState('');

  // Handler para refrescar la tabla
  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // --- 3. HANDLER PARA ABRIR HISTORIAL (Se pasará a las Tabs) ---
  const handleOpenHistory = useCallback((ofertaId: string) => {
    setHistoryOfertaId(ofertaId);
    setIsHistoryOpen(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false);
    setHistoryOfertaId('');
  }, []);

  // Handler para abrir el modal de gestión
  const handleOpenModal = useCallback(async (ofertaId: string, row: any) => {
    setIsVerifying(true);
    setSelectedOfertaId(ofertaId);

    try {
      let isInTransit = !!(
        row.usuario_asignado ||
        row.usuario_nombre ||
        row.usuario_asignado_login ||
        row.usuario_asignado_nombre
      );

      if (!isInTransit) {
        const response = await enlistmentService.getInTransit(1, 100);
        const inTransitList = response.data || [];
        isInTransit = inTransitList.some((item: any) => {
          const itemOferta = item.oferta || item.campos_dinamicos?.oferta;
          return itemOferta?.toString().trim() === ofertaId?.toString().trim();
        });
      }

      setSelectedInTransit(isInTransit);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al validar estado:', error);
      setSelectedInTransit(false);
      setIsModalOpen(true);
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOfertaId('');
    setSelectedInTransit(false);
  }, []);

  return (
    <section className="container py-4">
      {isVerifying && <Loading fullScreen text="Verificando asignación..." />}

      <header className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Estado de trabajo</h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2" 
            onClick={handleRefresh} 
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar tabla"
            >
            <Icon name="refresh" size="xl" />
          </button>
        </div>
        <div className="btn-group shadow-sm">
          <input type="radio" className="btn-check" id="radioAbierto" checked={viewMode === 'ABIERTO'} onChange={() => setViewMode('ABIERTO')} />
          <label className="btn btn-outline-primary" htmlFor="radioAbierto">Abiertos</label>
          <input type="radio" className="btn-check" id="radioTramite" checked={viewMode === 'TRAMITE'} onChange={() => setViewMode('TRAMITE')} />
          <label className="btn btn-outline-primary" htmlFor="radioTramite">En trámite</label>
        </div>
      </header>

      {/* 4. Pasamos onOpenHistory a las pestañas */}
      {viewMode === 'ABIERTO' ? (
        <OpenOrdersTab 
          refreshKey={refreshKey} 
          onManage={handleOpenModal} 
          onOpenHistory={handleOpenHistory} 
        />
      ) : (
        <InTransitOrdersTab 
          refreshKey={refreshKey} 
          onManage={handleOpenModal} 
          onOpenHistory={handleOpenHistory}
        />
      )}

      {/* Modal de Gestión */}
      <ManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ofertaId={selectedOfertaId}
        onSuccess={handleRefresh}
        isInTransit={selectedInTransit}
      />

      {/* 5. Componente del Modal de Historial */}
      <OfferHistoryModal
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        ofertaId={historyOfertaId}
      />
    </section>
  );
}