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
          if (historyResult.status === 'fulfilled') {
            setHistory(historyResult.value.data || []);
          } else {
            const mensajeError = historyResult.reason?.message || "Error desconocido";
            error(`Error al obtener el histórico: ${mensajeError}`);
            setHistory([]);
          }

          if (detailsResult.status === 'fulfilled') {
            const data = detailsResult.value.data;
            
            // NORMALIZACIÓN: Si 'data' existe pero NO es un arreglo (es decir, es un solo objeto),
            // lo envolvemos en un arreglo [data] para que el .map() funcione sin romperse.
            if (!data) {
              setDetails([]);
            } else if (Array.isArray(data)) {
              setDetails(data);
            } else {
              setDetails([data]);
            }
            
          } else {
            const errorMessage = detailsResult.reason?.message || detailsResult.reason || "Error desconocido";
            error(`Error en detalle de gestión: ${errorMessage}`);
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
            <div className="col-md-6">
              {/* Sección Histórico de Cambios */}
              <div className="mb-4 sticky-top">
                <h6 className="fw-bold mb-4 text-primary">Histórico de cambios</h6>
                
                {history.length > 0 ? (
                  // Contenedor principal del Timeline (línea lateral izquierda)
                  // Cambiamos border-start a border-start-4 para una línea más gruesa
                  <div className="position-relative ps-3 border-start border-start-4 border-primary ms-1">
                    
                    {history.map((item) => (
                      <div key={item.id} className="mb-4 position-relative py-1"> {/* Agregamos padding vertical */}
                        
                        {/* El punto indicador en la línea: Lo hacemos más grande y le damos un borde blanco */}
                        <div
                          className="position-absolute bg-primary rounded-circle border border-white border-3"
                          style={{ 
                            width: '18px',  // Un poco más grande
                            height: '18px', 
                            left: '-1.6rem', // Posicionamiento preciso en el centro de la línea ps-5
                            top: '0.45rem'  // Alineado visualmente con el centro vertical de la badge
                          }}
                        ></div>

                        {/* Cabecera del registro (Acción y Fecha) */}
                        <div className="d-flex justify-content-between align-items-center mb-2"> {/* mb-3 para más aire */}
                          <div>
                            Acción: <span className="badge bg-primary p-1 fw-bold text-uppercase">{item.accion}</span>
                          </div>
                          <small className="fw-bold">
                            {item.fecha ? new Date(item.fecha).toLocaleString('es-CO') : '-'}
                          </small>
                        </div>

                        {/* Tarjeta con los detalles del cambio - Usamos una tarjeta ligera */}
                        <div className="card shadow-sm border-0 bg-light p-3">
                          <div className="row g-2" style={{ fontSize: '0.9rem' }}>
                            <div className="col-12 mb-1 mt-0">
                              <strong className="text-dark">Usuario:</strong> <span className="ms-2">{item.usuario_nombre || item.usuario || '-'}</span>
                            </div>
                            
                            {(item.asesor_asignado_nombre || item.asesor_asignado) && (
                              <div className="col-12 mb-1 mt-0">
                                <strong className="text-dark">Asesor Asignado:</strong> <span className="ms-2">{item.asesor_asignado_nombre || item.asesor_asignado}</span>
                              </div>
                            )}

                            <div className="col-12 mt-0 p-2 bg-white rounded border border-secondary border-opacity-25"> {/* Destacamos la transición de estado */}
                              <strong className="text-dark">Transición de estado:</strong>
                              <div className="d-flex align-items-center mt-0" style={{ fontSize: '1rem' }}>
                                <span className="text-decoration-line-through me-2">
                                  {item.estado_anterior}
                                </span> 
                                <span className="text-primary fw-bold mx-2" style={{ fontSize: '1.2rem' }}>&rarr;</span> 
                                <span className="fw-bold text-dark ms-2 text-uppercase">
                                  {item.estado_nuevo}
                                </span>
                              </div>
                            </div>

                            {item.motivo && (
                              <div className="col-12 mt-3 pt-3 border-top">
                                <strong className="text-dark">Motivo:</strong> <span className="ms-2">{item.motivo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  // Alerta de Bootstrap centrada y limpia
                  <div className="alert alert-light border text-center p-4">
                    No hay registros de histórico para este caso.
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
                {/* Sección Gestión Detalle */}
              <div className="mb-4 sticky-top">
                <h6 className="fw-bold mb-4 text-primary">Detalle de gestión</h6>
                {details.length > 0 ? (
                  // Contenedor principal del Timeline (línea lateral izquierda idéntica)
                  <div className="position-relative ps-3 border-start border-start-4 border-primary ms-1">
                    
                    {details.map((item) => (
                      <div key={item.id} className="mb-4 position-relative py-1">
                        
                        {/* El punto indicador en la línea */}
                        <div
                          className="position-absolute bg-primary rounded-circle border border-white border-3"
                          style={{ 
                            width: '18px', 
                            height: '18px', 
                            left: '-1.6rem', 
                            top: '0.45rem' 
                          }}
                        ></div>

                        {/* Cabecera del registro (Acción y Fecha) */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            Acción: <span className="badge bg-primary p-1 fw-bold text-uppercase">{item.accion || '-'}</span>
                            <br />
                            Subacción: <span className="badge bg-primary p-1 fw-bold text-uppercase">{item.subaccion || '-'}</span>
                          </div>
                          <small className="fw-bold">
                            {item.fecha_gestion ? new Date(item.fecha_gestion).toLocaleString('es-CO') : '-'}
                          </small>
                        </div>

                        {/* Tarjeta con los detalles del cambio */}
                        <div className="card shadow-sm border-0 bg-light p-3">
                          <div className="row g-2" style={{ fontSize: '0.9rem' }}>
                            
                            <div className="col-12 mb-1 mt-0">
                              <strong className="text-dark">Usuario:</strong> <span className="ms-2">{item.usuario_nombre || item.usuario || '-'}</span>
                            </div>

                            {item.observacion && (
                              <div className="col-12 mt-2 pt-2 border-top">
                                <strong className="text-dark">Observación:</strong> <span className="ms-2">{item.observacion}</span>
                              </div>
                            )}
                            
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  // Alerta de Bootstrap idéntica a la sección superior
                  <div className="alert alert-light border text-center p-4">
                    No hay detalles de gestión para este caso.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
}