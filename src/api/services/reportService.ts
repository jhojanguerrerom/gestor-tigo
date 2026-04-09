import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import { formatDate } from '@/utils/dateUtils';

// --- Interfaces de Datos ---

export interface HistoricalDataPoint {
  date: string;
  income: number | null;
  managed: number;
}

export interface HistoricalIncomeResponse {
  business_unit: string;
  total_income: number;
  total_managed: number;
  data: HistoricalDataPoint[];
}

export interface DailyComparativeResponse {
  data_type: string;
  date_from: string;
  date_to: string;
  data: HistoricalDataPoint[];
}

export interface LiveIncomeData {
  hour: number;
  quantity: number;
}

export interface LiveIncomeResponse {
  date: string;
  business_unit: string;
  data: LiveIncomeData[];
}

// --- Servicio de Reportes ---

export const reportService = {
  /**
   * Obtiene la gestión por horas del día actual (General).
   */
  getManagedByHour: () => 
    httpClient.get(ENDPOINTS.REPORTS.MANAGED_BY_HOUR),

  /**
   * Obtiene la productividad diaria de asesores con soporte para cancelación.
   */
  getDailyProductivity: (fromDate: string, toDate: string, options?: { signal?: AbortSignal }) =>
    httpClient.get(
      `${ENDPOINTS.REPORTS.DAILY_PRODUCTIVITY}?date_from=${fromDate}&date_to=${toDate}`,
      options?.signal ? { signal: options.signal } : undefined
    ),

  /**
   * Obtiene el histórico de ingresos vs gestiones (Vista de Tendencia Mensual).
   */
  getHistoricalIncome: (fromDate: string, toDate: string, businessUnit: string) => 
    httpClient.get<HistoricalIncomeResponse>(
      `${ENDPOINTS.REPORTS.HISTORICAL_INCOME}?date_from=${fromDate}&date_to=${toDate}&business_unit=${businessUnit}`
    ),

  /**
   * Obtiene el comparativo detallado diario (Vista Comparativa).
   * El parámetro dataType puede ser: 'INCOME', 'MANAGED' o 'BOTH'.
   */
  getDailyComparative: (fromDate: string, toDate: string, businessUnit: string, dataType: string) => 
    httpClient.get<DailyComparativeResponse>(
      `${ENDPOINTS.REPORTS.DAILY_INCOME_MANAGED}?date_from=${fromDate}&date_to=${toDate}&business_unit=${businessUnit}&data_type=${dataType}`
    ),

  /**
   * Obtiene los ingresos distribuidos por hora para el día actual (Vista En Vivo).
   */
  getLiveIncome: () => {
    // Creamos una fecha formateada específicamente para la zona horaria de Bogotá
    const todayColombia = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    return httpClient.get<LiveIncomeResponse>(
      `${ENDPOINTS.REPORTS.INCOME_BY_HOUR}?date=${todayColombia}`
    );
  },
};