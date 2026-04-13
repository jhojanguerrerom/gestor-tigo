import { useState } from 'react'
import { ENDPOINTS } from '@/api/endpoints'
import httpClient from '@/api/httpClient'
import { UserRole, type LoginResponse, type User } from '../types/auth.types'
import { MENU_BY_ROLE } from '../constants/menuByRole'
//import { useToast } from '@/context/ToastContext' // 1. Importar el Toast

export function useAuth() {
  //const { error: notifyError } = useToast() // 2. Obtener la función (con alias para evitar choque)
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ username, password }: { username: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { username, password });
      console.log("MENÚ DESDE EL SERVIDOR:", data.menu);
      
      // 1. Limpieza total de seguridad antes de guardar nuevos datos
      localStorage.clear(); 

      // 2. Guardar tokens
      localStorage.setItem('access_token', data.auth.access_token)
      localStorage.setItem('refresh_token', data.auth.refresh_token)
      localStorage.setItem('refresh_expires_at', String(data.auth.refresh_expires_at))

      // 3. LÓGICA DE PRIORIDAD CORREGIDA:
      // Validamos que data.menu sea un array y tenga contenido.
      const hasMenuFromServer = Array.isArray(data.menu) && data.menu.length > 0;
      
      const menu = hasMenuFromServer 
        ? data.menu 
        : (MENU_BY_ROLE[data.profile_id as UserRole] || []);

      // 4. Construimos el objeto final asegurando que el menú sea el procesado
      const userData = { ...data, menu };
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setLoading(false)
      
      return { success: true, role: data.profile_id, user: userData }
    } catch (err: any) {
      // ... manejo de errores igual
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('refresh_expires_at')
    localStorage.removeItem('access_expires_at')
    localStorage.removeItem('user')
  }

  return { user, loading, error, login, logout }
}