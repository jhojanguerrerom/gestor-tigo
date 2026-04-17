import { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import DateRangePicker from '@/components/DateRangePicker';
import BaseModal from '@/components/BaseModal';
import OfferClosedHistoryModal from './OfferClosedHistoryModal';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { formatDate, addDays, formatDateTime } from '@/utils/dateUtils';
import { downloadCSV } from '@/utils/csvUtils';
import { useToast } from '@/context/ToastContext';

interface RowType {
  hash_registro?: string;
  id?: string;
  oferta?: string;
  usuario_asignado_login?: string;
  usuario_asignado_nombre?: string;
  campos_dinamicos?: Record<string, any>;
}

const OPCIONES_REPORTE = [
  { id: 'oferta', label: 'Oferta' },
  { id: 'usuario_asignado_login', label: 'Login Asesor' },
  { id: 'usuario_asignado_nombre', label: 'Nombre Asesor' },
  { id: 'concepto', label: 'Concepto' },
  { id: 'producto', label: 'Producto' },
  { id: 'uen', label: 'UEN' },
  { id: 'regional', label: 'Regional' },
  { id: 'documento', label: 'Documento' },
  { id: 'pedido_id', label: 'Pedido ID' },
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'garantia', label: 'Garantía' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'tipo_scoring', label: 'Tipo Scoring' },
  { id: 'tipo_trabajo', label: 'Tipo Trabajo' },
  { id: 'fecha_creado', label: 'Fecha Creación' }
];

const CellText = ({ value, className = '' }: { value?: string; className?: string }) => {
  const showTooltip = value && value !== '-';
  return (
    <span className={`cell-text ${className}`} data-bs-toggle={showTooltip ? 'tooltip' : undefined} title={showTooltip ? value : undefined}>
      {value || '-'}
    </span>
  );
};

