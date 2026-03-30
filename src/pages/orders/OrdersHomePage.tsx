import { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import DataTable from '@/components/tables/DataTable';
import { Icon } from '@/icons/Icon';
import ManagementModal from './ManagementModal';
import Loading from '@/components/Loading';

type ViewMode = 'ABIERTO' | 'TRAMITE';

interface RowType {
  hash_registro?: string;
  id?: string;
  oferta?: string;
  usuario_nombre?: string;
  usuario_asignado?: string;
  tiempo_transcurrido_minutos?: number;
  fecha_asignacion?: string;
  campos_dinamicos?: Record<string, any>;
}

export default function OrdersHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('ABIERTO');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfertaId, setSelectedOfertaId] = useState('');
  
  const [selectedInTransit, setSelectedInTransit] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const tableId = 'adminTable';
  const pageSize = 10;

  const fetchEnlistments = useCallback(
    async (page: number, limit: number, search: string) => {
      if (search && viewMode === 'ABIERTO') {
        return enlistmentService.searchByOferta(search, page, limit);
      }
      return viewMode === 'TRAMITE'
        ? enlistmentService.getInTransit(page, limit)
        : enlistmentService.getEnlistments(page, limit, 'ABIERTO');
    },
    [viewMode]
  );

  const {
    data: rows,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  } = useEnlistmentTable({
    pageSize,
    searchQuery,
    refreshKey,
    fetchFn: fetchEnlistments,
  });

  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [viewMode, setCurrentPage]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  }, [setCurrentPage]);

  const handleOpenModal = useCallback(async (ofertaId: string, row: RowType) => {
    setIsVerifying(true);
    setSelectedOfertaId(ofertaId);

    try {
      // 1. Verificación inicial: Raíz o campos_dinamicos
      let isInTransit = !!(row.usuario_nombre || row.usuario_asignado || row.campos_dinamicos?.usuario_asignado);

      // 2. Validación cruzada con el endpoint de trámites para búsqueda en Abiertos
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
      console.error("Error al validar estado:", error);
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

  const columns = useMemo(() => {
    const baseColumns = [
      { header: 'Oferta Siebel' },
      { header: 'Pedido Fenix' },
      { header: 'Concepto o cola' },
      { header: 'Segmento' },
      { header: 'Fecha ingreso' },
    ];
    return [
      { header: 'Asesor' },
      ...baseColumns,
      ...(viewMode === 'TRAMITE' ? [{ header: 'Tiempo' }] : []),
      { header: 'Detalles' },
      { header: 'Gestión' },
    ];
  }, [viewMode]);

  return (
    <section className="container py-4">
      {(loading || isVerifying) && <Loading fullScreen text={isVerifying ? "Verificando asignación..." : "Cargando..."} />}

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

      <DataTable<RowType>
        rows={rows}
        columns={columns}
        tooltipDeps={[rows, searchQuery, currentPage, viewMode]}
        currentPage={currentPage ?? 1}
        setCurrentPage={setCurrentPage}
        total={total ?? 0}
        totalPages={totalPages ?? 1}
        loading={loading}
        onSearchChange={viewMode === 'ABIERTO' ? setSearchQuery : () => {}}
        searchQuery={viewMode === 'ABIERTO' ? searchQuery : ''}
        searchPlaceholder="Buscar por oferta"
        tableId={tableId}
        getSearchText={() => ''}
        renderRow={(row) => {
          const campos = row.campos_dinamicos || {};
          const isAssigned = !!(row.usuario_nombre || row.usuario_asignado || campos.usuario_asignado);
          const asesorName = row.usuario_nombre || row.usuario_asignado || campos.usuario_asignado;
          const ofertaIdActual = row.oferta || campos.oferta;
          const fechaIngreso = campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : '-';
          const paginacionLimpia = (campos.paginacion || '').trim() || '-';
          const coordenadas = campos.latitude && campos.longitude ? `${campos.latitude}, ${campos.longitude}` : '-';

          return (
            <Fragment key={row.hash_registro || row.id || ofertaIdActual}>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    {isAssigned ? (
                      <>
                        {/* Usamos un Fragmento para agrupar los dos elementos */}
                        <Icon name="user-call" size="lg" className="me-2" />
                        <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={asesorName}>
                          {asesorName}
                        </span>
                      </>
                    ) : (
                      <span className="badge text-bg-warning text-dark w-100" data-bs-toggle="tooltip" title="Sin asignar">
                        Sin asignar
                      </span>
                    )}
                  </div>
                </td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={ofertaIdActual}>{ofertaIdActual}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.pedido_id}>{campos.pedido_id || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.concepto_id || campos.concepto}>{campos.concepto_id || campos.concepto || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.uen}>{campos.uen}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={fechaIngreso}>{fechaIngreso}</span></td>
                
                {viewMode === 'TRAMITE' && (
                  <td className="text-center">
                    <span className="badge rounded-pill bg-light text-dark border">
                      {row.tiempo_transcurrido_minutos} min
                    </span>
                  </td>
                )}

                <td className="text-center">
                  <Icon 
                    name="plus" 
                    size="lg" 
                    className="cursor-pointer" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#details-${row.hash_registro || row.id || ofertaIdActual}`} 
                  />
                </td>
                <td>
                  <button
                    className="badge rounded-pill text-bg-bluelight border-0 p-2"
                    onClick={() => handleOpenModal(ofertaIdActual, row)}
                    type="button"
                  >
                    Gestionar
                  </button>
                </td>
              </tr>

              <tr className="data-details-row">
                <td colSpan={viewMode === 'TRAMITE' ? 9 : 8}>
                  <div className="collapse" id={`details-${row.hash_registro || row.id || ofertaIdActual}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr>
                              <th>Dirección</th>
                              <th>Página</th>
                              <th>Coordenadas</th>
                              {isAssigned && <th>Fecha asignación</th>}
                              <th>Nodo ID TAP</th>
                              <th>Megagold</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.direccion}>{campos.direccion || '-'}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={paginacionLimpia}>{paginacionLimpia}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={coordenadas}>{coordenadas}</span></td>
                              {isAssigned && (
                                <td><span className="cell-text" data-bs-toggle="tooltip" title={row.fecha_asignacion}>{row.fecha_asignacion ? new Date(row.fecha_asignacion).toLocaleString('es-CO') : '-'}</span></td>
                              )}
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.nodo_id}>{campos.nodo_id || '-'}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.megagold}>{campos.megagold || '-'}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        }}
      />

      <ManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ofertaId={selectedOfertaId}
        onSuccess={handleRefresh}
        isInTransit={selectedInTransit}
      />
    </section>
  );
}