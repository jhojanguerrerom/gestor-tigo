import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import OrdersHomePage from '../pages/orders/index'
import CaseResolutionPage from '../pages/cases/CaseResolutionPage'
import OffersManagedPage from '../pages/offers/OffersManagedPage'
import ActionsPage from '../pages/admin/actions/ActionsPage'
import ManagementByHourPage from '../pages/reports/Productivity/index';
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
    element: <AppLayout />, // Este layout envuelve tu Sidebar/Navbar
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
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER]}>
            <OffersManagedPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/reports/management-by-hour',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER]}>
            <ManagementByHourPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/config/actions',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER]}>
            <ActionsPage />
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