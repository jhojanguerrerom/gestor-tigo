import { Fragment, useState, useCallback } from 'react'
import { useEffect } from 'react'
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable'
import DataTable from '../../components/tables/DataTable'
import { Icon } from '@/icons/Icon'
import ManagementModal from './ManagementModal'

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
    setRefreshKey(prev => prev + 1)
  }, [])

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

  const processRuralAddress = (address: string) => {
    if (address?.toUpperCase().includes('RURAL')) {
      const match = address.match(/(\d{5,})/)
      if (match) {
        const numericString = match[0]
        const cleanedAddress = address.replace(numericString, '').trim()
        return { cleanedAddress, paginacion: numericString }
      }
    }
    return { cleanedAddress: address, paginacion: null }
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
          const { cleanedAddress, paginacion } = processRuralAddress(row.campos_dinamicos?.direccion)
          const processedAddress = cleanedAddress
          const processedPaginacion = paginacion || row.campos_dinamicos?.paginacion || '-'
          return (
            <Fragment key={row.hash_registro}>
              <tr>
                <td>
                  <Icon name="user-call" size="lg" className="me-2" />
                  {row.campos_dinamicos?.usuario ? (
                    <span className="badge text-bg-blue" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.usuario}>
                      {row.campos_dinamicos?.usuario}
                    </span>
                  ) : (
                    <span className="badge text-bg-warning text-dark" data-bs-toggle="tooltip" data-bs-placement="top" title="Sin asignar">
                      Sin asignar
                    </span>
                  )}
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.oferta}>
                    {row.campos_dinamicos?.oferta}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.pedido_id}>
                    {row.campos_dinamicos?.pedido_id || '-'}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.concepto_id || row.campos_dinamicos?.concepto}>
                    {row.campos_dinamicos?.concepto_id || row.campos_dinamicos?.concepto || '-'}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.uen}>
                    {row.campos_dinamicos?.uen}
                  </span>
                </td>
                <td>
                  <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.fecha_creado ? new Date(row.campos_dinamicos.fecha_creado).toLocaleString('es-CO') : ''}>
                    {row.campos_dinamicos?.fecha_creado ? new Date(row.campos_dinamicos.fecha_creado).toLocaleString('es-CO') : ''}
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
                  <button className="badge rounded-pill text-bg-bluelight text-decoration-none p-2 border-0" onClick={() => handleOpenModal(row.campos_dinamicos?.oferta)}>
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
                              <th scope="col">Coordenadas</th>
                              <th scope="col">Nodo ID TAP</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.direccion}>
                                  {row.campos_dinamicos?.direccion || '-' }
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={processedPaginacion}>
                                  {processedPaginacion}
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.coordenadas}>
                                  {row.campos_dinamicos?.coordenadas || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.nodo_id}>
                                  {row.campos_dinamicos?.nodo_id || '-'}
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
      {isModalOpen && (
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
