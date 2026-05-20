import { useEffect, useState, useCallback } from 'react';
import BaseModal from '@/components/BaseModal';
import { offerConfigHistoryService, type OfferConfigHistoryItem } from '../../../../api/services/offerConfigService';
import { useToast } from '../../../../context/ToastContext';

interface OfferConfigHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferConfigHistoryModal({ isOpen, onClose }: OfferConfigHistoryModalProps) {
  // --- ESTADO ---
  const [history, setHistory] = useState<OfferConfigHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  // --- HELPERS ---
  // Traduce las acciones del backend al español
  const formatAction = useCallback((action: string) => {
    if (!action) return '-';
    const upperAction = action.toUpperCase();
    if (upperAction === 'UPDATE') return 'Actualización';
    if (upperAction === 'CREATE') return 'Creación';
    return action;
  }, []);

  // Formatea los valores viejos y nuevos (🟢 Eliminado parámetro 'campo' sin usar)
  const formatValue = useCallback((value: any) => {
    if (value === null || value === undefined || value === '') return 'Vacío';
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          // Si el arreglo parseado está vacío, muestra 'Todos'
          if (parsed.length === 0) return 'Todos';
          return parsed.join(', ');
        }
      } catch {}
      
      // Formateo de fechas
      const date = new Date(value);
      if (!isNaN(date.getTime()) && value.includes('T')) return date.toLocaleString('es-CO');
      if (!isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value)) return date.toLocaleDateString('es-CO');
    }
    
    if (Array.isArray(value)) {
      // Si es un Array nativo vacío, muestra 'Todos'
      if (value.length === 0) return 'Todos';
      return value.join(', ');
    }
    
    return String(value);
  }, []);

  // --- FETCH DATA ---
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await offerConfigHistoryService.getHistory();
      setHistory(res.data || []);
    } catch (e) {
      error('Error al obtener historial de configuración');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [error]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de cambios"
      size="modal-lg"
    >
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="overflow-auto custom-scrollbar px-2" style={{ maxHeight: '70vh' }}>
          {history.length === 0 ? (
            <div className="alert alert-light border text-center p-3 small">
              No hay historial de cambios registrado.
            </div>
          ) : (
            <div className="position-relative ps-3 border-start border-start-4 border-primary ms-2 my-2">
              {history.map((item) => (
                <div key={item.id} className="mb-4 position-relative py-1">
                  {/* Círculo indicador de la línea de tiempo */}
                  <div 
                    className="position-absolute bg-primary rounded-circle border border-white border-3" 
                    style={{ width: '18px', height: '18px', left: '-1.6rem', top: '0.45rem' }}
                  ></div>

                  {/* Encabezado del Item: Acción y Fecha */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary p-1 fw-bold text-uppercase">
                      {formatAction(item.accion)}
                    </span>
                    <small className="fw-bold text-muted">
                      {item.changed_at ? new Date(item.changed_at).toLocaleString('es-CO') : '-'}
                    </small>
                  </div>

                  {/* Tarjeta de Contenido */}
                  <div className="card shadow-sm border-0 bg-light p-3">
                    <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                      
                      {/* Metadatos de la configuración */}
                      <div className="col-12 mb-1">
                        <span className="fw-bold text-dark">{item.nombre_config}</span>
                        <span className="text-muted small ms-2">por <b>{item.changed_by}</b></span>
                      </div>

                      {/* Desglose de cambios en campos */}
                      {item.cambios_detalle && Object.keys(item.cambios_detalle).length > 0 ? (
                        <div className="col-12 p-2 bg-white rounded border border-secondary border-opacity-25 mt-2">
                          <div className="row g-3">
                            {Object.entries(item.cambios_detalle).map(([campo, valores]) => (
                              <div key={campo} className="col-12 col-md-6">
                                <small className="d-block text-muted mb-1 fw-bold text-capitalize">
                                  {campo.replace(/_/g, ' ')}:
                                </small>
                                <div className="d-flex align-items-center flex-wrap">
                                  {/* 🟢 Cambiado: Ahora invoca formatValue solo con el valor necesario */}
                                  <span className="text-decoration-line-through text-muted me-2">
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
                      ) : (
                        <div className="col-12 mt-2">
                          <div className="alert alert-light border text-center p-2 small mb-0">
                            Sin detalle de cambios técnicos.
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}