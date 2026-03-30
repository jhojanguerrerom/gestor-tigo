import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const enlistmentService = {
  /**
   * Obtiene enlistamientos generales. 
   * Ahora soporta el filtro de estado (ej: 'ABIERTO')
   */
  getEnlistments: (page = 1, limit = 10, state?: string) => {
    const url = new URL(`${window.location.origin}${ENDPOINTS.ENLISTMENT.BASE}`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (state) url.searchParams.append('offer_state', state);
    
    return httpClient.get(`${ENDPOINTS.ENLISTMENT.BASE}${url.search}`);
  },

  /**
   * Obtiene las ofertas que ya están siendo gestionadas por asesores.
   */
  getInTransit: (page = 1, limit = 10) =>
    httpClient.get(`${ENDPOINTS.OFFERS.IN_TRANSIT}?page=${page}&limit=${limit}`),
    
  /**
   * Búsqueda por campo específico (oferta) filtrando por estado opcionalmente.
   */
  searchByOferta: (oferta: string, page = 1, limit = 10, state?: string) => {
    let url = `${ENDPOINTS.ENLISTMENT.SEARCH}?field=oferta&value=${encodeURIComponent(oferta)}&page=${page}&limit=${limit}`;
    
    // Si se pasa un estado, lo concatenamos a la URL de búsqueda
    if (state) {
      url += `&offer_state=${state}`;
    }
    
    return httpClient.get(url);
  },
};