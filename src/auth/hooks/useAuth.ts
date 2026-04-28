import { useState } from 'react'
import { ENDPOINTS } from '@/api/endpoints'
import httpClient from '@/api/httpClient'
import { UserRole, type LoginResponse, type User } from '../types/auth.types'
import { MENU_BY_ROLE } from '../constants/menuByRole'
import { useToast } from '@/context/ToastContext' // Restaurado
import { authService } from '@/api/services/authService'

export function useAuth() {
  const { error: notifyError } = useToast() // Restaurado
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
      
      localStorage.clear(); 
      localStorage.setItem('access_token', data.auth.access_token)
      localStorage.setItem('refresh_token', data.auth.refresh_token)
      localStorage.setItem('refresh_expires_at', String(data.auth.refresh_expires_at))

      const hasMenuFromServer = Array.isArray(data.menu) && data.menu.length > 0;
      const menu = hasMenuFromServer 
        ? data.menu 
        : (MENU_BY_ROLE[data.profile_id as UserRole] || []);

      const userData = { ...data, menu };
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setLoading(false)
      
      return { success: true, role: data.profile_id, user: userData }
    } catch (err: any) {
      // ESTA PARTE ES CRÍTICA PARA EL BOTÓN Y EL TOAST
      const errorMessage = err.response?.data?.detail || 'Revisa tus datos e intenta de nuevo'
      
      setError(errorMessage)
      notifyError(errorMessage) // Esto dispara el mensaje visual
      setLoading(false)        // Esto hace que el botón vuelva a decir "Entrar"
      
      return { success: false }
    }
  }

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignorar error de logout, igual limpiar localStorage
    }
    setUser(null)
    localStorage.clear()
  }

  return { user, loading, error, login, logout }
}