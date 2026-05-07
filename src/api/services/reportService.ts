import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

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

export interface ConceptDataPoint {
  date: string;
  concepts: Record<string, number>;
}

export interface IncomeByConceptResponse {
  month: string;
  concept_filter: string | null;
  total_income: number;
  available_concepts: string[];
  data: ConceptDataPoint[];
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
    httpClient.get(ENDPOINTS.REPORTS.DAILY_PRODUCTIVITY, {
      params: { date_from: fromDate, date_to: toDate },
      signal: options?.signal
    }),

  /**
   * Obtiene el histórico de ingresos vs gestiones (Vista de Tendencia Mensual).
   */
  getHistoricalIncome: (fromDate: string, toDate: string, businessUnit: string, conceptGroup: string) => 
    httpClient.get<HistoricalIncomeResponse>(ENDPOINTS.REPORTS.HISTORICAL_INCOME, {
      params: {
        date_from: fromDate, 
        date_to: toDate, 
        business_unit: businessUnit,
        concept_group: conceptGroup
      }
    }),

  /**
   * Obtiene el comparativo detallado diario (Vista Comparativa).
   * El parámetro dataType puede ser: 'INCOME', 'MANAGED' o 'BOTH'.
   */
  getDailyComparative: (fromDate: string, toDate: string, dataType: string, conceptGroup: string,) => 
    httpClient.get<DailyComparativeResponse>(ENDPOINTS.REPORTS.DAILY_INCOME_MANAGED, {
      params: { 
        date_from: fromDate, 
        date_to: toDate, 
        data_type: dataType,
        concept_group: conceptGroup
      }
    }),

  /**
   * Obtiene los ingresos distribuidos por hora para un día específico (Vista En Vivo).
   * @param date Fecha opcional en formato YYYY-MM-DD. Si no se envía, usa la fecha de Colombia.
   */
  getLiveIncome: (fromDate: string, toDate: string, conceptGroup: string) => {
    // El return es vital para que no devuelva 'void' o 'never'
    return httpClient.get<LiveIncomeResponse>(ENDPOINTS.REPORTS.INCOME_BY_HOUR, {
      params: { 
        date_from: fromDate, 
        date_to: toDate,
        concept_group: conceptGroup
      }
    });
  },

  getIncomeByConcept: (month: string, concept?: string, conceptGroup: string = 'ALL') => {
    return httpClient.get<IncomeByConceptResponse>(ENDPOINTS.REPORTS.INCOME_BY_CONCEPT, {
      params: { 
        month,
        concept: concept !== 'ALL' ? concept : undefined,
        concept_group: conceptGroup
      }
    });
  },
};