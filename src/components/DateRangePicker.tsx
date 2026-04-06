// src/pages/common/components/DateRangePicker.tsx
import { formatDate, getNextDay } from '@/utils/dateUtils';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  labelStart?: string;
  labelEnd?: string;
}

export default function DateRangePicker({ 
  fromDate, 
  toDate, 
  onChange,
  labelStart = "Fecha inicio",
  labelEnd = "Fecha fin"
}: DateRangePickerProps) {

  // Eliminamos los useState y useEffect internos. 
  // Ahora el componente lee directamente de las props.

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    // Si la nueva fecha de inicio es mayor o igual a la de fin, 
    // sugerimos un día después para evitar rangos inválidos antes de la validación del padre.
    if (newFrom >= toDate) {
      const newTo = formatDate(getNextDay(new Date(newFrom)));
      onChange(newFrom, newTo);
    } else {
      onChange(newFrom, toDate);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(fromDate, e.target.value);
  };

  const handleToday = () => {
    const today = new Date();
    const nextDay = getNextDay(today);
    onChange(formatDate(today), formatDate(nextDay));
  };

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <div className="date-input-group">
        <label className="form-label mb-1 small fw-bold">{labelStart}</label>
        <input 
          type="date" 
          className="form-control form-control-sm" 
          value={fromDate} // Fuente de verdad única
          onChange={handleFromChange} 
        />
      </div>
      <div className="date-input-group">
        <label className="form-label mb-1 small fw-bold">{labelEnd}</label>
        <input 
          type="date" 
          className="form-control form-control-sm" 
          value={toDate} // Fuente de verdad única
          onChange={handleToChange} 
        />
      </div>
      <button 
        type="button" 
        className="btn btn-outline-primary btn-sm px-3" 
        onClick={handleToday} 
        title="Ir a hoy"
      >
        Hoy
      </button>
    </div>
  );
}