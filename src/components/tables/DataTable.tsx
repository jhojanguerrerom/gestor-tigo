import type { ReactNode } from 'react'
import { useBootstrapTooltips } from '../../hooks/useBootstrapTooltips'
import { useTableSearchPagination } from '../../hooks/useTableSearchPagination'

export interface DataTableColumn {
  header: ReactNode
  className?: string
}

interface DataTableSummaryMeta {
  startIndex: number
  endIndex: number
  total: number
}

interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn[]
  renderRow: (row: T) => ReactNode
  getSearchText: (row: T) => string
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  searchLabel?: string
  searchLabelId?: string
  pageSize?: number
  tableId?: string
  tableClassName?: string
  summaryText?: (meta: DataTableSummaryMeta) => ReactNode
  tooltipDeps?: unknown[]
  currentPage?: number
  setCurrentPage?: (page: number) => void
  total?: number
  totalPages?: number
  loading?: boolean
}

const defaultTableClassName = 'table table-hover align-middle mb-0 data-table text-center'

export default function DataTable<T>({
  rows,
  columns,
  renderRow,
  getSearchText,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Buscar',
  searchLabel = 'Buscar',
  searchLabelId = 'data-table-search-label',
  pageSize = 10,
  tableId,
  tableClassName = defaultTableClassName,
  summaryText,
  tooltipDeps = [],
  currentPage: controlledPage,
  setCurrentPage: setControlledPage,
  total: controlledTotal,
  totalPages: controlledTotalPages,
  loading = false,
}: DataTableProps<T>) {
  // Si se pasan props de paginación controlada, usarlas; si no, usar paginación local
  const isControlled =
    typeof controlledPage === 'number' &&
    typeof setControlledPage === 'function' &&
    typeof controlledTotal === 'number' &&
    typeof controlledTotalPages === 'number'

  const {
    filteredRows,
    pagedRows,
    totalPages: localTotalPages,
    safePage: localSafePage,
    startIndex: localStartIndex,
    endIndex: localEndIndex,
    currentPage: localCurrentPage,
    setCurrentPage: setLocalCurrentPage,
  } = useTableSearchPagination({ rows, searchQuery, pageSize, getSearchText })

  // Para tooltips, depende de la paginación activa
  useBootstrapTooltips([searchQuery, isControlled ? controlledPage : localCurrentPage, ...tooltipDeps])

  // Datos de paginación y filas a mostrar
  const page = isControlled ? controlledPage! : localCurrentPage
  const setPage = isControlled ? setControlledPage! : setLocalCurrentPage
  const total = isControlled ? controlledTotal! : filteredRows.length
  const totalPages = isControlled ? controlledTotalPages! : localTotalPages
  const safePage = isControlled ? controlledPage! : localSafePage
  const startIndex = isControlled ? (pageSize * (page - 1)) : localStartIndex
  const endIndex = isControlled ? Math.min(startIndex + rows.length, total) : localEndIndex
  const displayRows = isControlled ? rows : pagedRows

  const summary = summaryText
    ? summaryText({ startIndex, endIndex, total })
    : `Mostrando ${total === 0 ? 0 : startIndex + 1}–${endIndex} de ${total}`

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div className="input-group opacity-0" style={{ maxWidth: '420px' }}>
            <span className="input-group-text" id={searchLabelId}>
              {searchLabel}
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
              aria-describedby={searchLabelId}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
          <div className="text-body-secondary">{summary}</div>
        </div>

        <div className="table-responsive">
          <table className={tableClassName} id={tableId}>
            <thead className="table-light text-center">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} scope="col" className={column.className}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">Sin resultados</td>
                </tr>
              ) : (
                displayRows.map(renderRow)
              )}
            </tbody>
          </table>
        </div>

        <nav className="d-flex justify-content-end mt-3" aria-label="Table pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={loading}
              >
                Anterior
              </button>
            </li>
            {/* Paginador compacto */}
            {(() => {
              const pages = []
              const maxPagesToShow = 5
              const showLeftDots = safePage > 3
              const showRightDots = safePage < totalPages - 2
              let start = 1
              let end = totalPages
              if (totalPages > maxPagesToShow) {
                if (safePage <= 3) {
                  start = 1
                  end = maxPagesToShow
                } else if (safePage >= totalPages - 2) {
                  start = totalPages - maxPagesToShow + 1
                  end = totalPages
                } else {
                  start = safePage - 2
                  end = safePage + 2
                }
              }
              // Siempre mostrar la página 1
              pages.push(
                <li key={1} className={`page-item ${safePage === 1 ? 'active' : ''}`}>
                  <button className="page-link" type="button" onClick={() => setPage(1)} disabled={loading}>1</button>
                </li>
              )
              // Puntos suspensivos a la izquierda
              if (start > 2) {
                pages.push(
                  <li key="dots-left" className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                )
              }
              // Páginas centrales
              for (let i = start; i <= end; i++) {
                if (i === 1 || i === totalPages) continue
                pages.push(
                  <li key={i} className={`page-item ${safePage === i ? 'active' : ''}`}>
                    <button className="page-link" type="button" onClick={() => setPage(i)} disabled={loading}>{i}</button>
                  </li>
                )
              }
              // Puntos suspensivos a la derecha
              if (end < totalPages - 1) {
                pages.push(
                  <li key="dots-right" className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                )
              }
              // Siempre mostrar la última página si hay más de una
              if (totalPages > 1) {
                pages.push(
                  <li key={totalPages} className={`page-item ${safePage === totalPages ? 'active' : ''}`}>
                    <button className="page-link" type="button" onClick={() => setPage(totalPages)} disabled={loading}>{totalPages}</button>
                  </li>
                )
              }
              return pages
            })()}
            <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={loading}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
