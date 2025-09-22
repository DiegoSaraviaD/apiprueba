import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    console.log('🔍 [MODAL] Modal no está abierto, isOpen:', isOpen);
    return null;
  }
  
  console.log('🔍 [MODAL] Renderizando modal, isOpen:', isOpen, 'title:', title);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-width: 400px',
    md: 'max-width: 500px',
    lg: 'max-width: 700px',
    xl: 'max-width: 900px',
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className="modal-content" 
        style={{ ...sizeClasses[size] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="modal-close"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente para el footer del modal
export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`modal-footer ${className}`}>
      {children}
    </div>
  );
};

export default Modal;