import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'

/**
 * Vista transversal: ofertas gestionadas.
 */
export default function OffersManagedPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const rows = [
    {
      id: 1,
      offer: '1-90321',
      source: 'SIEBEL',
      finalConcept: 'Retención',
      action: 'Asignado',
      subaction: 'Se busca elemento con red libre',
      city: 'Medellín',
      observation: 'Cliente solicita validación de cobertura',
    },
    {
      id: 2,
      offer: '1-90322',
      source: 'FENIX',
      finalConcept: 'Ventas',
      action: 'Asignado',
      subaction: 'Se busca elemento con red libre /Dirección Estado E',
      city: 'Bogotá',
      observation: 'Verificar disponibilidad en zona norte',
    },
    {
      id: 3,
      offer: '1-90323',
      source: 'SIEBEL',
      finalConcept: 'Soporte',
      action: 'Asignado',
      subaction: 'Se corrige dirección Estado E',
      city: 'Cali',
      observation: 'Dirección corregida, pendiente confirmación',
    },
    {
      id: 4,
      offer: '1-90324',
      source: 'FENIX',
      finalConcept: 'Retención',
      action: 'Cancelado',
      subaction: 'Dirección no existe/errada',
      city: 'Barranquilla',
      observation: 'Cliente no reconoce la dirección',
    },
    {
      id: 5,
      offer: '1-90325',
      source: 'SIEBEL',
      finalConcept: 'Ventas',
      action: 'Cancelado',
      subaction: 'Sin cobertura',
      city: 'Bucaramanga',
      observation: 'Zona sin red disponible',
    },
    {
      id: 6,
      offer: '1-90326',
      source: 'FENIX',
      finalConcept: 'Soporte',
      action: 'Cancelado',
      subaction: 'Red copada',
      city: 'Pereira',
      observation: 'Capacidad agotada en nodo',
    },
    {
      id: 7,
      offer: '1-90327',
      source: 'SIEBEL',
      finalConcept: 'Retención',
      action: 'Cancelado',
      subaction: 'Garantia en el ingreso',
      city: 'Cartagena',
      observation: 'Solicitud con garantía activa',
    },
    {
      id: 8,
      offer: '1-90328',
      source: 'FENIX',
      finalConcept: 'Ventas',
      action: 'Cancelado',
      subaction: 'Minipoligono',
      city: 'Manizales',
      observation: 'Zona restringida por polígono',
    },
    {
      id: 9,
      offer: '1-90329',
      source: 'SIEBEL',
      finalConcept: 'Soporte',
      action: 'Cancelado',
      subaction: 'Gpon Extendido',
      city: 'Ibagué',
      observation: 'Requiere extensión GPON',
    },
    {
      id: 10,
      offer: '1-90330',
      source: 'FENIX',
      finalConcept: 'Ventas',
      action: 'Reconfigurar',
      subaction: 'Cobertura GPON',
      city: 'Santa Marta',
      observation: 'Actualizar cobertura GPON',
    },
    {
      id: 11,
      offer: '1-90331',
      source: 'SIEBEL',
      finalConcept: 'Retención',
      action: 'Reconfigurar',
      subaction: 'Cobertura HFC',
      city: 'Cúcuta',
      observation: 'Validar cobertura HFC actual',
    },
    {
      id: 12,
      offer: '1-90332',
      source: 'FENIX',
      finalConcept: 'Ventas',
      action: 'Asignado',
      subaction: 'Se busca elemento con red libre',
      city: 'Villavicencio',
      observation: 'Enrutamiento en revisión',
    },
    {
      id: 13,
      offer: '1-90333',
      source: 'SIEBEL',
      finalConcept: 'Soporte',
      action: 'Asignado',
      subaction: 'Se busca elemento con red libre /Dirección Estado E',
      city: 'Neiva',
      observation: 'Pendiente validar dirección',
    },
    {
      id: 14,
      offer: '1-90334',
      source: 'FENIX',
      finalConcept: 'Retención',
      action: 'Cancelado',
      subaction: 'Sin cobertura',
      city: 'Pasto',
      observation: 'Sin cobertura en el sector',
    },
    {
      id: 15,
      offer: '1-90335',
      source: 'SIEBEL',
      finalConcept: 'Ventas',
      action: 'Reconfigurar',
      subaction: 'Cobertura GPON',
      city: 'Armenia',
      observation: 'Se ajusta cobertura para GPON',
    },
  ]

  const columns = [
    { header: 'Oferta' },
    { header: 'Fuente' },
    { header: 'Concepto final' },
    { header: 'Acción' },
    { header: 'Subacción' },
    { header: 'Ciudad' },
    { header: 'Observación' },
  ]

  const getSearchText = (row: (typeof rows)[number]) =>
    [row.offer, row.source, row.finalConcept, row.action, row.subaction, row.city, row.observation].join(' ')

  return (
    <section className="container py-4">
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Ofertas gestionadas</h1>
        <p className="text-body-secondary mb-0">
          Solo se visualizan las ofertas que han sido gestionadas en el día actual.
        </p>
      </header>

      <DataTable
        rows={rows}
        columns={columns}
        renderRow={(row) => (
          <tr key={row.id}>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.offer}>
                {row.offer}
              </span>
            </td>
            <td>
              <span className="badge text-bg-blue" data-bs-toggle="tooltip" data-bs-placement="top" title={row.source}>
                {row.source}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.finalConcept}>
                {row.finalConcept}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.action}>
                {row.action}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.subaction}>
                {row.subaction}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.city}>
                {row.city}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" data-bs-placement="top" title={row.observation}>
                {row.observation}
              </span>
            </td>
          </tr>
        )}
        getSearchText={getSearchText}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por oferta, acción, ciudad..."
        searchLabelId="offers-search-label"
      />
    </section>
  )
}
