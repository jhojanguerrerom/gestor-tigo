import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const enlistmentService = {
  getEnlistments: (page = 1, limit = 10) =>
    httpClient.get(`${ENDPOINTS.ENLISTMENT.BASE}?page=${page}&limit=${limit}`),
}
