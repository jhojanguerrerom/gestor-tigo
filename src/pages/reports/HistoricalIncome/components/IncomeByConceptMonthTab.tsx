import { useState, useEffect, useCallback, useMemo } from 'react';
import CustomChart, { type ChartSeries } from '@/components/CustomChart';
import { reportService, type IncomeByConceptResponse } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import MonthPicker from '@/components/MonthPicker';

interface TabProps { 
  refreshKey: number; 
}

const CONCEPT_COLORS = [
  '#001EB4', '#FFBE00', '#00005A', '#44C8F5', '#9B9B9B',
  '#00148C', '#FFD700', '#000032', '#00A3E0', '#D1D3D4',
  '#0055FF', '#E6AC00', '#1A2A73', '#70D1F7', '#6D6E71'
];

const CustomTooltipGrid = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const items = payload.filter((p: any) => p.value > 0);
    return (
      <div className="bg-white shadow-lg border-0 rounded-3 p-2">
        <div className="border-bottom pb-1 mb-2 d-flex justify-content-between align-items-center">
          <span className="font-dm-bold text-dark">Día: {label}</span>
          <span className="text-primary font-dm-bold">
            Total: {items.reduce((acc: number, curr: any) => acc + curr.value, 0)}
          </span>
        </div>
        <div className="row g-1"> 
          {items.map((entry: any, index: number) => (
            <div key={index} className="col-12 d-flex align-items-center justify-content-between py-0">
              <div className="d-flex align-items-center overflow-hidden" style={{ maxWidth: '70%' }}>
                <span className="rounded-circle me-2 flex-shrink-0" style={{ width: '6px', height: '6px', backgroundColor: entry.color }} />
                <span className="text-muted text-truncate">{entry.name}</span>
              </div>
              <span className="font-dm-bold text-dark">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function IncomeByConceptMonthTab({ refreshKey }: TabProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  
  const [selectedConcept, setSelectedConcept] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  
  const [report, setReport] = useState<IncomeByConceptResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const monthParam = useMemo(() => {
    const m = (selectedMonth + 1).toString().padStart(2, '0');
    return `${selectedYear}-${m}`;
  }, [selectedMonth, selectedYear]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getIncomeByConcept(monthParam, selectedConcept, selectedGroup);
      setReport(res.data);
    } catch (err) {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [monthParam, selectedConcept, selectedGroup]);

  useEffect(() => { fetchReport(); }, [fetchReport, refreshKey]);

  const chartData = useMemo(() => {
    if (!report) return [];
    return report.data.map(item => ({ date: item.date, ...item.concepts }));
  }, [report]);

  const chartConfig = useMemo((): ChartSeries[] => {
    if (!report) return [];
    if (selectedConcept !== 'ALL') {
      return [{ key: selectedConcept, label: selectedConcept, type: 'bar', color: '#001EB4' }];
    }
    return report.available_concepts.map((concept, index) => ({
      key: concept,
      label: concept,
      type: 'bar',
      stack: 'total',
      color: CONCEPT_COLORS[index % CONCEPT_COLORS.length],
    }));
  }, [report, selectedConcept]);

  return (
    <div className="position-relative">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div className="d-flex align-items-center gap-3">
          
          {/* Selector de Agrupación */}
          <div>
            <label className="form-label">Agrupación de conceptos</label>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '210px' }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              disabled={selectedConcept !== 'ALL'}
            >
              <option value="ALL">Todos los conceptos</option>
              <option value="ANULAR">Anular</option>
              <option value="RECONFIGURACION">Reconfiguración</option>
              <option value="ASIGNACION">Asignación</option>
            </select>
            {selectedConcept !== 'ALL' && (
              <div className="form-text text-muted" style={{ fontSize: '0.7rem', width: '210px', position: 'absolute' }}>
                Deshabilitado por filtro de concepto
              </div>
            )}
          </div>

          {/* Selector de Concepto */}
          <div>
            <label className="form-label">Concepto específico</label>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '220px' }}
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              disabled={selectedGroup !== 'ALL'}
            >
              <option value="ALL">Todos los conceptos</option>
              {report?.available_concepts.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {selectedGroup !== 'ALL' && (
              <div className="form-text text-muted" style={{ fontSize: '0.7rem', width: '220px', position: 'absolute' }}>
                Deshabilitado por filtro de agrupación
              </div>
            )}
          </div>
        </div>

        <div>
          <MonthPicker 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={(m, y) => { 
              setSelectedMonth(m); 
              setSelectedYear(y); 
            }} 
          />
        </div>
      </div>

      {loading && <Loading fullScreen text="Sincronizando datos..." />}

      {report && (
        <div className="row g-4">
          <div className="col-12 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-0 py-3 pb-2">
                <h6 className="mb-0 font-dm-bold text-secondary text-uppercase small">Conceptos en Vista</h6>
              </div>
              <div className="card-body p-0 overflow-auto" style={{ maxHeight: '600px' }}>
                <div className="list-group list-group-flush">
                  {report.available_concepts.map((concept, index) => (
                    <div key={concept} className="list-group-item d-flex align-items-center border-0 px-3 py-1">
                      <span 
                        className="rounded-circle me-3 flex-shrink-0 shadow-sm" 
                        style={{ 
                          width: '12px', height: '12px', 
                          backgroundColor: CONCEPT_COLORS[index % CONCEPT_COLORS.length],
                          border: '2px solid #fff'
                        }} 
                      />
                      <span className="small text-secondary font-dm-medium text-truncate" title={concept}>
                        {concept}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-footer bg-light border-0 py-2 text-center">
                <span className="text-muted small">Total: </span>
                <span className="font-dm-bold text-primary">{report.total_income}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <CustomChart 
                  data={chartData} 
                  xAxisKey="date" 
                  series={chartConfig} 
                  height={550} 
                  onlyDays={true}
                  hideLegend={true}
                  tooltipProps={{ content: <CustomTooltipGrid /> }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}