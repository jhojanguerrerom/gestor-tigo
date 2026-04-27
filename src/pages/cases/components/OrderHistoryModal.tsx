import { useEffect, useState } from 'react';
import BaseModal from '@/components/BaseModal';
import { offerService } from '@/api/services/offerService';
import { useToast } from '@/context/ToastContext';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ofertaId: string;
}

export default function OrderHistoryModal({ isOpen, onClose, ofertaId }: OrderHistoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const { error } = useToast();

  useEffect(() => {
    if (isOpen && ofertaId) {
      setIsLoading(true);
      
      Promise.allSettled([
        offerService.getHistory(ofertaId),
        offerService.getManagementDetail(ofertaId)
      ])
        .then(([historyResult, detailsResult]) => {
          // --- PROCESAR HISTÓRICO ---
          if (historyResult.status === 'fulfilled') {
            setHistory(historyResult.value.data || []);
          } else {
            // Solo mostramos error si NO es un 404 (porque 404 significa que está vacío)
            if (historyResult.reason?.response?.status !== 404) {
              const mensajeError = historyResult.reason?.response?.data?.message || "Error al obtener histórico";
              error(mensajeError);
            }
            setHistory([]);
          }

          // --- PROCESAR DETALLES ---
          if (detailsResult.status === 'fulfilled') {
            const data = detailsResult.value.data;
            if (!data) {
              setDetails([]);
            } else if (Array.isArray(data)) {
              setDetails(data);
            } else {
              setDetails([data]);
            }
          } else {
            // SILENCIAR TOAST SI ES 404: 
            // Si el API responde 404 o 500 porque no hay gestiones, simplemente dejamos el array vacío
            // y no disparamos el toast de error.
            const status = detailsResult.reason?.response?.status;
            if (status !== 404 && status !== 500) {
              const errorMessage = detailsResult.reason?.response?.data?.message || "Error en detalle de gestión";
              error(errorMessage);
            }
            setDetails([]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, ofertaId]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Histórico del pedido: ${ofertaId}`}
      size="modal-xl"
    >
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          <div className="row">
            {/* Sección Histórico de Cambios (IZQUIERDA) */}
            <div className="col-md-6 border-end">
              <div className="mb-4">
                <h6 className="fw-bold mb-4 text-primary">
                  <i className="bi bi-clock-history me-2"></i>Histórico de cambios
                </h6>
                
                {history.length > 0 ? (
                  <div className="position-relative ps-3 border-start border-start-4 border-primary ms-1">
                    {history.map((item) => (
                      <div key={item.id} className="mb-4 position-relative py-1">
                        <div className="position-absolute bg-primary rounded-circle border border-white border-3" style={{ width: '18px', height: '18px', left: '-1.6rem', top: '0.45rem' }}></div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            Acción: <span className="badge bg-primary p-1 fw-bold text-uppercase">{item.accion}</span>
                          </div>
                          <small className="fw-bold text-muted">
                            {item.fecha ? new Date(item.fecha).toLocaleString('es-CO') : '-'}
                          </small>
                        </div>
                        <div className="card shadow-sm border-0 bg-light p-3">
                          <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                            <div className="col-12 mb-1">
                              <strong className="text-dark">Usuario:</strong> <span className="ms-2">{item.usuario_nombre || item.usuario || '-'}</span>
                            </div>
                            <div className="col-12 p-2 bg-white rounded border border-secondary border-opacity-25">
                              <small className="d-block text-muted mb-1 fw-bold">Transición:</small>
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
                  <div className="alert alert-light border text-center p-3 small">No hay registros de cambios.</div>
                )}
              </div>
            </div>

            {/* Sección Gestión Detalle (DERECHA) */}
            <div className="col-md-6">
              <div className="mb-4">
                <h6 className="fw-bold mb-4 text-primary">
                  <i className="bi bi-chat-left-text me-2"></i>Detalle de gestión
                </h6>
                {details.length > 0 ? (
                  <div className="position-relative ps-3 border-start border-start-4 border-primary ms-1">
                    {details.map((item) => (
                      <div key={item.id} className="mb-4 position-relative py-1">
                        <div className="position-absolute bg-primary rounded-circle border border-white border-3" style={{ width: '18px', height: '18px', left: '-1.6rem', top: '0.45rem' }}></div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span className="badge bg-primary p-1 fw-bold text-uppercase me-1">{item.accion || '-'}</span>
                            <span className="badge bg-outline-primary border border-primary text-primary p-1 fw-bold text-uppercase">{item.subaccion || '-'}</span>
                          </div>
                          <small className="fw-bold text-muted">
                            {item.fecha_gestion ? new Date(item.fecha_gestion).toLocaleString('es-CO') : '-'}
                          </small>
                        </div>
                        <div className="card shadow-sm border-0 bg-light p-3">
                          <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                            <div className="col-12">
                              <strong className="text-dark">Usuario:</strong> <span className="ms-2">{item.usuario_nombre || item.usuario || '-'}</span>
                            </div>
                            {item.observacion && (
                              <div className="col-12 mt-2 pt-2 border-top">
                                <p className="mb-0 text-muted italic">"{item.observacion}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light border text-center p-3 small">No hay detalles de gestión registrados.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
}