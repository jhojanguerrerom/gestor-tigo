import type { PropsWithChildren } from 'react'
import { ToastProvider } from '../context/ToastContext'

/**
 * Proveedor principal de la aplicación.
 * Por ahora es un contenedor vacío, listo para crecer con contextos.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ToastProvider>{children}</ToastProvider>
  )
}
