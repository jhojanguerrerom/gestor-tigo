import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import ToastContainer from './ToastContainer';
import type { ToastMessageProps } from './ToastMessage';

// All in one file to avoid module resolution issues

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastContextType {
  addToast: (message: string, type: ToastType, title?: string, delay?: number) => void;
  success: (message: string, title?: string, delay?: number) => void;
  error: (message: string, title?: string, delay?: number) => void;
  warning: (message: string, title?: string, delay?: number) => void;
  info: (message: string, title?: string, delay?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Omit<ToastMessageProps, 'onClose'>[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, title?: string, delay?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title, delay }]);
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, delay?: number) => addToast(message, 'success', title, delay),
    [addToast]
  );
  const error = useCallback(
    (message: string, title?: string, delay?: number) => addToast(message, 'danger', title, delay),
    [addToast]
  );
  const warning = useCallback(
    (message: string, title?: string, delay?: number) => addToast(message, 'warning', title, delay),
    [addToast]
  );
  const info = useCallback(
    (message: string, title?: string, delay?: number) => addToast(message, 'info', title, delay),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
}
