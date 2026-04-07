import { useState, useEffect, useCallback } from 'react';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips';
import CustomChart from '@/components/CustomChart';
import type { ChartSeries } from '@/components/CustomChart';
import { reportService, type HistoricalIncomeResponse } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import DateRangePicker from '@/components/DateRangePicker';
import { useToast } from '@/context/ToastContext';
import { Icon } from '@/icons/Icon';

export default function HistoricalIncomePage() {
  // 1. Estados para Filtros
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-31');
  const [businessUnit, setBusinessUnit] = useState('RESIDENCIAL');

  // 2. Estado para los Datos
  const [report, setReport] = useState<HistoricalIncomeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { info, error, warning } = useToast(); // Añadimos warning para la validación
  useBootstrapTooltips([report, loading]);

  // Función auxiliar para validar el rango de 60 días
  const isRangeValid = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  }, []);

  // 3. Función para cargar datos
  const fetchReport = useCallback(async () => {
    // Validar antes de hacer la petición
    if (!isRangeValid(fromDate, toDate)) {
      warning('El rango de fechas no puede ser mayor a 60 días');
      return;
    }

    setLoading(true);
    try {
      const res = await reportService.getHistoricalIncome(fromDate, toDate, businessUnit);
      setReport(res.data);
      
      if (res.data.data.length === 0) {
        info('No se encontraron registros para el periodo seleccionado');
      }
    } catch (err) {
      error('Error al conectar con el servidor de reportes');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, businessUnit, info, error, warning, isRangeValid]);

  // 4. Efecto para disparar la carga cuando cambien los filtros
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // 5. Configuración de la Gráfica
  const chartConfig: ChartSeries[] = [
    { 
      key: 'income', 
      label: 'Ingresos', 
      type: 'line', 
      color: '#0d6efd', 
      yAxisId: 'left' 
    },
    { 
      key: 'managed', 
      label: 'Gestiones', 
      type: 'line', 
      color: '#ffc107', 
      yAxisId: 'right' 
    }
  ];

  return (
    <div className="container py-4">
      {loading && <Loading fullScreen text="Analizando datos del periodo..." />}

      <header className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className='d-flex align-items-center'>
          <h1 className="h3 font-dm-bold mb-1">Ingresos vs Gestiones</h1>
          <button 
            type="button"
            className="btn btn-link p-0 ms-2" 
            onClick={fetchReport}
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Actualizar datos"
          >
            <Icon name="refresh" size="xl" />
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <div className="s">
            <label className="form-label" htmlFor="TipoServicio">
              UEN
            </label>
            <select disabled
              className="form-select" 
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
            >
              <option value="TOTAL">Todas las UEN</option>
              <option value="RESIDENCIAL">Hogares (Residencial)</option>
              <option value="B2B">Empresas (B2B)</option>
            </select>
          </div>

          <DateRangePicker 
            fromDate={fromDate} 
            toDate={toDate} 
            onChange={(start, end) => {
              if (isRangeValid(start, end)) {
                setFromDate(start);
                setToDate(end);
              } else {
                warning('Seleccione un rango máximo de 60 días');
              }
            }} 
          />
        </div>
      </header>

      {report && (
        <div className="row g-4">
          <div className="col-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center p-2">
                <div className="flex-shrink-0 bg-primary-subtle p-2 rounded-3 me-3">
                  <Icon name="income" size="xl" className="text-primary" />
                </div>
                <div>
                  <small className="text-uppercase text-body-secondary fw-semibold ls-1">Ingresos Totales</small>
                  <h3 className="mb-0 font-dm-bold text-primary">
                    {report.total_income.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center p-2">
                <div className="flex-shrink-0 bg-warning-subtle p-2 rounded-3 me-3">
                  <Icon name="user-call" size="xl" className="text-warning" />
                </div>
                <div>
                  <small className="text-uppercase text-body-secondary fw-semibold ls-1">Total Gestiones</small>
                  <h3 className="mb-0 font-dm-bold text-warning">
                    {report.total_managed.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <div className="card shadow-sm border-0">
              {/* <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 font-dm-bold">Tendencia Temporal</h5>
              </div> */}
              <div className="card-body">
                <CustomChart 
                  data={report.data} 
                  xAxisKey="date" 
                  series={chartConfig} 
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="text-center py-5">
          <Icon name="search-off" size="xl" className="text-body-tertiary mb-3" />
          <p className="text-body-secondary">No hay datos disponibles para mostrar.</p>
        </div>
      )}
    </div>
  );
}