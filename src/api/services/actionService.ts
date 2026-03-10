import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const actionService = {
  getActionsWithSubactions: () => httpClient.get(ENDPOINTS.ACTIONS.CATALOG),
};