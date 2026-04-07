// src/pages/common/components/MonthPicker.tsx
import { useMemo } from 'react';

interface MonthPickerProps {
  selectedYear: number;
  selectedMonth: number;
  onChange: (month: number, year: number) => void;
  label?: string;
}

export default function MonthPicker({ 
  selectedYear, 
  selectedMonth, 
  onChange, 
  label = "Mes de consulta" 
}: MonthPickerProps) {
  
  // Generamos el valor en formato "YYYY-MM" para el input
  // Recordar que el mes en JS es 0-11, pero en HTML es 01-12
  const value = useMemo(() => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    return `${selectedYear}-${monthStr}`;
  }, [selectedYear, selectedMonth]);

  // Calculamos el mes actual como límite máximo (bloqueo automático)
  const maxDate = useMemo(() => {
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${m}`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // Formato "YYYY-MM"
    if (!val) return;
    
    const [year, month] = val.split('-').map(Number);
    onChange(month - 1, year); // Devolvemos el mes en formato JS (0-11)
  };

  return (
    <div className="month-picker-group">
      <label className="form-label">{label}</label>
      <input 
        type="month" 
        className="form-control"
        value={value}
        max={maxDate} // <-- Bloquea cualquier mes posterior al actual
        onChange={handleChange}
      />
    </div>
  );
}