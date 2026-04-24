import { useState, useEffect, useCallback, useMemo } from 'react';
import CustomChart, { type ChartSeries } from '@/components/CustomChart';
import { reportService, type HistoricalIncomeResponse } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import MonthPicker from '@/components/MonthPicker';
import { formatDate } from '@/utils/dateUtils';

interface TabProps { 
  refreshKey: number; 
}

export default function IncomeAndTransactionsMonthTab({ refreshKey }: TabProps) {
  const now = new Date();
  
  const [businessUnit, setBusinessUnit] = useState('ALL');
  const [conceptGroup, setConceptGroup] = useState('ALL'); // <-- Nuevo estado para el filtro
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  
  const [report, setReport] = useState<HistoricalIncomeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { fromDate, toDate } = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0); 
    return { fromDate: formatDate(firstDay), toDate: formatDate(lastDay) };
  }, [selectedMonth, selectedYear]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      // Ahora enviamos conceptGroup al servicio
      const res = await reportService.getHistoricalIncome(
        fromDate, 
        toDate, 
        businessUnit, 
        conceptGroup
      );
      setReport(res.data);
    } catch (err) {
      console.error("Error en tendencia mensual:", err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, businessUnit, conceptGroup]); // <-- Añadido a dependencias

  useEffect(() => { 
    fetchReport(); 
  }, [fetchReport, refreshKey]);

  const chartConfig: ChartSeries[] = [
    { key: 'income', label: 'Ingresos', type: 'line', color: '#001eb4', showColorInAxis: true },
    { key: 'managed', label: 'Gestiones', type: 'line', color: '#FFBE00', yAxisId: 'right', showColorInAxis: true }
  ];

  return (
    <div className="position-relative">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex gap-3 flex-wrap">
          <div>
            <label className="form-label">UEN</label>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '180px' }}
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
            >
              <option value="ALL">Todas las UEN</option>
              <option value="RESIDENCIAL">Hogares</option>
              <option value="EMPRESARIAL">Empresas</option>
            </select>
          </div>

          {/* NUEVO SELECT: Filtro de Conceptos */}
          <div>
            <label className="form-label">Agrupación de conceptos</label>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '200px' }}
              value={conceptGroup}
              onChange={(e) => setConceptGroup(e.target.value)}
            >
              <option value="ALL">Todos los conceptos</option>
              <option value="ASESOR">Gestión ASESOR</option>
              <option value="BOT">Gestión BOT</option>
            </select>
          </div>
        </div>

        <MonthPicker 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear} 
          onChange={(m, y) => { 
            setSelectedMonth(m); 
            setSelectedYear(y); 
          }} 
        />
      </div>

      {loading && <Loading fullScreen text="Cargando tendencia mensual..." />}
      
      {report && (
        <div className="card shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 font-dm-bold text-secondary">
              Tendencia de Ingresos y Gestiones <span className="text-muted fw-normal small">({fromDate} a {toDate})</span>
            </h5>
          </div>
          <div className="card-body p-4">
            <CustomChart 
              data={report.data} 
              xAxisKey="date" 
              series={chartConfig} 
              height={450} 
              onlyDays={true} 
            />
          </div>
        </div>
      )}
    </div>
  );
}