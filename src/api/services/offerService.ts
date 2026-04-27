import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const offerService = {
  getOffers: () => httpClient.get(ENDPOINTS.OFFERS.BASE),
  
  getMyOffer: () => httpClient.get(ENDPOINTS.OFFERS.MY_OFFER),
  
  freezeOffer: (data?: { concepto?: string }) => {
    return httpClient.post(ENDPOINTS.OFFERS.FREEZE, data);
  },
  
  getConcepts: () => httpClient.get(ENDPOINTS.OFFERS.CONCEPTS),
  
  getHistory: (oferta: string) => httpClient.get(ENDPOINTS.OFFERS.HISTORY(oferta)),
  
  getManagementDetail: (oferta: string) => httpClient.get(ENDPOINTS.OFFERS.MANAGEMENT_DETAIL(oferta)),
  
  manageOffer: (data: {
    oferta: string;
    accion_id: string;
    subaccion_id: string;
    observacion: string;
  }) => {
    return httpClient.post(ENDPOINTS.OFFERS.MANAGE, data);
  },

  unfreezeOffer: (payload: { oferta: string, motivo: string }) => {
    return httpClient.post(ENDPOINTS.OFFERS.UNFREEZE, payload);
  },

  reassignOffer: (payload: { oferta: string, asesor_login: string, motivo: string }) => {
    return httpClient.post(ENDPOINTS.OFFERS.REASSIGN, payload);
  },

  pauseOffer: (payload: { oferta: string }) => {
    return httpClient.post(ENDPOINTS.OFFERS.PAUSE, payload);
  },

  getPausedOffers: () => httpClient.get(ENDPOINTS.OFFERS.PAUSED),

  resumeOffer: (payload: { oferta: string }) => {
    return httpClient.post(ENDPOINTS.OFFERS.RESUME, payload);
  },

};