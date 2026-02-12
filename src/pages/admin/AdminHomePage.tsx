import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/tables/DataTable'
import { Icon } from '@/icons/Icon'

/**
 * Admin home page.
 */
export default function AdminHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const tableId = 'adminTable'

  const rows = [
    {
      id: 1,
      advisor: 'Asesor 1',
      offer: 'Upgrade 300M',
      order: 'FX-90111',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Cra 28 #56a 21',
      createdAt: '12/02/2026 08:12 a.m.',
      action: 'Validación',
      subaction: 'Verificar datos',
      observation: 'Cliente pendiente de documentos',
      coordinates: '6.25184, -75.56359',
      pagination: '1/4',
      nodeId: 'NODE-1182',
      megagold: 'Si',
    },
    {
      id: 2,
      advisor: 'Asesor 2',
      offer: 'Fibra 500M',
      order: 'FX-90112',
      concept: 'Ventas',
      segment: 'PYME',
      address: 'Calle 45 #12-90',
      createdAt: '12/02/2026 08:20 a.m.',
      action: 'Activación',
      subaction: 'Validar puerto',
      observation: 'Esperando confirmación interna',
      coordinates: '6.24420, -75.58121',
      pagination: '2/4',
      nodeId: 'NODE-2204',
      megagold: 'No',
    },
    {
      id: 3,
      advisor: 'Asesor 3',
      offer: 'Migración',
      order: 'FX-90113',
      concept: 'Soporte',
      segment: 'Enterprise',
      address: 'Cra 70 #10-11',
      createdAt: '12/02/2026 08:34 a.m.',
      action: 'Seguimiento',
      subaction: 'Agendar visita',
      observation: 'Cliente solicita horario AM',
      coordinates: '6.26710, -75.57944',
      pagination: '3/4',
      nodeId: 'NODE-9031',
      megagold: 'Si',
    },
    {
      id: 4,
      advisor: 'Asesor 4',
      offer: 'Upgrade 200M',
      order: 'FX-90114',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Av. El Poblado 100',
      createdAt: '12/02/2026 08:50 a.m.',
      action: 'Validación',
      subaction: 'Revisión técnica',
      observation: 'Equipo pendiente de inventario',
      coordinates: '6.20980, -75.57010',
      pagination: '1/4',
      nodeId: 'NODE-1140',
      megagold: 'No',
    },
    {
      id: 5,
      advisor: 'Asesor 5',
      offer: 'TV + Internet',
      order: 'FX-90115',
      concept: 'Ventas',
      segment: 'Residencial',
      address: 'Cl 50 #30-22',
      createdAt: '12/02/2026 09:05 a.m.',
      action: 'Gestión',
      subaction: 'Confirmar instalación',
      observation: 'Cliente disponible en la tarde',
      coordinates: '6.23550, -75.56920',
      pagination: '2/4',
      nodeId: 'NODE-5562',
      megagold: 'Si',
    },
    {
      id: 6,
      advisor: 'Asesor 6',
      offer: 'Portabilidad',
      order: 'FX-90116',
      concept: 'Ventas',
      segment: 'PYME',
      address: 'Av. Colombia 45',
      createdAt: '12/02/2026 09:18 a.m.',
      action: 'Revisión',
      subaction: 'Validar cobertura',
      observation: 'Zona con disponibilidad limitada',
      coordinates: '6.25430, -75.57490',
      pagination: '3/4',
      nodeId: 'NODE-4480',
      megagold: 'No',
    },
    {
      id: 7,
      advisor: 'Asesor 7',
      offer: 'Reinstalación',
      order: 'FX-90117',
      concept: 'Soporte',
      segment: 'Residencial',
      address: 'Cl 80 #40-10',
      createdAt: '12/02/2026 09:30 a.m.',
      action: 'Gestión',
      subaction: 'Reagendar visita',
      observation: 'Cliente no estaba en casa',
      coordinates: '6.27660, -75.58610',
      pagination: '4/4',
      nodeId: 'NODE-7710',
      megagold: 'Si',
    },
    {
      id: 8,
      advisor: 'Asesor 8',
      offer: 'Fibra 200M',
      order: 'FX-90118',
      concept: 'Ventas',
      segment: 'Residencial',
      address: 'Av. 33 #65-20',
      createdAt: '12/02/2026 09:45 a.m.',
      action: 'Seguimiento',
      subaction: 'Confirmar visita',
      observation: 'Cliente prefiere SMS',
      coordinates: '6.24210, -75.58570',
      pagination: '1/4',
      nodeId: 'NODE-3321',
      megagold: 'No',
    },
    {
      id: 9,
      advisor: 'Asesor 9',
      offer: 'TV HD',
      order: 'FX-90119',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Cl 10 #5-30',
      createdAt: '12/02/2026 10:02 a.m.',
      action: 'Validación',
      subaction: 'Confirmar dirección',
      observation: 'Dirección incompleta',
      coordinates: '6.23840, -75.56680',
      pagination: '2/4',
      nodeId: 'NODE-6644',
      megagold: 'Si',
    },
    {
      id: 10,
      advisor: 'Asesor 10',
      offer: 'Upgrade 100M',
      order: 'FX-90120',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Av. Las Palmas 12',
      createdAt: '12/02/2026 10:15 a.m.',
      action: 'Gestión',
      subaction: 'Confirmar instalación',
      observation: 'Cliente solicita llamada',
      coordinates: '6.21320, -75.56740',
      pagination: '3/4',
      nodeId: 'NODE-7740',
      megagold: 'No',
    },
    {
      id: 11,
      advisor: 'Asesor 11',
      offer: 'Fibra 1G',
      order: 'FX-90121',
      concept: 'Ventas',
      segment: 'Enterprise',
      address: 'Cl 98 #45-67',
      createdAt: '12/02/2026 10:28 a.m.',
      action: 'Activación',
      subaction: 'Validar cobertura',
      observation: 'Requiere equipo especial',
      coordinates: '6.28910, -75.59020',
      pagination: '4/4',
      nodeId: 'NODE-8821',
      megagold: 'Si',
    },
    {
      id: 12,
      advisor: 'Asesor 12',
      offer: 'TV + Internet',
      order: 'FX-90122',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Cra 15 #20-10',
      createdAt: '12/02/2026 10:45 a.m.',
      action: 'Seguimiento',
      subaction: 'Revisar contrato',
      observation: 'Cliente solicita oferta',
      coordinates: '6.24390, -75.55620',
      pagination: '1/4',
      nodeId: 'NODE-1901',
      megagold: 'No',
    },
    {
      id: 13,
      advisor: 'Asesor 13',
      offer: 'Upgrade 150M',
      order: 'FX-90123',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Av. 80 #44-50',
      createdAt: '12/02/2026 11:02 a.m.',
      action: 'Validación',
      subaction: 'Confirmar pago',
      observation: 'Pago en proceso',
      coordinates: '6.26010, -75.57510',
      pagination: '2/4',
      nodeId: 'NODE-2289',
      megagold: 'Si',
    },
    {
      id: 14,
      advisor: 'Asesor 14',
      offer: 'Fibra 300M',
      order: 'FX-90124',
      concept: 'Ventas',
      segment: 'PYME',
      address: 'Cl 34 #78-12',
      createdAt: '12/02/2026 11:20 a.m.',
      action: 'Activación',
      subaction: 'Asignar técnico',
      observation: 'Requiere visita',
      coordinates: '6.25110, -75.58990',
      pagination: '3/4',
      nodeId: 'NODE-4433',
      megagold: 'No',
    },
    {
      id: 15,
      advisor: 'Asesor 15',
      offer: 'Movilidad',
      order: 'FX-90125',
      concept: 'Soporte',
      segment: 'Residencial',
      address: 'Cra 9 #14-33',
      createdAt: '12/02/2026 11:35 a.m.',
      action: 'Seguimiento',
      subaction: 'Actualizar datos',
      observation: 'Contacto no responde',
      coordinates: '6.24030, -75.57170',
      pagination: '4/4',
      nodeId: 'NODE-9902',
      megagold: 'Si',
    },
    {
      id: 16,
      advisor: 'Asesor 16',
      offer: 'Upgrade 250M',
      order: 'FX-90126',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Cl 55 #60-14',
      createdAt: '12/02/2026 11:48 a.m.',
      action: 'Validación',
      subaction: 'Revisión técnica',
      observation: 'Equipo en bodega',
      coordinates: '6.25960, -75.58330',
      pagination: '1/4',
      nodeId: 'NODE-6630',
      megagold: 'No',
    },
    {
      id: 17,
      advisor: 'Asesor 17',
      offer: 'Fibra 700M',
      order: 'FX-90127',
      concept: 'Ventas',
      segment: 'Enterprise',
      address: 'Cl 100 #50-10',
      createdAt: '12/02/2026 12:05 p.m.',
      action: 'Activación',
      subaction: 'Asignar técnico',
      observation: 'Instalación programada',
      coordinates: '6.29140, -75.59470',
      pagination: '2/4',
      nodeId: 'NODE-8815',
      megagold: 'Si',
    },
    {
      id: 18,
      advisor: 'Asesor 18',
      offer: 'TV Premium',
      order: 'FX-90128',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Av. 68 #30-15',
      createdAt: '12/02/2026 12:22 p.m.',
      action: 'Gestión',
      subaction: 'Confirmar contrato',
      observation: 'Cliente solicita cambio',
      coordinates: '6.24310, -75.58100',
      pagination: '3/4',
      nodeId: 'NODE-4422',
      megagold: 'No',
    },
    {
      id: 19,
      advisor: 'Asesor 19',
      offer: 'Upgrade 400M',
      order: 'FX-90129',
      concept: 'Retención',
      segment: 'Residencial',
      address: 'Cl 24 #61-18',
      createdAt: '12/02/2026 12:40 p.m.',
      action: 'Validación',
      subaction: 'Confirmar agenda',
      observation: 'Cliente disponible mañana',
      coordinates: '6.23220, -75.56060',
      pagination: '1/4',
      nodeId: 'NODE-5541',
      megagold: 'Si',
    },
  ]

  const columns = [
    {
      header: <input className="form-check-input" type="checkbox" aria-label="Select all" />,
      className: 'text-center',
    },
    { header: 'Asesor' },
    { header: 'Oferta Siebel' },
    { header: 'Pedido Fenix' },
    { header: 'Concepto o cola' },
    { header: 'Segmento' },
    { header: 'Dirección' },
    { header: 'Fecha y hora de ingreso' },
    { header: 'Detalles' },
    { header: 'Gestión' },
  ]

  const getSearchText = (row: (typeof rows)[number]) =>
    [
      row.advisor,
      row.offer,
      row.order,
      row.concept,
      row.segment,
      row.address,
      row.createdAt,
      row.action,
      row.subaction,
      row.observation,
      row.coordinates,
      row.pagination,
      row.nodeId,
      row.megagold,
    ].join(' ')

  return (
    <section className="container py-4">
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Estado de trabajo</h1>
        {/* <p className="text-body-secondary mb-0">
          Summary table for admin operations.
        </p> */}
      </header>

      <DataTable
        rows={rows}
        columns={columns}
        renderRow={(row) => (
          <Fragment key={row.id}>
            <tr>
              <td className="text-center">
                <input className="form-check-input" type="checkbox" aria-label={`Seleccionar fila ${row.id}`} />
              </td>
              <td>
                <Icon name="user-call" size="lg" className="me-2" />
                <span className="badge text-bg-blue" data-bs-toggle="tooltip" data-bs-placement="top" title={row.advisor}>
                  {row.advisor}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.offer}>
                  {row.offer}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.order}>
                  {row.order}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.concept}>
                  {row.concept}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.segment}>
                  {row.segment}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.address}>
                  {row.address}
                </span>
              </td>
              <td>
                <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.createdAt}>
                  {row.createdAt}
                </span>
              </td>
              <td className="text-center">
                <Icon name="plus" size="lg"
                  className='cursor-pointer'
                  data-bs-toggle="collapse"
                  data-bs-target={`#caseDetails-${row.id}`}
                  aria-expanded="false"
                  aria-controls={`caseDetails-${row.id}`}
                />
                
              </td>
              <td>
                <Link className="badge rounded-pill text-bg-bluelight text-decoration-none p-2" to="/cases/resolve">
                  Tomar pedido
                </Link>
              </td>
            </tr>
            <tr className="data-details-row">
              <td colSpan={10}>
                <div className="collapse" id={`caseDetails-${row.id}`} data-bs-parent={`#${tableId}`}>
                  <div className="p-3">
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0 data-detail-table text-center">
                        <thead className="table-light text-center">
                          <tr>
                            <th scope="col">Acción</th>
                            <th scope="col">Subacción</th>
                            <th scope="col">Observación</th>
                            <th scope="col">Coordenadas</th>
                            <th scope="col">Paginación</th>
                            <th scope="col">Nodo ID TAP</th>
                            <th scope="col">Megagold</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.action}
                              >
                                {row.action}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.subaction}
                              >
                                {row.subaction}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.observation}
                              >
                                {row.observation}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.coordinates}
                              >
                                {row.coordinates}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.pagination}
                              >
                                {row.pagination}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.nodeId}
                              >
                                {row.nodeId}
                              </span>
                            </td>
                            <td>
                              <span
                                className="cell-text"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.megagold}
                              >
                                {row.megagold}
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
        getSearchText={getSearchText}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por asesor, pedido, dirección..."
        searchLabelId="admin-search-label"
        tableId={tableId}
      />
    </section>
  )
}
