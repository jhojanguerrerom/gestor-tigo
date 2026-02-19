import httpClient from '../httpClient'

export const offerService = {
  // Ejemplo: obtener ofertas
  getOffers: () => httpClient.get('/offers'),
  // Agrega aquí más métodos relacionados con ofertas
}
