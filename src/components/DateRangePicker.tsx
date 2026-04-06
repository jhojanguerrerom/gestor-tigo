// src/pages/common/components/DateRangePicker.tsx
import { useState, useEffect } from 'react';
import { formatDate, getNextDay } from '@/utils/dateUtils'; // Importas tus utilerías

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  labelStart?: string; // Opcional para mayor flexibilidad
  labelEnd?: string;
}

export default function DateRangePicker({ 
  fromDate, 
  toDate, 
  onChange,
  labelStart = "Fecha inicio",
  labelEnd = "Fecha fin"
}: DateRangePickerProps) {
  // Sincronizamos el estado interno si las props cambian externamente
  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);

  useEffect(() => {
    setFrom(fromDate);
    setTo(toDate);
  }, [fromDate, toDate]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    if (newFrom >= to) {
      const newTo = formatDate(getNextDay(new Date(newFrom)));
      setTo(newTo);
      onChange(newFrom, newTo);
    } else {
      onChange(newFrom, to);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
    onChange(from, e.target.value);
  };

  const handleToday = () => {
    const today = new Date();
    const nextDay = getNextDay(today);
    const fromStr = formatDate(today);
    const toStr = formatDate(nextDay);
    onChange(fromStr, toStr);
  };

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <div className="date-input-group">
        <label className="form-label mb-1 small fw-bold">{labelStart}</label>
        <input type="date" className="form-control form-control-sm" value={from} onChange={handleFromChange} />
      </div>
      <div className="date-input-group">
        <label className="form-label mb-1 small fw-bold">{labelEnd}</label>
        <input type="date" className="form-control form-control-sm" value={to} onChange={handleToChange} />
      </div>
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleToday} title="Ir a hoy">
        Hoy
      </button>
    </div>
  );
}