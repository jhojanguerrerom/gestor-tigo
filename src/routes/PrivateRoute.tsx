// PrivateRoute.tsx
import { useAuth } from '@/auth/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { UserRole } from '@/auth/types/auth.types'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: number[]
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si el rol del usuario no está en la lista de permitidos para esta ruta específica
  if (allowedRoles && !allowedRoles.includes(user.profile_id)) {
    
    // Redirección inteligente basada en su rol principal
    switch (user.profile_id) {
      case UserRole.ASESOR:
        return <Navigate to="/advisor/home" replace />
      case UserRole.SUPER_USER:
        return <Navigate to="/orders/home" replace />
      case UserRole.SUPERVISOR:
        return <Navigate to="/orders/home" replace />
      case UserRole.VIEWER:
        return <Navigate to="/reports/historical-income" replace />
        
      default:
        return <Navigate to="/login" replace />
    }
  }

  return <>{children}</>
}