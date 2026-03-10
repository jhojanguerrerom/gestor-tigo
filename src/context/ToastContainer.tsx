import ToastMessage from './ToastMessage';
import type { ToastMessageProps } from './ToastMessage';

interface ToastContainerProps {
  toasts: Omit<ToastMessageProps, 'onClose'>[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1055 }} // z-index superior a modales y offcanvas estándar de Bootstrap
    >
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}