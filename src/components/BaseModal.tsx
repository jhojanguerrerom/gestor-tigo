import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'modal-sm' | 'modal-md' | 'modal-lg' | 'modal-xl';
}

const modalRoot = document.getElementById('modal-root') || document.body;

export default function BaseModal({ isOpen, onClose, title, children, size }: BaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimateIn, setIsAnimateIn] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isOpen) {
      setIsMounted(true);
      // El pequeño delay permite que el navegador registre el montaje antes de aplicar la clase de animación
      timeoutId = window.setTimeout(() => setIsAnimateIn(true), 10);
    } else {
      setIsAnimateIn(false); // Inicia animación de salida
      // Esperamos a que la transición termine (300ms según el SCSS que te daré) antes de desmontar
      timeoutId = window.setTimeout(() => setIsMounted(false), 300);
    }

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop con transición suave */}
      <div 
        className={`modal-backdrop fade ${isAnimateIn ? 'show' : ''}`} 
        style={{ transition: 'opacity 0.3s ease' }}
      />

      <div
        className={`modal fade ${isAnimateIn ? 'show' : ''}`}
        role="dialog"
        tabIndex={-1}
        style={{ 
          display: 'block', 
          pointerEvents: isAnimateIn ? 'all' : 'none' 
        }}
        onClick={onClose}
      >
        <div
          className={`modal-dialog ${size || ''} modal-dialog-centered modal-dialog-scrollable`}
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>,
    modalRoot
  );
}