import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const enlistmentService = {
  /**
   * Obtiene enlistamientos generales. 
   * Ahora soporta el filtro de estado (ej: 'ABIERTO')
   */
  /**
   * Obtiene enlistamientos generales con soporte de filtro de estado y fechas.
   * @param page Página
   * @param limit Límite
   * @param state Estado de la oferta (ej: 'CERRADO')
   * @param fromDate Fecha inicio (YYYY-MM-DD, opcional)
   * @param toDate Fecha fin (YYYY-MM-DD, opcional)
   */
  getEnlistments: (page = 1, limit = 10, state?: string, fromDate?: string, toDate?: string) => {
    const url = new URL(`${window.location.origin}${ENDPOINTS.ENLISTMENT.BASE}`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (state) url.searchParams.append('offer_state', state);
    if (fromDate) url.searchParams.append('from_date', fromDate);
    if (toDate) url.searchParams.append('to_date', toDate);
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

  // --- Histórico de cambios de oferta ---
  /**
   * Obtiene el histórico de cambios de una oferta (enlistment).
   * @param ofertaId ID de la oferta
   * @param page Página (opcional, default 1)
   * @param limit Límite de resultados por página (opcional, default 10)
   */
  getOfferChangeHistory: (ofertaId: string, page = 1, limit = 10) => {
    return httpClient.get(`/v1/enlistment/history/${ofertaId}?limit=${limit}&page=${page}`);
  },
};