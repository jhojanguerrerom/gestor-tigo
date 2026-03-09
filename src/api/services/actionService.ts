import httpClient from '../httpClient';

export const actionService = {
  getActionsWithSubactions: () => httpClient.get('/v1/ofertas/catalogo/acciones'), // Ajusta el endpoint si es diferente
};
