import { Fragment, useState, useCallback, useEffect } from 'react'
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable'
import DataTable from '../../components/tables/DataTable'
import { Icon } from '@/icons/Icon'
import ManagementModal from './ManagementModal'
import Loading from '@/components/Loading';

/**
 * Admin home page.
 */
export default function OrdersHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const tableId = 'adminTable'
  const pageSize = 10
  const [refreshKey, setRefreshKey] = useState(0)
  const {
    data: rows,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  } = useEnlistmentTable({ pageSize, searchQuery, refreshKey })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOfertaId, setSelectedOfertaId] = useState('')

  // Resetear página a 1 cuando cambia el searchQuery
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleRefresh = useCallback(() => {
    setCurrentPage(1); 
    setRefreshKey(prev => prev + 1);
  }, [setCurrentPage]); 

  const handleOpenModal = (ofertaId: string) => {
    setSelectedOfertaId(ofertaId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOfertaId('')
  }

  const handleSuccess = () => {
    handleRefresh()
  }

  const columns = [
    { header: 'Asesor' },
    { header: 'Oferta Siebel' },
    { header: 'Pedido Fenix' },
    { header: 'Concepto o cola' },
    { header: 'Segmento' },
    { header: 'Fecha y hora de ingreso' },
    { header: 'Detalles' },
    { header: 'Gestión' },
  ]

  return (
    <section className="container py-4">
      {loading && <Loading fullScreen text="Cargando información..." />}
      <header className="mb-4 d-flex align-items-center justify-content-between">
        <h1 className="h3 font-dm-bold mb-2 mb-0">Estado de trabajo</h1>
        <button type="button" className="btn btn-link p-0 ms-2" onClick={handleRefresh} data-bs-toggle="tooltip" data-bs-placement="left" title="Actualizar tabla">
          <Icon name="refresh" size="xl" />
        </button>
      </header>

      <DataTable<any>
        rows={rows}
        columns={columns}
        tooltipDeps={[rows, searchQuery, currentPage ?? 1]}
        currentPage={currentPage ?? 1}
        setCurrentPage={setCurrentPage}
        total={total ?? 0}
        totalPages={totalPages ?? 1}
        loading={loading}
        renderRow={(row: any) => {
          const campos = row.campos_dinamicos || {};

          // 1. Limpiamos la paginación directamente del backend
          const paginacionLimpia = (campos.paginacion || '').trim() || '-';

          // 2. Concatenamos latitud y longitud de forma segura
          const lat = campos.latitude;
          const lng = campos.longitude;
          const coordenadas = lat && lng 
            ? `${lat}, ${lng}`.trim() 
            : (lat || lng || '').trim() || '-';

          // 3. Limpiamos Megagold
          const megagold = (campos.megagold || '').trim() || '-';

          return (
            <Fragment key={row.hash_registro}>
              <tr>
                <td>
                  <Icon name="user-call" size="lg" className="me-2" />
                  {campos.usuario ? (
                    <span className="badge text-bg-blue" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.usuario}>
                      {campos.usuario}
                    </span>
                  ) : (
                    <span className="badge text-bg-warning text-dark" data-bs-toggle="tooltip" data-bs-placement="top" title="Sin asignar">
                      Sin asignar
                    </span>
                  )}
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.oferta}>
                    {campos.oferta}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.pedido_id}>
                    {campos.pedido_id || '-'}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.concepto_id || campos.concepto}>
                    {campos.concepto_id || campos.concepto || '-'}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.uen}>
                    {campos.uen}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : ''}>
                    {campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : ''}
                  </span>
                </td>
                <td className="text-center">
                  <Icon name="plus" size="lg"
                    className='cursor-pointer'
                    data-bs-toggle="collapse"
                    data-bs-target={`#caseDetails-${row.hash_registro}`}
                    aria-expanded="false"
                    aria-controls={`caseDetails-${row.hash_registro}`}
                  />
                </td>
                <td>
                  <button className="badge rounded-pill text-bg-bluelight text-decoration-none p-2 border-0" onClick={() => handleOpenModal(campos.oferta)}>
                    Gestionar
                  </button>
                </td>
              </tr>
              <tr className="data-details-row">
                <td colSpan={8}>
                  <div className="collapse" id={`caseDetails-${row.hash_registro}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 data-detail-table text-center">
                          <thead className="table-light text-center">
                            <tr>
                              <th scope="col">Dirección</th>
                              <th scope="col">Página</th>
                              <th scope="col">Coordenadas (latitud y longitud)</th>
                              <th scope="col">Nodo ID TAP</th>
                              <th scope="col">Megagold</th> {/* Nueva columna añadida */}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.direccion}>
                                  {campos.direccion || '-' }
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={paginacionLimpia}>
                                  {paginacionLimpia}
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={coordenadas}>
                                  {coordenadas}
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={campos.nodo_id}>
                                  {campos.nodo_id || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={megagold}>
                                  {megagold}
                                </span>
                              </td>
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
        getSearchText={() => ''}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por oferta"
        tableId={tableId}
      />
      { (
        <ManagementModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ofertaId={selectedOfertaId}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  )
}