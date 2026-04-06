// src/utils/dateUtils.ts

/** Convierte un objeto Date a string YYYY-MM-DD para inputs tipo date */
export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

/** Suma N días a una fecha dada */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** * Obtiene el día siguiente de una fecha*/
export const getNextDay = (date: Date): Date => {
  return addDays(date, 1);
};

/** Formatea una fecha y hora para visualización (DD/MM/YYYY, HH:MM:SS) */
export const formatDateTime = (value?: string): string => {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-CO');
};

/** Obtiene el primer día del mes siguiente */
export const getFirstDayNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};