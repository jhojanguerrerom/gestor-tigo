import { useEffect, useState } from 'react';

export interface ToastMessageProps {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  delay?: number;
  onClose: (id: string) => void;
}

export default function ToastMessage({ id, message, type, title, delay = 5000, onClose }: ToastMessageProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // 1. Iniciar animación de entrada
    const entryTimer = setTimeout(() => setIsRendered(true), 10);

    // 2. Iniciar animación de salida según el delay
    const exitTimer = setTimeout(() => {
      handleClose();
    }, delay);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(exitTimer);
    };
  }, [id, delay]);

  const handleClose = () => {
    setIsHiding(true); // Activa la clase 'hiding'
    // Esperamos 400ms (lo que dura la transición CSS) antes de avisar al Provider
    setTimeout(() => onClose(id), 400);
  };

  const bgClass = `text-bg-${type}`;
  const closeBtnClass = ['warning', 'info'].includes(type) ? 'btn-close' : 'btn-close btn-close-white';

  return (
    <div 
      className={`toast d-block toast-custom-animation 
        ${isRendered && !isHiding ? 'show' : ''} 
        ${isHiding ? 'hiding' : ''} 
        ${bgClass} border-0`} 
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">
          {title && <div className="fw-bold mb-1">{title}</div>}
          {message}
        </div>
        <button
          type="button"
          className={`${closeBtnClass} me-2 m-auto`}
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>
    </div>
  );
}