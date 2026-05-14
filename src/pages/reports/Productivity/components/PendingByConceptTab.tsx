import { Fragment, useState, useMemo, useEffect, useCallback } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import DateRangePicker from '@/components/DateRangePicker';
import Loading from '@/components/Loading';
import { reportService, type PendingConceptData } from '@/api/services/reportService';
import { formatDate } from '@/utils/dateUtils';
import { useToast } from '@/context/ToastContext';
import { Icon } from '@/icons/Icon';
import { downloadExcel } from '@/utils/downloadExcel';

// Sub-componente extraído de HourlyTab para consistencia visual y tooltips
const CellText = ({ value, className = '', refreshKey }: { value?: string | number; className?: string; refreshKey?: number }) => {
  const displayValue = value === undefined || value === null || value === '' || value === 0 ? '-' : String(value);
  const showTooltip = displayValue !== '-';
  
  return (
    <span
      key={`${displayValue}-${refreshKey}`}
      className={`cell-text ${className}`}
      data-bs-toggle={showTooltip ? 'tooltip' : undefined}
      title={showTooltip ? displayValue : undefined}
    >
      {displayValue}
    </span>
  );
};

interface TabProps { 
  refreshKey: number; 
}

export default function PendingByConceptTab({ refreshKey }: TabProps) {
  const { warning, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PendingConceptData[]>([]);
  const [totals, setTotals] = useState<PendingConceptData | null>(null);
  const [dateField, setDateField] = useState<'CRM' | 'GESTOR'>('CRM');
  const [searchQuery, setSearchQuery] = useState('');

  const [dates, setDates] = useState({
    from: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: formatDate(new Date())
  });

  // Mapeo de nombres técnicos a nombres legibles
  const intervalLabels: Record<string, string> = {
    '0_30m': '0 a 30 m',
    '31_60m': '31 a 60 m',
    '1_2h': '1 a 2 horas',
    '3_5h': '3 a 5 h',
    '5_7h': '5 a 7 h',
    '7_12h': '7 a 12 h',
    '12_24h': '12 a 24 h',
    '24_48h': '24 a 48 h',
    'more_48h': 'Más de 48 h'
  };

  const intervals = useMemo(() => Object.keys(intervalLabels), []);

  const columns: DataTableColumn[] = useMemo(() => [
    { header: 'Concepto' },
    { header: 'Total' },
    ...intervals.map(inv => ({ header: intervalLabels[inv] }))
  ], [intervals]);

  const fetchData = useCallback(async () => {
    const diffDays = Math.ceil(Math.abs(new Date(dates.to).getTime() - new Date(dates.from).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      warning("El rango de fechas no puede superar los 90 días");
      return;
    }

    setLoading(true);
    try {
      const res = await reportService.getPendingByConcept(dates.from, dates.to, dateField);
      setData(res.data.data || []);
      setTotals(res.data.totals || null);
    } catch (err) {
      error("Error al cargar las ofertas pendientes");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dates, dateField, warning, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleExport = () => {
    if (!data.length) return;
    const exportData = data.map(item => {
      const row: any = { Concepto: item.concept, Total: item.total };
      intervals.forEach(inv => { row[intervalLabels[inv]] = item.intervals[inv] || 0; });
      return row;
    });
    downloadExcel(exportData, `Pendientes_Concepto_${dates.from}_${dates.to}`);
  };

  return (
    <div className="position-relative">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <label className="form-label">Fecha por:</label>
            <div className="btn-group shadow-sm border-2 d-block">
              <input type="radio" className="btn-check" id="filterCRM" checked={dateField === 'CRM'} onChange={() => setDateField('CRM')} />
              <label className="btn btn-outline-primary px-3" htmlFor="filterCRM">CRM</label>
              <input type="radio" className="btn-check" id="filterGestor" checked={dateField === 'GESTOR'} onChange={() => setDateField('GESTOR')} />
              <label className="btn btn-outline-primary px-3" htmlFor="filterGestor">Gestor</label>
            </div>
          </div>
          <DateRangePicker fromDate={dates.from} toDate={dates.to} onChange={(from, to) => setDates({ from, to })} />
        </div>

        <div className="d-flex justify-content-end mb-3 align-items-center">
        <Icon name="download" size="xl" className='me-2'/>
        <button 
          className="btn btn-outline-primary d-flex align-items-center shadow-sm"
          onClick={handleExport} 
          disabled={loading || !data.length}
        >
          <span>Exportar</span>
        </button>
      </div>
      </div>

      {loading && <Loading fullScreen text="Consultando pendientes..." />}

      <DataTable<PendingConceptData>
        rows={data}
        columns={columns}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row) => row.concept}
        tooltipDeps={[data, searchQuery, refreshKey]}
        pageSize={50}
        renderRow={(row) => {
          const index = data.indexOf(row);
          return (
            <Fragment key={`${row.concept}-${index}`}>
              <tr>
                <td data-bs-toggle="tooltip" title={row.concept}>{row.concept}</td>
                <td className="table-active text-center fw-bold text-primary">
                  <CellText value={row.total} refreshKey={refreshKey} />
                </td>
                {intervals.map(inv => (
                  <td key={inv} className="text-center">
                    <CellText 
                      value={row.intervals[inv]} 
                      refreshKey={refreshKey} 
                    />
                  </td>
                ))}
              </tr>

              {index === data.length - 1 && totals && (
                <tr className="table-light fw-bold">
                  <td className="ps-3">TOTAL</td>
                  <td className="text-center table-primary">
                    <CellText value={totals.total} refreshKey={refreshKey} />
                  </td>
                  {intervals.map(inv => (
                    <td key={`total-${inv}`} className="text-center">
                      <CellText value={totals.intervals[inv]} refreshKey={refreshKey} />
                    </td>
                  ))}
                </tr>
              )}
            </Fragment>
          );
        }}
      />
    </div>
  );
}