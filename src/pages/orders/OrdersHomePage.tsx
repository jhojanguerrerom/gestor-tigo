import { Fragment, useState, useCallback, useEffect, useMemo } from 'react'
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable'
import { enlistmentService } from '@/api/services/enlistmentService'
import DataTable from '../../components/tables/DataTable'
import { Icon } from '@/icons/Icon'
import ManagementModal from './ManagementModal'
import Loading from '@/components/Loading'

export default function OrdersHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'ABIERTO' | 'TRAMITE'>('ABIERTO')
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOfertaId, setSelectedOfertaId] = useState('')

  const tableId = 'adminTable'
  const pageSize = 10

  const getFetchFunction = useCallback(async (page: number, limit: number, search: string) => {
    if (search && viewMode === 'ABIERTO') {
      return await enlistmentService.searchByOferta(search, page, limit)
    }
    return viewMode === 'TRAMITE'
      ? await enlistmentService.getInTransit(page, limit)
      : await enlistmentService.getEnlistments(page, limit, 'ABIERTO')
  }, [viewMode])

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
    fetchFn: getFetchFunction 
  })

  useEffect(() => {
    setSearchQuery('')
    setCurrentPage(1)
  }, [viewMode, setCurrentPage])

  const handleRefresh = useCallback(() => {
    setCurrentPage(1)
    setRefreshKey(prev => prev + 1)
  }, [setCurrentPage])

  const handleOpenModal = (ofertaId: string) => {
    setSelectedOfertaId(ofertaId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOfertaId('')
  }

  const columns = useMemo(() => {
    const baseColumns = [
      { header: 'Oferta Siebel' },
      { header: 'Pedido Fenix' },
      { header: 'Concepto o cola' },
      { header: 'Segmento' },
      { header: 'Fecha ingreso' },
    ]
    return [
      { header: 'Asesor' },
      ...baseColumns,
      ...(viewMode === 'TRAMITE' ? [{ header: 'Tiempo' }] : []),
      { header: 'Detalles' },
      { header: 'Gestión' },
    ]
  }, [viewMode])

  return (
    <section className="container py-4">
      {loading && <Loading fullScreen text="Cargando información..." />}

      <header className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Estado de trabajo</h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2" 
            onClick={handleRefresh} 
            data-bs-toggle="tooltip" 
            title="Actualizar tabla"
            data-bs-placement="right" 
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

      <DataTable<any>
        rows={rows}
        columns={columns}
        tooltipDeps={[rows, searchQuery, currentPage, viewMode]}
        currentPage={currentPage ?? 1}
        setCurrentPage={setCurrentPage}
        total={total ?? 0}
        totalPages={totalPages ?? 1}
        loading={loading}
        onSearchChange={viewMode === 'ABIERTO' ? setSearchQuery : (undefined as any)}
        searchQuery={viewMode === 'ABIERTO' ? searchQuery : ''}
        searchPlaceholder="Buscar por oferta"
        tableId={tableId}
        getSearchText={() => ''}
        renderRow={(row: any) => {
          const campos = row.campos_dinamicos || {}
          const paginacionLimpia = (campos.paginacion || '').trim() || '-'
          const lat = campos.latitude
          const lng = campos.longitude
          const coordenadas = lat && lng ? `${lat}, ${lng}` : (lat || lng || '').trim() || '-'
          const megagold = (campos.megagold || '').trim() || '-'
          const fechaIngreso = campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : ''
          const fechaAsignacion = row.fecha_asignacion ? new Date(row.fecha_asignacion).toLocaleString('es-CO') : '-'

          return (
            <Fragment key={row.hash_registro || row.id || row.oferta}>
              <tr>
                <td>
                  <Icon name="user-call" size="lg" className="me-2" />
                  {viewMode === 'TRAMITE' ? (
                    <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={row.usuario_nombre || row.usuario_asignado}>
                      {row.usuario_nombre || row.usuario_asignado}
                    </span>
                  ) : (
                    <span className="badge text-bg-warning text-dark" data-bs-toggle="tooltip" title="Sin asignar">Sin asignar</span>
                  )}
                </td>

                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.oferta}>{campos.oferta}</span></td>
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
                    data-bs-target={`#details-${row.hash_registro || row.id || row.oferta}`}
                  />
                </td>
                <td>
                  <button className="badge rounded-pill text-bg-bluelight border-0 p-2" onClick={() => handleOpenModal(campos.oferta)}>
                    Gestionar
                  </button>
                </td>
              </tr>

              <tr className="data-details-row">
                <td colSpan={viewMode === 'TRAMITE' ? 9 : 8}>
                  <div className="collapse" id={`details-${row.hash_registro || row.id || row.oferta}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr>
                              <th>Dirección</th>
                              <th>Página</th>
                              <th>Coordenadas</th>
                              {viewMode === 'TRAMITE' && <th>Fecha asignación</th>}
                              <th>Nodo ID TAP</th>
                              <th>Megagold</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.direccion}>{campos.direccion || '-'}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={paginacionLimpia}>{paginacionLimpia}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={coordenadas}>{coordenadas}</span></td>
                              {viewMode === 'TRAMITE' && (
                                <td><span className="cell-text" data-bs-toggle="tooltip" title={fechaAsignacion}>{fechaAsignacion || '-'}</span></td>
                              )}
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.nodo_id}>{campos.nodo_id || '-'}</span></td>
                              <td><span className="cell-text" data-bs-toggle="tooltip" title={megagold}>{megagold}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </Fragment>
          )
        }}
      />

      <ManagementModal isOpen={isModalOpen} onClose={handleCloseModal} ofertaId={selectedOfertaId} onSuccess={handleRefresh} isInTransit={viewMode === 'TRAMITE'} />
    </section>
  )
}