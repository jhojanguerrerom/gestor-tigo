import axios, { type InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from './endpoints';

const BASE_URL = import.meta.env.VITE_API_URL;

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para validar expiración de token
function isTokenExpired(expiry: number) {
  // expiry en segundos, convertir a milisegundos
  return Date.now() > expiry * 1000;
}

// Interceptor de Solicitud: Inyecta el token automáticamente
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

// Interceptor de Respuesta: Manejo de errores y Refresh Token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si estamos en la página de login, no intentamos refrescar el token para evitar bucles de recarga
    if (window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    // Si el error es 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;


      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Usamos una instancia nueva de axios para evitar bucles infinitos en los interceptores
        const response = await axios.post(
          `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          }
        );

        // Extraer los datos directamente desde response.data (ajustado a tu backend)
        const { access_token, refresh_token: newRefreshToken, access_expires_at, refresh_expires_at } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);
        localStorage.setItem('access_expires_at', access_expires_at.toString());
        localStorage.setItem('refresh_expires_at', refresh_expires_at.toString());

        // Actualizamos el header de la petición original y reintentamos
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Validar expiración local del refresh token antes de reintentar
        const refreshExpiresAt = localStorage.getItem('refresh_expires_at');
        if (!newRefreshToken || !refreshExpiresAt) {
          throw new Error('No refresh token or expiry available');
        }
        if (isTokenExpired(Number(refreshExpiresAt))) {
          // El refresh token está expirado localmente
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(new Error('Refresh token expired'));
        }
        // Si el refresh fue exitoso, reintenta la petición original con el nuevo access token
        return httpClient(originalRequest);

      } catch (refreshError) {
        // Si falla el refresh, limpiamos y redirigimos al login
        localStorage.clear();
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;