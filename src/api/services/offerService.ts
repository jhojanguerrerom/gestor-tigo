import httpClient from '../httpClient';

export const offerService = {
  getOffers: () => httpClient.get('/offers'),
  getMyOffer: () => httpClient.get('/v1/ofertas/mi-oferta'),
  freezeOffer: () => httpClient.post('/v1/ofertas/congelar'),
};
