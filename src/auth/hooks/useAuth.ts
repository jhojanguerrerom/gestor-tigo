import { useState } from 'react'
import { ENDPOINTS } from '@/api/endpoints'
import httpClient from '@/api/httpClient'
import { UserRole, type LoginResponse, type User } from '../types/auth.types'
import { MENU_BY_ROLE } from '../constants/menuByRole'

export function useAuth() {
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
      const { data } = await httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { username, password })
      // Guardar tokens
      localStorage.setItem('access_token', data.auth.access_token)
      localStorage.setItem('refresh_token', data.auth.refresh_token)
      // Simular menú si no viene en la respuesta
      const menu = data.menu && data.menu.length > 0 ? data.menu : MENU_BY_ROLE[data.profile_id as UserRole]
      const userData = { ...data, menu }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setLoading(false)
      return { success: true, role: data.profile_id, user: userData }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Revisa tus datos e intenta de nuevo')
      setUser(null)
      localStorage.removeItem('user')
      setLoading(false)
      return { success: false }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  return { user, loading, error, login, logout }
}
