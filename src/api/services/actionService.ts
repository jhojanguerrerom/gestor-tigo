import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const actionService = {
  // 1. Obtener todo (GET)
  getActionsWithSubactions: () => 
    httpClient.get(ENDPOINTS.ACTIONS.CATALOG),
  
  // 2. Crear Acción Padre (POST)
  createAction: (data: { nombre: string; descripcion: string; orden: number }) => 
    httpClient.post(ENDPOINTS.ACTIONS.CATALOG, data),
    
  // 3. Crear Subacción Hija (POST)
  createSubaction: (data: { accion_id: string; nombre: string; orden: number }) => 
    httpClient.post(ENDPOINTS.ACTIONS.SUBACTIONS, data),
};