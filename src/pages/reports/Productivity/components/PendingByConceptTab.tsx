import { Fragment, useState, useMemo } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import DateRangePicker from '@/components/DateRangePicker';
import { formatDate } from '@/utils/dateUtils';

interface PendingData {
  concepto: string;
  total: number;
  intervals: Record<string, number>;
}

const MOCK_DATA: PendingData[] = [
  { concepto: 'Verificar disponibilidad', total: 10, intervals: { '0-30m': 2, '31-60m': 6, '1-2h': 0, '3-4h': 1, '13-24h': 1 } },
  { concepto: 'Reconfigurar por cobertura', total: 47, intervals: { '31-60m': 3, '1-2h': 5, '7-12h': 3, '13-24h': 34, '24-48h': 1, 'Mas 48h': 1 } },
  { concepto: 'Pumed', total: 2, intervals: { '31-60m': 1, '13-24h': 1 } },
  { concepto: 'Premisas extendidas', total: 14, intervals: { '31-60m': 1, '1-2h': 4, '7-12h': 2, '13-24h': 5, '24-48h': 1, 'Mas 48h': 1 } },
];

export default function PendingByConceptTab({ refreshKey }: { refreshKey: number }) {
  const [filterType, setFilterType] = useState<'CRM' | 'GESTOR'>('CRM');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dates, setDates] = useState({ 
    from: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: formatDate(new Date()) 
  });

  const intervals = ['0-30m', '31-60m', '1-2h', '3-4h', '5-6h', '7-12h', '13-24h', '24-48h', 'Mas 48h'];

  const columns: DataTableColumn[] = useMemo(() => [
    { header: 'Concepto' },
    { header: 'TOTAL' },
    ...intervals.map(inv => ({ header: inv }))
  ], []);

  const totals = useMemo(() => {
    const res: Record<string, number> = { grandTotal: 0 };
    intervals.forEach(inv => res[inv] = 0);
    MOCK_DATA.forEach(row => {
      res.grandTotal += row.total;
      intervals.forEach(inv => res[inv] += (row.intervals[inv] || 0));
    });
    return res;
  }, [refreshKey]);

  return (
    <div className="position-relative">
      {/* Contenedor de filtros con el estilo de radio buttons unificado[cite: 9, 12] */}
      <div className="d-flex flex-wrap justify-content-end align-items-center mb-4 gap-3">
        <div className="d-flex flex-column">
          <label className="form-label">Fecha por:</label>
          <div className="btn-group shadow-sm border-2">
            <input 
              type="radio" 
              className="btn-check" 
              id="filterCRM" 
              name="filterType"
              checked={filterType === 'CRM'} 
              onChange={() => setFilterType('CRM')} 
            />
            <label className="btn btn-outline-primary px-3" htmlFor="filterCRM">CRM</label>
            
            <input 
              type="radio" 
              className="btn-check" 
              id="filterGestor" 
              name="filterType"
              checked={filterType === 'GESTOR'} 
              onChange={() => setFilterType('GESTOR')} 
            />
            <label className="btn btn-outline-primary px-3" htmlFor="filterGestor">Gestor</label>
          </div>
        </div>

        <div>
           <DateRangePicker 
             fromDate={dates.from} 
             toDate={dates.to} 
             showToday={false}
             onChange={(from, to) => setDates({ from, to })} 
           />
        </div>
      </div>

      <DataTable<PendingData>
        rows={MOCK_DATA}
        columns={columns}
        tooltipDeps={[MOCK_DATA, searchQuery, refreshKey, dates]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row) => row.concepto}
        pageSize={50}
        renderRow={(row) => {
          const index = MOCK_DATA.indexOf(row);
          return (
            <Fragment key={`${row.concepto}-${refreshKey}`}>
              <tr>
                <td data-bs-toggle="tooltip" title={String(row.concepto)}>{row.concepto}</td>
                <td className="table-active text-center fw-bold text-primary" data-bs-toggle="tooltip" title={String(row.total)}>
                  {row.total}
                </td>
                {intervals.map(inv => (
                  <td key={inv} className="text-center text-muted" data-bs-toggle="tooltip" title={String(row.intervals[inv] || 0)}>
                    {row.intervals[inv] || 0}
                  </td>
                ))}
              </tr>

              {index === MOCK_DATA.length - 1 && (
                <tr className="table-light fw-bold">
                  <td className="ps-3">TOTALES</td>
                  <td className="text-center table-primary text-primary" data-bs-toggle="tooltip" title={String(totals.grandTotal)}>
                    {totals.grandTotal}
                  </td>
                  {intervals.map(inv => (
                    <td key={`total-${inv}`} className="text-center" data-bs-toggle="tooltip" title={String(totals[inv])}>
                      {totals[inv]}
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