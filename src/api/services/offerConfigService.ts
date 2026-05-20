import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';


export interface OfferConfig {
  id: string;
  nombre_config: string;
  campo_orden: string;
  direccion_orden: 'ASC' | 'DESC';
  filtro_conceptos_tipo: 'TODOS' | 'ESPECIFICOS';
  conceptos_seleccionados: string[];
  filtro_tipo_trabajo: 'TODOS' | 'NUEVO' | 'CAMBIO';
  filtro_regional_tipo: 'TODOS' | 'ESPECIFICAS';
  regionales_seleccionadas: string[];
  descripcion: string;
  is_active: boolean;
  updated_by: string;
  updated_at: string;
  configurado: boolean;
}

export interface OfferConfigRequest {
  nombre_config: string;
  descripcion: string;
  campo_orden: string;
  direccion_orden: 'ASC' | 'DESC';
  filtro_conceptos_tipo: 'TODOS' | 'ESPECIFICOS';
  conceptos_seleccionados: string[];
  filtro_tipo_trabajo: 'TODOS' | 'NUEVO' | 'CAMBIO';
  filtro_regional_tipo: 'TODOS' | 'ESPECIFICAS';
  regionales_seleccionadas: string[];
}

export interface Concepto {
  concepto: string;
  cantidad: number;
}

export interface OfferConfigHistoryChangeDetail {
  [key: string]: {
    old: string;
    new: string;
  };
}

export interface OfferConfigHistoryItem {
  id: string;
  accion: string;
  nombre_config: string;
  campo_orden: string;
  direccion_orden: string;
  filtro_conceptos_tipo: string;
  conceptos_seleccionados: string[];
  filtro_tipo_trabajo: string;
  filtro_regional_tipo: string;
  regionales_seleccionadas: string[];
  changed_by: string;
  changed_at: string;
  cambios_detalle: OfferConfigHistoryChangeDetail | null;
}


export const offerConfigService = {
  getConfig: () => httpClient.get<OfferConfig>(ENDPOINTS.OFFERS.CONFIG_AVANZADA),
  updateConfig: (data: OfferConfigRequest) => httpClient.put<OfferConfig>(ENDPOINTS.OFFERS.CONFIG_AVANZADA, data),
  getConceptosSistema: () => httpClient.get<Concepto[]>(ENDPOINTS.OFFERS.CONFIG_CONCEPTOS_SISTEMA),
  getConceptosDisponibles: () => httpClient.get<Concepto[]>(ENDPOINTS.OFFERS.CONFIG_CONCEPTOS_DISPONIBLES),
  getRegionalesDisponibles: () => httpClient.get<string[]>(ENDPOINTS.OFFERS.CONFIG_REGIONALES_DISPONIBLES),
};

export const offerConfigHistoryService = {
  getHistory: () => httpClient.get<OfferConfigHistoryItem[]>(ENDPOINTS.OFFERS.CONFIG_AVANZADA_HISTORY),
};
