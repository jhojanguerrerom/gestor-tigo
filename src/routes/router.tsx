import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import OrdersHomePage from '../pages/orders/OrdersHomePage'
import CaseResolutionPage from '../pages/cases/CaseResolutionPage'
import OffersManagedPage from '../pages/offers/OffersManagedPage'
import NotFoundPage from '../pages/common/NotFoundPage'
import { PrivateRoute } from './PrivateRoute'
import { UserRole } from '@/auth/types/auth.types'

/**
 * Router principal de la aplicación.
 * Solo define rutas hacia páginas, sin lógica adicional.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/orders/home',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER]}>
            <OrdersHomePage />
          </PrivateRoute>
        ),
      },
      {
        path: '/advisor/home',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER, UserRole.ASESOR]}>
            <CaseResolutionPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/offers/managed',
        element: (
          <PrivateRoute>
            <OffersManagedPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
