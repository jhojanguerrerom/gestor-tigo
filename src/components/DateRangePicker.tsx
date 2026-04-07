// src/pages/common/components/DateRangePicker.tsx
import { formatDate, getNextDay, addDays } from '@/utils/dateUtils';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  labelStart?: string;
  labelEnd?: string;
  showToday?: boolean; // <-- Nueva prop opcional
  forceNextDay?: boolean; // <-- Solo sumará el día si esta prop es TRUE
}

export default function DateRangePicker({ 
  fromDate, 
  toDate, 
  onChange,
  labelStart = "Fecha inicio",
  labelEnd = "Fecha fin",
  showToday = true,
  forceNextDay = false // <-- Por defecto NO fuerza nada
}: DateRangePickerProps) {

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;

    // Solo si forceNextDay es true y el inicio alcanza al fin, empujamos el fin
    if (forceNextDay && newFrom >= toDate) {
      const newTo = formatDate(getNextDay(new Date(newFrom)));
      onChange(newFrom, newTo);
    } else {
      // Comportamiento normal: solo validamos que no sea mayor (opcional)
      onChange(newFrom, newFrom > toDate ? newFrom : toDate);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;

    // Solo si forceNextDay es true y el fin retrocede al inicio, empujamos inicio
    if (forceNextDay && newTo <= fromDate) {
      const newFrom = formatDate(addDays(new Date(newTo), -1));
      onChange(newFrom, newTo);
    } else {
      // Comportamiento normal: solo validamos que el fin no sea menor al inicio
      onChange(newTo < fromDate ? newTo : fromDate, newTo);
    }
  };

  const handleToday = () => {
    const today = new Date();
    // Si forzamos día siguiente, hoy a mañana. Si no, hoy a hoy.
    const endValue = forceNextDay ? getNextDay(today) : today;
    onChange(formatDate(today), formatDate(endValue));
  };

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <div className="date-input-group">
        <label className="form-label">{labelStart}</label>
        <input 
          type="date" 
          className="form-control" 
          value={fromDate} 
          onChange={handleFromChange} 
        />
      </div>
      <div className="date-input-group">
        <label className="form-label">{labelEnd}</label>
        <input 
          type="date" 
          className="form-control" 
          value={toDate} 
          onChange={handleToChange} 
        />
      </div>
      {showToday && (
        <button type="button" className="btn btn-outline-primary" onClick={handleToday}>
          Hoy
        </button>
      )}
    </div>
  );
}