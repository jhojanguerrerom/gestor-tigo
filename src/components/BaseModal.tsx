import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * Props para el componente BaseModal.
 * @param isOpen - Controla si el modal está abierto.
 * @param onClose - Función que se llama para cerrar el modal.
 * @param title - Título que se mostrará en la cabecera del modal.
 * @param children - Contenido a renderizar dentro del cuerpo del modal.
 * @param size - Tamaño opcional del modal ('modal-sm', 'modal-lg', 'modal-xl').
 */
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'modal-sm' | 'modal-lg' | 'modal-xl';
}

// Es una buena práctica tener un elemento raíz dedicado para los modales en tu index.html.
// Si no existe, usamos document.body como fallback.
const modalRoot = document.getElementById('modal-root') || document.body;

/**
 * Un componente de modal base reutilizable y controlado por estado de React,
 * que utiliza las clases de Bootstrap 5 para el estilo pero sin su JavaScript.
 * Implementa animaciones de apertura/cierre y se renderiza en un portal.
 */
export default function BaseModal({ isOpen, onClose, title, children, size }: BaseModalProps) {
  // Estado para controlar el montaje/desmontaje del componente y permitir la animación de salida.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isOpen) {
      // Si se abre, se monta inmediatamente para que esté en el DOM.
      setIsMounted(true);
    } else {
      // Al cerrar, esperamos que la animación de 'fade-out' de Bootstrap termine (.15s) antes de desmontar.
      timeoutId = window.setTimeout(() => setIsMounted(false), 150);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Efecto para manejar el cierre con la tecla 'Escape'.
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Efecto para evitar el scroll del body cuando el modal está abierto.
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      // Aseguramos que la clase se quite cuando el modal se cierra.
      document.body.classList.remove('modal-open');
    }
    // Limpieza al desmontar el componente.
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // No renderizar nada si el componente no está montado.
  if (!isMounted) {
    return null;
  }

  const modalContent = (
    <>
      {/* El fondo oscuro (backdrop) */}
      <div className={`modal-backdrop fade ${isOpen ? 'show' : ''}`} />

      {/* Contenedor principal del modal */}
      <div
        className={`modal fade ${isOpen ? 'show' : ''}`}
        role="dialog"
        tabIndex={-1}
        style={{ display: 'block' }}
        onClick={onClose} // Cierra el modal al hacer clic en el fondo.
      >
        <div
          className={`modal-dialog ${size || ''} modal-dialog-centered`}
          role="document"
          onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre.
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
}