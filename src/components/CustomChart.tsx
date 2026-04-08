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

export interface ChartSeries {
  key: string;
  label: string;
  type: 'line' | 'bar';
  color: string;
  yAxisId?: 'left' | 'right';
  showColorInAxis?: boolean;
}

interface CustomChartProps {
  data: any[];
  series: ChartSeries[];
  xAxisKey: string;
  height?: number;
  onlyDays?: boolean;
  isHourly?: boolean; // Nueva prop para activar formato AM/PM
}

export default function CustomChart({ 
  data, 
  series, 
  xAxisKey, 
  height = 400,
  onlyDays = false,
  isHourly = false 
}: CustomChartProps) {
  
  /**
   * Formateador dinámico para el eje X
   */
  const formatXAxis = (tickItem: any) => {
    // Si es una gráfica por horas (0 a 23)
    if (isHourly) {
      const hour = Number(tickItem);
      if (isNaN(hour)) return tickItem;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12} ${ampm}`;
    }

    // Si solo queremos mostrar el número del día (para fechas YYYY-MM-DD)
    if (onlyDays && tickItem && typeof tickItem === 'string') {
      const parts = tickItem.split('-');
      return parts.length === 3 ? String(Number(parts[2])) : tickItem;
    }

    return tickItem;
  };

  // Buscamos dinámicamente si algún eje debe tener un color específico basado en las series
  const leftAxisColor = series.find(s => (s.yAxisId === 'left' || !s.yAxisId) && s.showColorInAxis)?.color || '#6c757d';
  const rightAxisColor = series.find(s => s.yAxisId === 'right' && s.showColorInAxis)?.color || '#6c757d';

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
            tickFormatter={formatXAxis}
            interval={isHourly ? 'preserveStartEnd' : 0}
          />
          
          <YAxis 
            yAxisId="left" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: leftAxisColor }}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: rightAxisColor }}
          />

          <Tooltip 
            labelFormatter={(value) => isHourly ? `Hora: ${formatXAxis(value)}` : `Fecha: ${value}`}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }} 
          />
          
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} 
          />

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
              <Bar 
                {...CommonProps} 
                radius={[4, 4, 0, 0]} 
                barSize={isHourly ? 30 : 20} // Un poco más ancha si es por horas
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}