export default function OffersManagedPage() {
  const today = useMemo(() => new Date(), []);
  const { success, error } = useToast();

  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(addDays(today, 1)));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfertaId, setSelectedOfertaId] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados Exportación
  const [isExporting, setIsExporting] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [camposSeleccionados, setCamposSeleccionados] = useState<string[]>(OPCIONES_REPORTE.map(o => o.id));

  const tableId = 'managedTable';
  const pageSize = 10;

  const { data: rows, total, totalPages, currentPage, setCurrentPage, loading } = useEnlistmentTable({
    pageSize,
    searchQuery,
    refreshKey,
    fetchFn: useCallback(async (page: number, limit: number, search: string) => {
      return search 
        ? enlistmentService.searchByOferta(search, page, limit, 'CERRADO')
        : enlistmentService.getEnlistments(page, limit, 'CERRADO', fromDate, toDate);
    }, [fromDate, toDate])
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate, setCurrentPage]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  }, [setCurrentPage]);

  const handleToggleCampo = (id: string) => {
    setCamposSeleccionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const ejecutarExportacion = async () => {
    if (!total) return;
    if (camposSeleccionados.length === 0) {
      error('Selecciona al menos un campo para el reporte');
      return;
    }
    setIsExporting(true);
    setIsConfigModalOpen(false);
    try {
      const MAX_LIMIT = 1000;
      const allRecords: any[] = [];
      const callsNeeded = Math.ceil(total / MAX_LIMIT);
      for (let i = 1; i <= callsNeeded; i++) {
        const response = await enlistmentService.getEnlistments(i, MAX_LIMIT, 'CERRADO', fromDate, toDate);
        allRecords.push(...(response.data?.data || []));
      }
      const dataFinal = allRecords.map((row: any) => {
        const c = row.campos_dinamicos || {};
        const filtrado: any = {};
        camposSeleccionados.forEach(id => {
          const config = OPCIONES_REPORTE.find(o => o.id === id);
          if (!config) return;
          let valor = row[id] || c[id] || '';
          if (id === 'garantia') valor = c.garantia ? 'Sí' : 'No';
          if (id === 'fecha_creado') valor = formatDateTime(c.fecha_creado);
          filtrado[config.label] = valor || '-';
        });
        return filtrado;
      });
      downloadCSV(dataFinal, `Reporte_Cerradas_${fromDate}`);
      success('Descarga iniciada correctamente');
    } catch (err) {
      error('Error al generar el reporte');
    } finally {
      setIsExporting(false);
    }
  };

  const columns = useMemo(() => [
    { header: 'Asesor' }, { header: 'Oferta' }, { header: 'Concepto' }, 
    { header: 'Producto' }, { header: 'UEN' }, { header: 'Garantía' }, 
    { header: 'Detalles' }, { header: 'Gestión' }
  ], []);

  return (
    <section className="container py-4">
      {(loading || isExporting) && (
        <Loading fullScreen text={isExporting ? "Generando Excel..." : "Cargando historial..."} />
      )}

      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Historial de ofertas cerradas</h1>
          <button type="button" className="btn btn-link p-0 ms-2" onClick={handleRefresh} data-bs-toggle="tooltip" data-bs-placement="right" title="Actualizar tabla">
            <Icon name="refresh" size="xl" />
          </button>
        </div>
        <DateRangePicker fromDate={fromDate} toDate={toDate} forceNextDay={true} onChange={(f, t) => { setFromDate(f); setToDate(t); }} />
      </header>

      <div className="d-flex justify-content-end mb-3 align-items-center">
        <Icon name="download" size="xl" className='me-2'/>
        <button className="btn btn-outline-primary d-flex align-items-center shadow-sm" onClick={() => setIsConfigModalOpen(true)} disabled={total === 0 || isExporting}>
          <span>Exportar</span>
        </button>
      </div>

      <BaseModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} title="Personalizar columnas del reporte" size="modal-lg">
        <p className="text-muted small mb-3">Marque los campos que desee incluir en el archivo CSV:</p>
        <div className="row g-2 mb-4">
          {OPCIONES_REPORTE.map(opcion => (
            <div key={opcion.id} className="col-md-4">
              <div className={`form-check p-2 border rounded cursor-pointer ${camposSeleccionados.includes(opcion.id) ? 'bg-light border-primary' : ''}`} onClick={() => handleToggleCampo(opcion.id)}>
                <input className="form-check-input ms-1" type="checkbox" checked={camposSeleccionados.includes(opcion.id)} readOnly />
                <label className="form-check-label small ms-2 cursor-pointer">{opcion.label}</label>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end gap-2 border-top pt-3">
          <button className="button button-gray" onClick={() => setIsConfigModalOpen(false)}>Cancelar</button>
          <button className="button button-blue" onClick={ejecutarExportacion}>Generar Reporte ({camposSeleccionados.length} campos)</button>
        </div>
      </BaseModal>

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
          const rowKey = row.hash_registro || row.id || oferta;
          return (
            <Fragment key={rowKey}>
              <tr>
                <td><span className="badge text-bg-blue" data-bs-toggle="tooltip" title={row.usuario_asignado_nombre}>{row.usuario_asignado_login || '-'}</span></td>
                <td><CellText value={oferta} /></td>
                <td><CellText value={campos.concepto} /></td>
                <td><CellText value={campos.producto} /></td>
                <td><CellText value={campos.uen} /></td>
                <td><CellText value={campos.garantia === null ? '-' : campos.garantia ? 'Sí' : 'No'} /></td>
                <td className="text-center"><Icon name="plus" size="lg" className="cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#details-${rowKey}`} /></td>
                <td><button className="badge rounded-pill text-bg-bluelight border-0 p-2" onClick={() => { setSelectedOfertaId(oferta); setIsHistoryModalOpen(true); }}>Detalle</button></td>
              </tr>
              <tr className="data-details-row">
                <td colSpan={8}>
                  <div className="collapse" id={`details-${rowKey}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr><th>Megagold</th><th>Regional</th><th>Documento</th><th>Tecnología</th><th>Departamento</th><th>Fecha creado</th></tr>
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
                      <div className="table-responsive mt-3">
                        <table className="table table-sm table-bordered mb-0 bg-white text-center">
                          <thead className="table-secondary">
                            <tr><th>Fecha estado</th><th>Tipo scoring</th><th>Tipo trabajo</th><th>Estado oferta</th><th>Fecha pendiente</th><th>Estado pendiente</th></tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><CellText value={formatDateTime(campos.fecha_estado)} /></td>
                              <td><CellText value={campos.tipo_scoring} /></td>
                              <td><CellText value={campos.tipo_trabajo} /></td>
                              <td><CellText value={campos.estado_oferta} /></td>
                              <td><CellText value={formatDateTime(campos.fecha_pendiente)} /></td>
                              <td><CellText value={campos.estado_pendiente} /></td>
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

      <OfferClosedHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} ofertaId={selectedOfertaId || ''} />
    </section>
  );
}