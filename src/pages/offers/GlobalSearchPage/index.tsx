import { useState, useCallback } from 'react';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { useToast } from '@/context/ToastContext';
import { formatDateTime } from '@/utils/dateUtils';
import OfferClosedHistoryModal from '@/pages/offers/components/OfferClosedHistoryModal';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips';

const CellText = ({ value, className = '' }: { value?: string | number | null; className?: string }) => {
  const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);
  const showTooltip = displayValue !== '-';
  return (
    <span 
      className={`cell-text ${className}`} 
      data-bs-toggle={showTooltip ? 'tooltip' : undefined} 
      title={showTooltip ? displayValue : undefined}
    >
      {displayValue}
    </span>
  );
};

export default function GlobalSearchPage() {
  const { error, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState<any | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Inicializar tooltips cuando cambie la oferta
  useBootstrapTooltips([offer]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    
    if (!query) {
      info('Por favor ingrese el ID de la oferta');
      return;
    }

    setLoading(true);
    try {
      const response = await enlistmentService.searchByOferta(query, 1, 1);
      const foundData = response.data?.data || [];

      if (foundData.length > 0) {
        setOffer(foundData[0]);
      } else {
        setOffer(null);
        error('No se encontró ninguna oferta con ese ID');
      }
    } catch (err) {
      error('Error al conocer la oferta');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, error, info]);

  return (
    <section className="container py-4">
      {/* 1. Cargando Transversal (Overlay) */}
      {loading && <Loading fullScreen text="Buscando..." />}

      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-0">Consulta global de ofertas</h1>
      </header>

      <div className="row">
        <div className="col-12 col-lg-8">
          {/* Buscador */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <form onSubmit={handleSearch}>
                <div className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Icon name="look-for" size="lg" className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="Ingrese el ID de la oferta (ej: 1-12345678)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="button button-blue px-4" type="submit" disabled={loading}>
                    Consultar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Resultado de la búsqueda */}
          {offer && !loading && (
            <div className="animate__animated animate__fadeIn">
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Icon name="info" size="xl" className="text-primary me-2" />
                    <span className="font-dm-bold h5 mb-0">Información de la Oferta</span>
                  </div>
                  <span className={`badge rounded-pill p-2 px-3 ${offer.estado_oferta?.includes('CERRADO') ? 'text-bg-secondary' : 'text-bg-blue'}`}>
                    {offer.estado_oferta || 'ESTADO'}
                  </span>
                </div>
                
                <div className="card-body p-0">
                  <div className="p-4 bg-light">
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0 bg-white text-center">
                        <thead className="table-secondary small">
                          <tr>
                            <th>Oferta</th>
                            <th>Asesor asignado</th>
                            <th>Concepto</th>
                            <th>Producto</th>
                            <th>Tecnología</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title={offer.oferta || '-'}>
                              {offer.oferta || '-'}
                            </td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title={offer.usuario_asignado_nombre || 'SIN ASIGNAR'}>
                              <span className="badge text-bg-blue">
                                {offer.usuario_asignado_login || 'SIN ASIGNAR'}
                              </span>
                            </td>
                            <td><CellText value={offer.campos_dinamicos?.concepto} /></td>
                            <td><CellText value={offer.campos_dinamicos?.producto} /></td>
                            <td><CellText value={offer.campos_dinamicos?.tecnologia} /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0 bg-white text-center">
                        <thead className="table-secondary small">
                          <tr>
                            <th>Documento</th>
                            <th>Regional</th>
                            <th>Municipio / Dpto</th>
                            <th>Canal</th>
                            <th>UEN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><CellText value={offer.campos_dinamicos?.documento} /></td>
                            <td><CellText value={offer.campos_dinamicos?.regional} /></td>
                            <td>
                              <CellText value={`${offer.campos_dinamicos?.municipio || ''} - ${offer.campos_dinamicos?.departamento || ''}`} />
                            </td>
                            <td><CellText value={offer.campos_dinamicos?.canal} /></td>
                            <td><CellText value={offer.campos_dinamicos?.uen} /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-light">
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0 bg-white text-center">
                        <thead className="table-secondary small">
                          <tr>
                            <th>Tipo Scoring</th>
                            <th>Estado Scoring</th>
                            <th>Tipo Trabajo</th>
                            <th>Fecha Creado</th>
                            <th>Fecha Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><CellText value={offer.campos_dinamicos?.tipo_scoring} /></td>
                            <td><CellText value={offer.campos_dinamicos?.estado_scoring} /></td>
                            <td><CellText value={offer.campos_dinamicos?.tipo_trabajo} /></td>
                            <td><CellText value={formatDateTime(offer.campos_dinamicos?.fecha_creado)} /></td>
                            <td><CellText value={formatDateTime(offer.campos_dinamicos?.fecha_estado)} /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {offer.campos_dinamicos?.comentario && (
                    <div className="px-4 pb-4 bg-light">
                       <div className="alert alert-secondary mb-0 py-2 small border-0 shadow-none">
                         <strong>Comentario sistema:</strong> {offer.campos_dinamicos.comentario}
                       </div>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-white border-top-0 p-4 d-flex justify-content-end align-items-center">
                  <Icon name="plus" size="xl" />
                  <button 
                    className="button button-gray d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setIsHistoryModalOpen(true)}
                  >
                    Ver historial de cambios y detalles de la gestión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div className="alert alert-info border-0 shadow-sm p-4">
            <h5 className="font-dm-bold text-info-emphasis">
              <Icon name="megaphone" size="xl" className="me-2" />
              ¿Qué puedes consultar?
            </h5>
            <ul className="mt-3 mb-0 ps-3 small">
              <li className="mb-2"><strong>Ofertas abiertas:</strong> Ofertas aún no gestionadas.</li>
              <li className="mb-2"><strong>Ofertas en trámite:</strong> Ofertas con un asesor asignado.</li>
              <li className="mb-2"><strong>Ofertas cerradas:</strong> Histórico de ofertas finalizadas.</li>
              <li>Trazabilidad completa de modificaciones por campo.</li>
            </ul>
          </div>
        </div>
      </div>

      <OfferClosedHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        ofertaId={offer?.oferta || ''} 
      />
    </section>
  );
}