// src/components/ui/Loading.tsx
import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'light' | 'dark' | 'white';
}

export default function Loading({ 
  text = 'Cargando...', 
  fullScreen = false, 
  size = 'md',
  variant = 'primary'
}: LoadingProps) {
  
  // Clases dinámicas según el tamaño
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';
  
  // El spinner en sí
  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
      <div className={`spinner-border text-${fullScreen ? 'white' : variant} ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className={`fw-bold ${fullScreen ? 'text-white' : `text-${variant}`}`}>{text}</span>}
    </div>
  );

  // Si es a pantalla completa, devolvemos el overlay (fondo oscuro bloqueando la pantalla)
  if (fullScreen) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
        style={{ zIndex: 9999 }} // z-index alto para que cubra modales y navbars
      >
        {spinnerContent}
      </div>
    );
  }

  // Si no es full screen, solo devolvemos el spinner
  return spinnerContent;
}