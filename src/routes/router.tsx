import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import AdminHomePage from '../pages/admin/AdminHomePage'
import AdvisorHomePage from '../pages/advisor/AdvisorHomePage'
import CaseResolutionPage from '../pages/cases/CaseResolutionPage'
import OffersManagedPage from '../pages/offers/OffersManagedPage'
import NotFoundPage from '../pages/common/NotFoundPage'

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
        path: '/admin/home',
        element: <AdminHomePage />,
      },
      {
        path: '/advisor/home',
        element: <AdvisorHomePage />,
      },
      {
        path: '/cases/resolve',
        element: <CaseResolutionPage />,
      },
      {
        path: '/offers/managed',
        element: <OffersManagedPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
