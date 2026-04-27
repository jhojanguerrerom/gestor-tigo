// src/api/services/offerService.ts
import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export interface PauseSettings {
  tiempo_minimo_pausa_minutos: number;
  max_ofertas_pausadas_por_asesor: number;
  updated_by?: string;
  updated_at?: string;
}

export const PauseService = {
  // ... tus otros métodos existentes
  
  getPauseSettings: () => 
    httpClient.get<PauseSettings>(ENDPOINTS.OFFERS.PAUSE_CONFIG),
    
  updatePauseSettings: (data: PauseSettings) => 
    httpClient.put(ENDPOINTS.OFFERS.PAUSE_CONFIG, data),
};