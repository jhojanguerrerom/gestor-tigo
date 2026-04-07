import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips';
import CustomChart from '@/components/CustomChart';
import type { ChartSeries } from '@/components/CustomChart';
import { reportService, type HistoricalIncomeResponse } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import { useToast } from '@/context/ToastContext';
import { Icon } from '@/icons/Icon';
import { formatDate } from '@/utils/dateUtils';
import MonthPicker from '@/components/MonthPicker'; // Importamos el nuevo

export default function HistoricalIncomePage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [businessUnit] = useState('RESIDENCIAL');

  const [report, setReport] = useState<HistoricalIncomeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { info, error } = useToast();
  useBootstrapTooltips([report, loading]);

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // 3. Cálculos de fechas dinámicos
  const { fromDate, toDate } = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0); 
    return { fromDate: formatDate(firstDay), toDate: formatDate(lastDay) };
  }, [selectedMonth, selectedYear]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getHistoricalIncome(fromDate, toDate, businessUnit);
      setReport(res.data);
      if (res.data.data.length === 0) {
        info(`No hay registros para ${months[selectedMonth]} ${selectedYear}`);
      }
    } catch (err) {
      error('Error al conectar con el servidor de reportes');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, businessUnit, info, error, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const chartConfig: ChartSeries[] = [
    { key: 'income', label: 'Ingresos', type: 'line', color: '#0d6efd', yAxisId: 'left' },
    { key: 'managed', label: 'Gestiones', type: 'line', color: '#ffc107', yAxisId: 'right' }
  ];

  return (
    <div className="container py-4">
      {loading && <Loading fullScreen text={`Analizando ${months[selectedMonth]} ${selectedYear}...`} />}

      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className='d-flex align-items-center'>
          <h1 className="h3 font-dm-bold mb-1">Ingresos vs Gestiones</h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2" 
            onClick={fetchReport} 
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar datos">
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <div>
            <label className="form-label">UEN</label>
            <select disabled className="form-select" value={businessUnit}>
              <option value="RESIDENCIAL">Hogares (Residencial)</option>
              <option value="TOTAL">Todas las UEN</option>
              <option value="B2B">Empresas (B2B)</option>
            </select>
          </div>

          {/* Reemplazamos los dos selects anteriores por el MonthPicker dinámico */}
          <MonthPicker 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onChange={(m, y) => {
              setSelectedMonth(m);
              setSelectedYear(y);
            }}
          />
        </div>
      </header>

      {report && (
        <div className="row g-4">
          <div className="col-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center p-2">
                <div className="flex-shrink-0 bg-primary-subtle p-2 rounded-3 me-2">
                  <Icon name="income" size="xl" className="text-primary" />
                </div>
                <div>
                  <small className="text-uppercase text-body-secondary fw-semibold ls-1">
                    Ingresos de {months[selectedMonth]} {selectedYear}
                  </small>
                  <h4 className="mb-0 font-dm-bold text-primary">
                    {report.total_income.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center p-2">
                <div className="flex-shrink-0 bg-warning-subtle p-2 rounded-3 me-2">
                  <Icon name="user-call" size="xl" className="text-warning" />
                </div>
                <div>
                  <small className="text-uppercase text-body-secondary fw-semibold ls-1">Total Gestiones</small>
                  <h4 className="mb-0 font-dm-bold text-warning">
                    {report.total_managed.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 font-dm-bold text-secondary">
                  Tendencia: <span className="text-primary">{months[selectedMonth]} {selectedYear}</span>
                </h5>
              </div>
              <div className="card-body">
                <CustomChart data={report.data} xAxisKey="date" series={chartConfig} height={450} onlyDays={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}