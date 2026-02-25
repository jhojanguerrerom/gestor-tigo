import { Fragment, useState } from 'react'
// Utilidad para formatear fecha y hora
function formatDateTime(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  // Formatear fecha y hora con segundos manualmente
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable'
import { Link } from 'react-router-dom'
import DataTable from '../../components/tables/DataTable'
import { Icon } from '@/icons/Icon'

/**
 * Admin home page.
 */
export default function OrdersHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const tableId = 'adminTable'
  const pageSize = 10
  const {
    data: rows,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  } = useEnlistmentTable({ pageSize, searchQuery })

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

  const getSearchText = (row: any) =>
    [
      row.campos_dinamicos?.usuario,
      row.campos_dinamicos?.oferta,
      row.campos_dinamicos?.pedido_id,
      row.campos_dinamicos?.concepto_id || row.campos_dinamicos?.concepto,
      row.campos_dinamicos?.uen,
      row.campos_dinamicos?.direccion,
      row.campos_dinamicos?.fecha_creado,
      row.campos_dinamicos?.accion,
      row.campos_dinamicos?.subaccion,
      row.campos_dinamicos?.observacion,
      row.campos_dinamicos?.coordenadas || '',
      row.campos_dinamicos?.paginacion,
      row.campos_dinamicos?.nodo_id,
      row.campos_dinamicos?.megagold,
    ].join(' ')

  return (
    <section className="container py-4">
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Estado de trabajo</h1>
        {/* <p className="text-body-secondary mb-0">
          Summary table for admin operations.
        </p> */}
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
        renderRow={(row: any) => (
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
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={formatDateTime(row.campos_dinamicos?.fecha_creado)}>
                  {formatDateTime(row.campos_dinamicos?.fecha_creado)}
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
                <Link className="badge rounded-pill text-bg-bluelight text-decoration-none p-2" to="/cases/resolve">
                  Tomar pedido
                </Link>
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
                            <th scope="col">Paginación</th>
                            <th scope="col">Coordenadas</th>
                            <th scope="col">Acción</th>
                            <th scope="col">Subacción</th>
                            <th scope="col">Observación</th>
                            <th scope="col">Nodo ID TAP</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.direccion}>
                                {row.campos_dinamicos?.direccion}
                              </span>
                            </td>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.paginacion}>
                                {row.campos_dinamicos?.paginacion || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.coordenadas}>
                                {row.campos_dinamicos?.coordenadas || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.accion}>
                                {row.campos_dinamicos?.accion || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.subaccion}>
                                {row.campos_dinamicos?.subaccion || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.campos_dinamicos?.observacion}>
                                {row.campos_dinamicos?.observacion || '-'}
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
        )}
        getSearchText={() => ''}
        searchQuery=""
        onSearchChange={() => {}}
        tableId={tableId}
      />
    </section>
  )
}
