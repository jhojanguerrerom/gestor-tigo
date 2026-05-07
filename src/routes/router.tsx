// router.tsx
import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import OrdersHomePage from '../pages/orders/index'
import CaseResolutionPage from '../pages/cases/index'
import OffersManagedPage from '../pages/offers/OffersManagedPage/index'
import GlobalSearchPage from '../pages/offers/GlobalSearchPage/index'
import ActionsPage from '../pages/admin/actions/ActionsPage'
import UsersPage from '../pages/admin/users/index'
import ManagementByHourPage from '../pages/reports/Productivity/index';
import HistoricalIncomePage from '../pages/reports/HistoricalIncome/index'
import PauseSettingsPage from '../pages/admin/paused/PauseSettingsPage'
import { PrivateRoute } from './PrivateRoute'
import { UserRole } from '@/auth/types/auth.types'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />, 
    children: [
      {
        path: '',
        element: <Navigate to="/orders/home" replace />,
      },
      // ACCESO: SUPER_USER, SUPERVISOR
      {
        path: '/orders/home',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR]}>
            <OrdersHomePage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SOLO ASESOR
      {
        path: '/advisor/home',
        element: (
          <PrivateRoute allowedRoles={[UserRole.ASESOR]}>
            <CaseResolutionPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SUPER_USER, SUPERVISOR
      {
        path: '/offers/managed',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR]}>
            <OffersManagedPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SUPER_USER, SUPERVISOR
      {
        path: '/offers/global-search',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR]}>
            <GlobalSearchPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SUPER_USER, SUPERVISOR, VIEWER
      {
        path: '/reports/management-by-hour',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER]}>
            <ManagementByHourPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SOLO SUPER_USER
      {
        path: '/config/actions',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER]}>
            <ActionsPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SOLO SUPER_USER
      {
        path: '/config/users',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER]}>
            <UsersPage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SUPER_USER, SUPERVISOR, VIEWER
      {
        path: '/reports/historical-income',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER, UserRole.SUPERVISOR, UserRole.VIEWER]}>
            <HistoricalIncomePage />
          </PrivateRoute>
        ),
      },
      // ACCESO: SOLO SUPER_USER
      {
        path: '/config/pause-settings',
        element: (
          <PrivateRoute allowedRoles={[UserRole.SUPER_USER]}>
            <PauseSettingsPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])