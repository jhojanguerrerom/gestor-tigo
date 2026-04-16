import { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import DateRangePicker from '@/components/DateRangePicker';
import OfferClosedHistoryModal from './OfferClosedHistoryModal';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { formatDate, addDays, formatDateTime } from '@/utils/dateUtils';

interface RowType {
  hash_registro?: string;
  id?: string;
  oferta?: string;
  usuario_asignado_login?: string;
  usuario_asignado_nombre?: string;
  campos_dinamicos?: Record<string, any>;
}

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

export default function OffersManagedPage() {
  const today = useMemo(() => new Date(), []);

  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(addDays(today, 1)));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfertaId, setSelectedOfertaId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tableId = 'managedTable';
  const pageSize = 10;

  const fetchEnlistments = useCallback(
    async (page: number, limit: number, search: string) => {
      if (search) {
        return enlistmentService.searchByOferta(search, page, limit, 'CERRADO');
      }
      return enlistmentService.getEnlistments(page, limit, 'CERRADO', fromDate, toDate);
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

  const columns = useMemo(
    () => [
      { header: 'Asesor' },
      { header: 'Oferta' },
      { header: 'Concepto' },
      { header: 'Producto' },
      { header: 'UEN' },
      { header: 'Garantía' },
      { header: 'Detalles' },
      { header: 'Gestión' },
    ],
    []
  );

  const handleOpenModal = (ofertaId: string) => {
    setSelectedOfertaId(ofertaId);
    setIsModalOpen(true);
  };

  return (
    <section className="container py-4">
      {loading && <Loading fullScreen text="Cargando historial..." />}

      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Historial de ofertas cerradas</h1>
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

        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          forceNextDay={true} // <-- Solo aquí "forzará" el +1 día automáticamente
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
        renderRow={(row) => {
          const campos = row.campos_dinamicos || {};
          const oferta = row.oferta || campos.oferta || '-';
          const usuarioLogin = row.usuario_asignado_login || '-';
          const usuarioLoginName = row.usuario_asignado_nombre || '-';
          const rowKey = row.hash_registro || row.id || oferta;
          

          return (
            <Fragment key={rowKey}>
              <tr>
                <td>
                  <Icon name="user-call" size="lg" className="me-0" />
                  <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={usuarioLoginName}>
                    {usuarioLogin || '-'}
                  </span>
                </td>
                <td><CellText value={oferta} /></td>
                <td><CellText value={campos.concepto} /></td>
                <td><CellText value={campos.producto} /></td>
                <td><CellText value={campos.uen} /></td>
                <td>
                  <CellText value={campos.garantia === null ? '-' : campos.garantia ? 'Sí' : 'No'} />
                </td>
                <td className="text-center">
                  <Icon
                    name="plus"
                    size="lg"
                    className="cursor-pointer"
                    data-bs-toggle="collapse"
                    data-bs-target={`#details-${rowKey}`}
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
                <td colSpan={8}>
                  <div className="collapse" id={`details-${rowKey}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      {/* Tabla 1: Información Geográfica y Técnica */}
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr>
                              <th>Megagold</th>
                              <th>Regional</th>
                              <th>Documento</th>
                              <th>Tecnología</th>
                              <th>Departamento</th>
                              <th>Fecha creado</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><CellText value={campos.megagold} /></td>
                              <td><CellText value={campos.regional} /></td>
                              <td><CellText value={campos.documento} /></td>
                              <td><CellText value={campos.tecnologia} /></td>
                              <td><CellText value={campos.departamento} /></td>
                              <td><CellText value={formatDateTime(campos.fecha_creado)} /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Tabla 2: Estados y Tiempos */}
                      <div className="table-responsive mt-3">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr>
                              <th>Fecha estado</th>
                              <th>Tipo scoring</th>
                              <th>Tipo trabajo</th>
                              <th>Estado oferta</th>
                              <th>Fecha pendiente</th>
                              <th>Estado pendiente</th>
                              <th>Usuario pendiente</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><CellText value={formatDateTime(campos.fecha_estado)} /></td>
                              <td><CellText value={campos.tipo_scoring} /></td>
                              <td><CellText value={campos.tipo_trabajo} /></td>
                              <td><CellText value={campos.estado_oferta} /></td>
                              <td><CellText value={formatDateTime(campos.fecha_pendiente)} /></td>
                              <td><CellText value={campos.estado_pendiente} /></td>
                              <td><CellText value={campos.usuario_pendiente} /></td>
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
        onClose={() => setIsModalOpen(false)}
        ofertaId={selectedOfertaId || ''}
      />
    </section>
  );
}