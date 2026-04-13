import { useState, useEffect, useCallback } from 'react';
import CustomChart from '@/components/CustomChart';
import { reportService, type LiveIncomeData } from '@/api/services/reportService';
import Loading from '@/components/Loading';

interface TabProps { 
  refreshKey: number; 
}

export default function IncomeDayTab({ refreshKey }: TabProps) {
  const [data, setData] = useState<LiveIncomeData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      // Llamada directa al servicio sin parámetros de UEN
      const res = await reportService.getLiveIncome();
      setData(res.data?.data || []);
    } catch (err) {
      console.error("Error cargando datos en vivo:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías ya que no hay filtros externos

  useEffect(() => { 
    fetchReport(); 
  }, [fetchReport, refreshKey]);

  return (
    <div className="position-relative">
      {/* Eliminamos la sección de filtros por completo */}
      {loading && <Loading fullScreen text="Cargando ingresos del día..." />}
      
      <div className="card shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 font-dm-bold text-secondary">
            Ingresos por hora
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