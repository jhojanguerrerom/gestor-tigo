import httpClient from '../httpClient'
import { ENDPOINTS } from '../endpoints'
import type { LoginResponse } from '@/auth/types/auth.types'

export const authService = {
  login: (username: string, password: string) =>
    httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { username, password }),
  logout: () => httpClient.post(ENDPOINTS.AUTH.LOGOUT),
  refreshToken: (refreshToken: string) =>
    httpClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }),
  // Agrega aquí más métodos relacionados con auth si es necesario
}
