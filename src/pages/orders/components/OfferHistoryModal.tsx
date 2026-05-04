import { useEffect, useState, useCallback } from 'react';
import BaseModal from '@/components/BaseModal';
import { offerService } from '@/api/services/offerService';
import { useToast } from '@/context/ToastContext';
import { enlistmentService } from '@/api/services/enlistmentService';

interface OfferClosedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ofertaId: string;
}

interface ChangeHistoryItem {
  id: string;
  created_at: string;
  tipo_operacion: string;
  campos_modificados: Record<string, { old: any; new: any }>;
  campos_dinamicos: Record<string, any>;
}

export default function OfferClosedHistoryModal({ isOpen, onClose, ofertaId }: OfferClosedHistoryModalProps) {
  // --- CONSTANTES Y ESTADO ---
  const CHANGES_LIMIT = 20;
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [changes, setChanges] = useState<ChangeHistoryItem[]>([]);
  const [changesPage, setChangesPage] = useState(1);
  const [changesTotalPages, setChangesTotalPages] = useState(1);

  // --- HELPERS ---
  const formatValue = useCallback((value: any) => {
    if (value === null || value === undefined || value === '') return 'Vacío';
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime()) && value.includes('T')) return date.toLocaleString('es-CO');
      if (!isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value)) return date.toLocaleDateString('es-CO');
    }
    return String(value);
  }, []);

  // --- FETCH DATA ---
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Solo llamamos a los dos endpoints solicitados
      const [historyResult, changesResult] = await Promise.all([
        offerService.getHistory(ofertaId),
        enlistmentService.getOfferChangeHistory(ofertaId, changesPage, CHANGES_LIMIT)
      ]);

      setHistory(historyResult.data || []);
      setChanges(changesResult.data?.history || []);
      setChangesTotalPages(Math.ceil((changesResult.data?.total_cambios || 0) / CHANGES_LIMIT));
    } catch (err: any) {
      error('Error al obtener datos del histórico');
      setHistory([]);
      setChanges([]);
    } finally {
      setIsLoading(false);
    }
  }, [ofertaId, changesPage, error]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isOpen && ofertaId) {
      fetchAllData();
    }
  }, [isOpen, ofertaId, changesPage, fetchAllData]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Histórico de la oferta: ${ofertaId}`}
      size="modal-xl"
    >
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="container-fluid py-2">
          <div className="row g-4">
            
            {/* COLUMNA 1: CAMBIOS TÉCNICOS (Auditoría de campos) */}
            <div className="col-md-6 border-end">
              <h6 className="fw-bold mb-4 text-primary d-flex align-items-center">
                <i className="bi bi-cpu me-2"></i> Cambios en la oferta
              </h6>
              {changes.length > 0 ? (
                <>
                  <div className="position-relative ps-3 border-start border-start-4 border-primary ms-2">
                    {changes.map((item) => (
                      <div key={item.id} className="mb-4 position-relative py-1">
                        <div className="position-absolute bg-primary rounded-circle border border-white border-3" style={{ width: '18px', height: '18px', left: '-1.65rem', top: '0.45rem' }}></div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary p-1 fw-bold text-uppercase">
                            {item.tipo_operacion}
                          </span>
                          <small className="fw-bold text-muted">
                            {item.created_at ? new Date(item.created_at).toLocaleString('es-CO') : '-'}
                          </small>
                        </div>
                        <div className="card shadow-sm border-0 bg-light p-3">
                          <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                            <div className="col-12 p-2 bg-white rounded border border-secondary border-opacity-25">
                              {item.campos_modificados && Object.entries(item.campos_modificados).map(([campo, valores]) => (
                                <div key={campo} className="mb-2 last-child-mb-0">
                                  <small className="d-block text-muted mb-1 fw-bold text-capitalize">
                                    {campo.replace(/_/g, ' ')}:
                                  </small>
                                  <div className="d-flex align-items-center flex-wrap">
                                    <span className="text-decoration-line-through text-muted me-2 small">
                                      {formatValue(valores.old)}
                                    </span>
                                    <span className="text-primary mx-2">→</span>
                                    <span className="fw-bold text-dark">
                                      {formatValue(valores.new)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginador */}
                  {changesTotalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <div className="btn-group btn-group-sm shadow-sm">
                        <button className="btn btn-white border" disabled={changesPage === 1} onClick={() => setChangesPage(p => p - 1)}>
                          &lt;
                        </button>
                        <span className="btn btn-white border disabled text-dark fw-bold">
                          {changesPage} / {changesTotalPages}
                        </span>
                        <button className="btn btn-white border" disabled={changesPage === changesTotalPages} onClick={() => setChangesPage(p => p + 1)}>
                          &gt;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-light border text-center p-3 small">No se registran cambios técnicos.</div>
              )}
            </div>

            {/* COLUMNA 2: HISTÓRICO DE GESTIONES (Estados) */}
            <div className="col-md-6">
              <h6 className="fw-bold mb-4 text-primary d-flex align-items-center">
                <i className="bi bi-clock-history me-2"></i> Histórico de gestiones
              </h6>
              {history.length > 0 ? (
                <div className="position-relative ps-3 border-start border-start-4 border-primary ms-2">
                  {history.map((item) => (
                    <div key={item.id} className="mb-4 position-relative py-1">
                      <div className="position-absolute bg-primary rounded-circle border border-white border-3" style={{ width: '18px', height: '18px', left: '-1.65rem', top: '0.45rem' }}></div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary p-1 fw-bold text-uppercase">{item.accion}</span>
                        <small className="fw-bold text-muted">{item.fecha ? new Date(item.fecha).toLocaleString('es-CO') : '-'}</small>
                      </div>
                      <div className="card shadow-sm border-0 bg-light p-3">
                        <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                          <div className="col-12"><strong className="text-dark">Gestionado por:</strong> {item.usuario || item.usuario_nombre || 'Sistema'}</div>
                          <div className="col-12 p-2 bg-white rounded border border-secondary border-opacity-25 mt-2">
                            <small className="d-block text-muted mb-1 fw-bold">Movimiento de Estado:</small>
                            <div className="d-flex align-items-center">
                              <span className="text-muted small">{item.estado_anterior || 'Inicio'}</span>
                              <span className="text-primary mx-2">→</span>
                              <span className="fw-bold text-dark text-uppercase">{item.estado_nuevo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-light border text-center p-3 small">Sin registros de estados.</div>
              )}
            </div>

          </div>
        </div>
      )}
    </BaseModal>
  );
}