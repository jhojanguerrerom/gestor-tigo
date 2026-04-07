import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Definimos cómo se ve cada "Serie" de datos (ej: Ingresos, Gestiones)
export interface ChartSeries {
  key: string;
  label: string;
  type: 'line' | 'bar';
  color: string;
  yAxisId?: 'left' | 'right';
}

interface CustomChartProps {
  data: any[];
  series: ChartSeries[];
  xAxisKey: string;
  height?: number;
  onlyDays?: boolean; // <-- Nueva prop
}

export default function CustomChart({ 
  data, 
  series, 
  xAxisKey, 
  height = 400,
  onlyDays = false 
}: CustomChartProps) {
  
  // Función para transformar "2026-04-07" -> "7"
  const formatXAxis = (tickItem: string) => {
    if (!onlyDays || !tickItem) return tickItem;
    // Dividimos por '-' y tomamos el último elemento (el día)
    // Convertimos a Number y de nuevo a String para quitar ceros a la izquierda (07 -> 7)
    const parts = tickItem.split('-');
    return parts.length === 3 ? String(Number(parts[2])) : tickItem;
  };

  return (
    <div className="card shadow-sm border-0 p-3" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          
          <XAxis 
            dataKey={xAxisKey} 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#6c757d' }}
            tickFormatter={formatXAxis} // <-- Aplicamos el formateador aquí
            interval={0} // Muestra todos los números si hay espacio
          />
          
          <YAxis yAxisId="left" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" fontSize={11} tickLine={false} axisLine={false} />

          <Tooltip 
            labelFormatter={(value) => `Fecha: ${value}`} // El tooltip sigue mostrando la fecha completa
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />

          {series.map((s) => {
            const CommonProps = {
              key: s.key,
              yAxisId: s.yAxisId || 'left',
              dataKey: s.key,
              name: s.label,
              stroke: s.color,
              fill: s.color,
            };

            return s.type === 'line' ? (
              <Line 
                {...CommonProps} 
                type="monotone" 
                strokeWidth={3} 
                dot={data.length === 1 ? { r: 6, strokeWidth: 2, fill: s.color, stroke: '#fff' } : { r: 4, strokeWidth: 2, stroke: '#fff' }} 
              />
            ) : (
              <Bar {...CommonProps} radius={[4, 4, 0, 0]} barSize={20} />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}