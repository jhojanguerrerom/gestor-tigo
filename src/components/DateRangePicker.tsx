// src/pages/common/components/DateRangePicker.tsx
import { formatDate, getNextDay } from '@/utils/dateUtils';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  labelStart?: string;
  labelEnd?: string;
  showToday?: boolean; // <-- Nueva prop opcional
}

export default function DateRangePicker({ 
  fromDate, 
  toDate, 
  onChange,
  labelStart = "Fecha inicio",
  labelEnd = "Fecha fin",
  showToday = true // <-- Valor por defecto
}: DateRangePickerProps) {

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
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
          className="form-control form-control-sm shadow-sm" 
          value={fromDate} 
          onChange={handleFromChange} 
        />
      </div>
      <div className="date-input-group">
        <label className="form-label mb-1 small fw-bold">{labelEnd}</label>
        <input 
          type="date" 
          className="form-control form-control-sm shadow-sm" 
          value={toDate} 
          onChange={handleToChange} 
        />
      </div>
      
      {/* Solo se muestra si showToday es true */}
      {showToday && (
        <button 
          type="button" 
          className="btn btn-outline-primary btn-sm px-3 shadow-sm" 
          onClick={handleToday} 
          title="Ir a hoy"
        >
          Hoy
        </button>
      )}
    </div>
  );
}