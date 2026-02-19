import httpClient from '../httpClient'

export const userService = {
  // Ejemplo: obtener usuarios
  getUsers: () => httpClient.get('/users'),
  // Agrega aquí más métodos relacionados con usuarios
}
