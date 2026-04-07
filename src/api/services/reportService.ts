import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

// Interfaces exclusivas para el histórico
export interface HistoricalDataPoint {
  date: string;
  income: number;
  managed: number;
}

export interface HistoricalIncomeResponse {
  business_unit: string;
  total_income: number;
  total_managed: number;
  data: HistoricalDataPoint[];
}

export const reportService = {
  // Obtiene la gestión por horas del día actual.
  getManagedByHour: () => httpClient.get(ENDPOINTS.REPORTS.MANAGED_BY_HOUR),
  // Productividad diaria con filtros y soporte de AbortController
  getDailyProductivity: (fromDate: string, toDate: string, options?: { signal?: AbortSignal }) =>
    httpClient.get(
      `${ENDPOINTS.REPORTS.DAILY_PRODUCTIVITY}?date_from=${fromDate}&date_to=${toDate}`,
      options?.signal ? { signal: options.signal } : undefined
    ),

    getHistoricalIncome: (fromDate: string, toDate: string, businessUnit: string) => 
      httpClient.get<HistoricalIncomeResponse>(
        `${ENDPOINTS.REPORTS.HISTORICAL_INCOME}?date_from=${fromDate}&date_to=${toDate}&business_unit=${businessUnit}`
      ),
};