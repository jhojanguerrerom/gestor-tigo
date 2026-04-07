import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Definimos cómo se ve cada "Serie" de datos (ej: Ingresos, Gestiones)
export interface ChartSeries {
  key: string;            // El nombre en el JSON (ej: 'income')
  label: string;          // El nombre que ve el usuario (ej: 'Ingresos')
  type: 'line' | 'bar';   // ¿Qué queremos dibujar?
  color: string;          // Color de la línea o barra
  yAxisId?: 'left' | 'right'; // En qué eje se escala
}

interface CustomChartProps {
  data: any[];
  series: ChartSeries[];
  xAxisKey: string;
  height?: number;
}

export default function CustomChart({ 
  data, 
  series, 
  xAxisKey, 
  height = 400 
}: CustomChartProps) {
  
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
          />
          
          {/* Eje Izquierdo (Siempre visible) */}
          <YAxis 
            yAxisId="left" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          
          {/* Eje Derecho (Se activa solo si alguna serie lo pide) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />

          <Tooltip 
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
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} 
              />
            ) : (
              <Bar 
                {...CommonProps} 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}