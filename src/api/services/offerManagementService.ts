import httpClient from '@/api/httpClient';

export const offerManagementService = {
  manageOffer: (data: {
    oferta: string;
    accion_id: string;
    subaccion_id: string;
    observacion: string;
  }) => {
    return httpClient.post('/v1/ofertas/gestionar', data);
  },
};
