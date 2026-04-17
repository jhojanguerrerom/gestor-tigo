import { useState, useEffect, useCallback } from 'react';
import CustomChart from '@/components/CustomChart';
import { reportService, type LiveIncomeData } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils/dateUtils';
import { Icon } from '@/icons/Icon';

interface TabProps { 
  refreshKey: number; 
}

export default function IncomeDayTab({ refreshKey }: TabProps) {
  const [data, setData] = useState<LiveIncomeData[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 1. inputDate: Controla lo que el usuario ve en el input (el "borrador")
  const [inputDate, setInputDate] = useState(formatDate(new Date()));
  
  // 2. filterDate: Es la fecha real que se envía a la API
  const [filterDate, setFilterDate] = useState(inputDate);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      // Usamos filterDate para la petición
      const res = await reportService.getLiveIncome(filterDate);
      setData(res.data?.data || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filterDate]); // Solo se recrea cuando filterDate cambia

  // Carga inicial y por refreshKey
  useEffect(() => { 
    fetchReport(); 
  }, [fetchReport, refreshKey]);

  // Ejecuta la búsqueda al dar click en la lupa
  const handleSearch = () => {
    setFilterDate(inputDate);
  };

  const handleToday = () => {
    const today = formatDate(new Date());
    setInputDate(today);
    setFilterDate(today); // "Hoy" suele ser una acción inmediata
  };

  return (
    <div className="position-relative">
      {loading && <Loading fullScreen text="Cargando ingresos del día..." />}
      
      <div className="d-flex align-items-end gap-2 flex-wrap mb-4 justify-content-end">
        <div className="date-input-group">
          <label className="form-label">Ver ingresos del día:</label>
          <input 
            type="date" 
            className="form-control" 
            value={inputDate} 
            onChange={(e) => setInputDate(e.target.value)} // Cambio reactivo solo visual
          />
        </div>
        
        <button type="button" className="btn btn-outline-primary" onClick={handleToday}>
          Hoy
        </button>

        <button 
          type="button" 
          className="btn btn-search-custom d-flex align-items-center" 
          onClick={handleSearch} // Único punto que dispara la búsqueda por usuario
        >
          <Icon name="look-for" size="lg" />
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 font-dm-bold text-secondary">
            Ingresos por hora: {filterDate}
          </h5>
        </div>
        <div className="card-body p-4">
          <CustomChart 
            data={data} 
            xAxisKey="hour" 
            isHourly={true}
            series={[
              { 
                key: 'quantity', 
                label: 'Ingresos', 
                type: 'bar', 
                color: '#001eb4',
                showColorInAxis: true
              }
            ]} 
            height={450} 
          />
        </div>
      </div>
    </div>
  );
}