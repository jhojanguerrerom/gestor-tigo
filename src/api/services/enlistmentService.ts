import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const enlistmentService = {
  getEnlistments: (page = 1, limit = 10) =>
    httpClient.get(`${ENDPOINTS.ENLISTMENT.BASE}?page=${page}&limit=${limit}`),
  searchByOferta: (oferta: string, page = 1, limit = 10) =>
    httpClient.get(`/v1/enlistment/search/field?field=oferta&value=${encodeURIComponent(oferta)}&page=${page}&limit=${limit}`),
}
