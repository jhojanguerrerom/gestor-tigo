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
}: DataTableProps<T>) {
  const {
    filteredRows,
    pagedRows,
    totalPages,
    safePage,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
  } = useTableSearchPagination({ rows, searchQuery, pageSize, getSearchText })

  useBootstrapTooltips([searchQuery, currentPage, ...tooltipDeps])

  const summary = summaryText
    ? summaryText({ startIndex, endIndex, total: filteredRows.length })
    : `Mostrando ${filteredRows.length === 0 ? 0 : startIndex + 1}–${endIndex} de ${filteredRows.length}`

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div className="input-group" style={{ maxWidth: '420px' }}>
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
            <tbody>{pagedRows.map((row) => renderRow(row))}</tbody>
          </table>
        </div>

        <nav className="d-flex justify-content-end mt-3" aria-label="Table pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Anterior
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              return (
                <li key={pageNumber} className={`page-item ${pageNumber === safePage ? 'active' : ''}`}>
                  <button className="page-link" type="button" onClick={() => setCurrentPage(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              )
            })}
            <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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
