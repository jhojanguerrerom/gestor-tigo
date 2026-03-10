import { useEffect } from 'react';

export interface ToastMessageProps {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  delay?: number;
  onClose: (id: string) => void;
}

export default function ToastMessage({
  id,
  message,
  type,
  title,
  delay = 5000, // Default delay de 5 segundos
  onClose,
}: ToastMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay, onClose]);

  const bgClass = `text-bg-${type}`;
  const closeBtnClass = ['warning', 'info'].includes(type) ? 'btn-close' : 'btn-close btn-close-white';

  return (
    <div className={`toast show align-items-start ${bgClass} border-0 mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          {title && <div className="fw-bold mb-1">{title}</div>}
          {message}
        </div>
        <button
          type="button"
          className={`${closeBtnClass} me-2 m-auto`}
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => onClose(id)}
        ></button>
      </div>
    </div>
  );
}