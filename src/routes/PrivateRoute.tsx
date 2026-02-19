import { useAuth } from '@/auth/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { UserRole } from '@/auth/types/auth.types'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.profile_id)) {
    // Redirige según rol
    switch (user.profile_id) {
      case UserRole.SUPER_USER:
      case UserRole.SUPERVISOR:
      case UserRole.VIEWER:
        return <Navigate to="/orders/home" replace />
      case UserRole.ASESOR:
        return <Navigate to="/advisor/home" replace />
      default:
        return <Navigate to="/orders/home" replace />
    }
  }

  return <>{children}</>
}
