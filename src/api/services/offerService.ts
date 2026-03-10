import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export const offerService = {
  getOffers: () => httpClient.get(ENDPOINTS.OFFERS.BASE),
  
  getMyOffer: () => httpClient.get(ENDPOINTS.OFFERS.MY_OFFER),
  
  freezeOffer: () => httpClient.post(ENDPOINTS.OFFERS.FREEZE),
  
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
};