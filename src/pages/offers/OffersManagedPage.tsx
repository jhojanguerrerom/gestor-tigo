import { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import DataTable from '@/components/tables/DataTable';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import OffersDate_RangePicker from './OffersDateRangePicker';
import OfferClosedHistoryModal from './OfferClosedHistoryModal';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';

interface RowType {
  hash_registro?: string;
  id?: string;
  oferta?: string;
  campos_dinamicos?: Record<string, any>;
}

/**
 * Tooltip solo si hay valor real
 */
const CellText = ({ value, className = '' }: { value?: string; className?: string }) => {
  const showTooltip = value && value !== '-';

  return (
    <span
      className={`cell-text ${className}`}
      data-bs-toggle={showTooltip ? 'tooltip' : undefined}
      title={showTooltip ? value : undefined}
    >
      {value || '-'}
    </span>
  );
};

/**
 * Formateador fecha Colombia
 */
const formatDateTime = (value?: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-CO');
};

export default function OffersManagedPage() {
  const today = new Date();

  const formatDate = (date: Date) =>
    date.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(
    formatDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    )
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfertaId, setSelectedOfertaId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tableId = 'managedTable';
  const pageSize = 10;

  const fetchEnlistments = useCallback(
    async (page: number, limit: number, search: string) => {
      if (search) {
        return enlistmentService.searchByOferta(
          search,
          page,
          limit,
          'CERRADO'
        );
      }

      return enlistmentService.getEnlistments(
        page,
        limit,
        'CERRADO',
        fromDate,
        toDate
      );
    },
    [fromDate, toDate]
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
    setCurrentPage(1);
  }, [fromDate, toDate, setCurrentPage]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  }, [setCurrentPage]);

  /**
   * Columnas actualizadas según requerimiento real
   */
  const columns = useMemo(
    () => [
      { header: 'Oferta' },
      { header: 'Concepto' },
      { header: 'Fecha creado' },
      { header: 'Fecha estado' },
      { header: 'Detalles' },
      { header: 'Gestión' },
    ],
    []
  );

  const handleOpenModal = (ofertaId: string) => {
    setSelectedOfertaId(ofertaId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOfertaId(null);
  };

  return (
    <section className="container py-4">
      {loading && (
        <Loading fullScreen text="Cargando historial..." />
      )}

      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">
            Historial de ofertas cerradas
          </h1>

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

        <OffersDate_RangePicker
          fromDate={fromDate}
          toDate={toDate}
          onChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
          }}
        />
      </header>

      <DataTable<RowType>
        rows={rows}
        columns={columns}
        tooltipDeps={[rows, searchQuery, currentPage, fromDate, toDate, refreshKey]}
        currentPage={currentPage ?? 1}
        setCurrentPage={setCurrentPage}
        total={total ?? 0}
        totalPages={totalPages ?? 1}
        loading={loading}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        searchPlaceholder="Buscar por oferta..."
        tableId={tableId}
        getSearchText={() => ''}
        renderRow={(row) => {
          const campos = row.campos_dinamicos || {};

          const oferta = row.oferta || campos.oferta || '-';
          const concepto = campos.concepto || '-';

          const fechaCreado = formatDateTime(campos.fecha_creado);
          const fechaEstado = formatDateTime(campos.fecha_estado);

          /**
           * Collapse
           */
          const municipio = campos.municipio || '-';
          const direccion = campos.direccion || '-';

          const paginacion =
            (campos.paginacion || '').trim() || '-';

          const coordenadas =
            campos.latitude && campos.longitude
              ? `${campos.latitude}, ${campos.longitude}`
              : '-';

          return (
            <Fragment key={row.hash_registro || row.id || oferta}>
              <tr>
                <td>
                  <CellText value={oferta} className="font-dm-bold" />
                </td>

                <td>
                  <CellText value={concepto} />
                </td>

                <td>
                  <CellText value={fechaCreado} />
                </td>

                <td>
                  <CellText value={fechaEstado} />
                </td>

                <td className="text-center">
                  <Icon
                    name="plus"
                    size="lg"
                    className="cursor-pointer"
                    data-bs-toggle="collapse"
                    data-bs-target={`#details-${row.hash_registro || row.id || oferta}`}
                  />
                </td>

                <td>
                  <button
                    className="badge rounded-pill text-bg-bluelight border-0 p-2"
                    onClick={() => handleOpenModal(oferta)}
                    type="button"
                  >
                    Detalle
                  </button>
                </td>
              </tr>

              <tr className="data-details-row">
                <td colSpan={6}>
                  <div
                    className="collapse"
                    id={`details-${row.hash_registro || row.id || oferta}`}
                    data-bs-parent={`#${tableId}`}
                  >
                    <div className="p-3 bg-light border-top">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr>
                              <th>Municipio</th>
                              <th>Dirección</th>
                              <th>Página</th>
                              <th>Coordenadas</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td>
                                <CellText value={municipio} />
                              </td>

                              <td>
                                <CellText value={direccion} />
                              </td>

                              <td>
                                <CellText value={paginacion} />
                              </td>

                              <td>
                                <CellText value={coordenadas} />
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
          );
        }}
      />

      <OfferClosedHistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ofertaId={selectedOfertaId || ''}
      />
    </section>
  );
}