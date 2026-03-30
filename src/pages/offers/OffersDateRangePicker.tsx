import { useState } from 'react';

interface OffersDateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getNextDay(date: Date) {
  return addDays(date, 1);
}

function getFirstDayNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export default function OffersDateRangePicker({ fromDate, toDate, onChange }: OffersDateRangePickerProps) {
  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
    // Si la nueva fecha de inicio es después o igual a la de fin, ajusta la de fin
    if (e.target.value >= to) {
      const newTo = formatDate(getNextDay(new Date(e.target.value)));
      setTo(newTo);
      onChange(e.target.value, newTo);
    } else {
      onChange(e.target.value, to);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
    onChange(from, e.target.value);
  };

  const handleToday = () => {
    const today = new Date();
    let nextDay = getNextDay(today);
    // Si es el último día del mes, ir al primer día del mes siguiente
    if (today.getDate() === new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) {
      nextDay = getFirstDayNextMonth(today);
    }
    const fromStr = formatDate(today);
    const toStr = formatDate(nextDay);
    setFrom(fromStr);
    setTo(toStr);
    onChange(fromStr, toStr);
  };

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <div>
        <label className="form-label mb-1">Fecha inicio</label>
        <input type="date" className="form-control" value={from} onChange={handleFromChange} max={to} />
      </div>
      <div>
        <label className="form-label mb-1">Fecha fin</label>
        <input type="date" className="form-control" value={to} onChange={handleToChange} min={from} />
      </div>
      <button type="button" className="button button-blue" onClick={handleToday} title="Ir a hoy">
        Hoy
      </button>
    </div>
  );
}
