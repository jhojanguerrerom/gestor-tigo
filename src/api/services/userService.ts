import httpClient from '../httpClient';
import { ENDPOINTS } from '../endpoints';

export interface User {
  id: string; 
  login: string;
  user_identify: number | null;
  full_name: string;
  profile_id: number;
  email: string | null;
  user_state: boolean;
}

export const userService = {
  /**
   * Obtiene la lista de usuarios.
   * IMPORTANTE: Transforma el objeto de la API en el formato que useEnlistmentTable espera.
   */
  getUsers: (page = 1, pageSize = 10, search = '') => {
    const url = new URL(`${window.location.origin}${ENDPOINTS.USERS.BASE_USERS}`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', pageSize.toString());
    if (search) url.searchParams.append('search', search);

    return httpClient.get(`${ENDPOINTS.USERS.BASE_USERS}${url.search}`).then(response => {
      // El backend retorna: { total, page, page_size, users: [...] }
      const { users = [], total = 0, page_size = 10 } = response.data || {};
      return {
        ...response,
        data: {
          data: users,
          pagination: {
            total,
            total_pages: Math.ceil(total / page_size) || 1
          }
        }
      };
    });
  },

  createUser: (userData: Omit<User, 'id'>) => 
    httpClient.post(ENDPOINTS.USERS.BASE_USERS, userData),

  updateUser: (userId: string | number, userData: Partial<User>) => 
    httpClient.put(ENDPOINTS.USERS.BY_ID(userId), userData),

  deleteUser: (userId: string | number) => 
    httpClient.delete(ENDPOINTS.USERS.BY_ID(userId)),
};