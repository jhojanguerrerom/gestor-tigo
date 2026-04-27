import { useMemo, useState, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { useToast } from '@/context/ToastContext';
import { offerService } from '@/api/services/offerService';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import OrderHistoryModal from './OrderHistoryModal';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips';

interface PausedCasesTabProps {
  refreshKey: number;
  onResumeSuccess: () => void; // Callback para navegar al tab de Gestión
}

export default function PausedCasesTab({ refreshKey, onResumeSuccess }: PausedCasesTabProps) {
  const { success, error } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para modales y carga de reanudación
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // Función de carga de datos mapeada para el hook
  const fetchFn = useCallback(async () => {
    const res = await offerService.getPausedOffers();
    return {
      ...res,
      data: {
        data: res.data.ofertas,
        pagination: {
          total: res.data.total,
          total_pages: 1
        }
      }
    };
  }, []);

  const { data, loading } = useEnlistmentTable({
    refreshKey,
    fetchFn,
    searchQuery: ''
  });

  // CRÍTICO: Se pasan los datos como dependencia para que los tooltips se activen al renderizar las filas
  useBootstrapTooltips([data, refreshKey]);

  const handleOpenHistory = (ofertaId: string) => {
    setSelectedOfferId(ofertaId);
    setIsHistoryOpen(true);
  };

  const handleResume = async (ofertaId: string) => {
    if (isResuming) return;
    
    setIsResuming(true);
    try {
      const res = await offerService.resumeOffer({ oferta: ofertaId });
      
      if (res.data.type === 'error') {
        error(res.data.message);
      } else {
        success(`Oferta ${ofertaId} reanudada correctamente`);
        onResumeSuccess(); 
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al intentar reanudar la oferta";
      error(msg);
    } finally {
      setIsResuming(false);
    }
  };

  const columns = useMemo(() => [
    { header: 'Oferta' },
    { header: 'Concepto anterior' },
    { header: 'Fecha de pausa' },
    { header: 'Tiempo en pausa' },
    { header: 'Historico' },
    { header: 'Reanudar' }
  ], []);

  return (
    <>
      {/* Componente Loading integrado */}
      {(loading || isResuming) && (
        <Loading fullScreen text={isResuming ? "Reanudando oferta..." : "Cargando casos pausados..."} />
      )}

      <DataTable
        rows={data}
        columns={columns}
        loading={loading || isResuming}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row: any) => `${row.oferta} ${row.concepto_anterior}`}
        renderRow={(row: any) => (
          <tr key={row.oferta}>
            <td>
              <span 
                className="fw-bold text-primary cell-text" 
                data-bs-toggle="tooltip" 
                title={row.oferta}
              >
                {row.oferta}
              </span>
            </td>
            <td>
              <span 
                className="cell-text" 
                data-bs-toggle="tooltip" 
                title={row.concepto_anterior}
              >
                {row.concepto_anterior}
              </span>
            </td>
            <td>
              <span 
                className="cell-text" 
                data-bs-toggle="tooltip" 
                title={new Date(row.fecha_pausa).toLocaleString('es-CO')}
              >
                {new Date(row.fecha_pausa).toLocaleString('es-CO')}
              </span>
            </td>
            <td>
              <span className="badge rounded-pill bg-light text-dark border">
                {row.tiempo_pausado_minutos} min
              </span>
            </td>
            <td>
              <button 
                className="btn btn-link p-0 text-primary border-0"
                onClick={() => handleOpenHistory(row.oferta)}
              >
                <Icon name="look-for" size="lg" /> 
              </button>
            </td>
            <td>
              <button 
                  className="btn btn-link p-0 text-success border-0"
                  onClick={() => handleResume(row.oferta)}
                  disabled={isResuming}
                >
                  <Icon name="play" size="lg" /> 
                </button>
            </td>
          </tr>
        )}
      />

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        ofertaId={selectedOfferId || ''}
      />
    </>
  );
}