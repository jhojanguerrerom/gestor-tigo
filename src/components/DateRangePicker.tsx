import { useState } from 'react';
import { formatDate, getNextDay, addDays } from '@/utils/dateUtils';
import { Icon } from '@/icons/Icon';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  labelStart?: string;
  labelEnd?: string;
  showToday?: boolean;
  forceNextDay?: boolean;
}

export default function DateRangePicker({ 
  fromDate, 
  toDate, 
  onChange,
  labelStart = "Fecha inicio",
  labelEnd = "Fecha fin",
  showToday = true,
  forceNextDay = false 
}: DateRangePickerProps) {

  // Estado interno para las fechas "borrador"
  const [internalFrom, setInternalFrom] = useState(fromDate);
  const [internalTo, setInternalTo] = useState(toDate);

  // Sincronizar si las props cambian externamente (ej. al presionar "Hoy")
  const updateInternal = (from: string, to: string) => {
    setInternalFrom(from);
    setInternalTo(to);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    if (forceNextDay && newFrom >= internalTo) {
      const newTo = formatDate(getNextDay(new Date(newFrom)));
      updateInternal(newFrom, newTo);
    } else {
      updateInternal(newFrom, newFrom > internalTo ? newFrom : internalTo);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;
    if (forceNextDay && newTo <= internalFrom) {
      const newFrom = formatDate(addDays(new Date(newTo), -1));
      updateInternal(newFrom, newTo);
    } else {
      updateInternal(newTo < internalFrom ? newTo : internalFrom, newTo);
    }
  };

  const handleToday = () => {
    const today = new Date();
    const endValue = forceNextDay ? getNextDay(today) : today;
    const start = formatDate(today);
    const end = formatDate(endValue);
    updateInternal(start, end);
    // Opcional: Si quieres que "Hoy" ejecute la búsqueda de inmediato
    onChange(start, end); 
  };

  // Esta función es la que realmente dispara la petición en el padre
  const handleSearch = () => {
    onChange(internalFrom, internalTo);
  };

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <div className="date-input-group">
        <label className="form-label">{labelStart}</label>
        <input 
          type="date" 
          className="form-control" 
          value={internalFrom} 
          onChange={handleFromChange} 
        />
      </div>
      <div className="date-input-group">
        <label className="form-label">{labelEnd}</label>
        <input 
          type="date" 
          className="form-control" 
          value={internalTo} 
          onChange={handleToChange} 
        />
      </div>
      
      {showToday && (
        <button type="button" className="btn btn-outline-primary" onClick={handleToday}>
          Hoy
        </button>
      )}

      {/* Botón de búsqueda con tus estilos de Icon */}
      <button 
        type="button" 
        className="btn btn-search-custom d-flex align-items-center" 
        onClick={handleSearch}
      >
        <Icon name="look-for" size="lg" />
      </button>
    </div>
  );
}
