import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const reportService = {
  // Obtiene la gestión por horas del día actual.
  getManagedByHour: () => httpClient.get(ENDPOINTS.REPORTS.MANAGED_BY_HOUR),
  // Productividad diaria con filtros y soporte de AbortController
  getDailyProductivity: (fromDate: string, toDate: string, options?: { signal?: AbortSignal }) =>
    httpClient.get(
      `${ENDPOINTS.REPORTS.DAILY_PRODUCTIVITY}?date_from=${fromDate}&date_to=${toDate}`,
      options?.signal ? { signal: options.signal } : undefined
    ),
};