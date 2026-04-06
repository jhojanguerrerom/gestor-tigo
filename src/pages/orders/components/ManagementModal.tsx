import { useState, useEffect, useCallback, useRef } from 'react';
import BaseModal from '@/components/BaseModal';
import { offerService } from '@/api/services/offerService';
import { useToast } from '@/context/ToastContext';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  ofertaId: string;
  onSuccess?: () => void;
  isInTransit?: boolean; 
}

type ActionType = 'liberar' | 'reasignar';


const ManagementModal = ({ isOpen, onClose, ofertaId, onSuccess, isInTransit }: ManagementModalProps) => {
  const [actionType, setActionType] = useState<ActionType>('reasignar');
  const [motivo, setMotivo] = useState('');
  const [asesorLogin, setAsesorLogin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const motivoRef = useRef<HTMLTextAreaElement>(null);
  const loginRef = useRef<HTMLInputElement>(null);

  // Resetear campos y acción al abrir
  useEffect(() => {
    if (isOpen) {
      setActionType(isInTransit ? 'liberar' : 'reasignar');
      setMotivo('');
      setAsesorLogin('');
      setTimeout(() => {
        if (isInTransit) {
          motivoRef.current?.focus();
        } else {
          loginRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, isInTransit]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) {
      error('El motivo es obligatorio');
      motivoRef.current?.focus();
      return;
    }
    if (actionType === 'reasignar' && !asesorLogin.trim()) {
      error('El login del asesor es obligatorio');
      loginRef.current?.focus();
      return;
    }
    setIsLoading(true);
    try {
      if (actionType === 'liberar') {
        await offerService.unfreezeOffer({ oferta: ofertaId, motivo: motivo.trim() });
        success('Pedido liberado exitosamente');
      } else {
        await offerService.reassignOffer({ oferta: ofertaId, asesor_login: asesorLogin.trim(), motivo: motivo.trim() });
        success(isInTransit ? 'Pedido reasignado exitosamente' : 'Pedido asignado exitosamente');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      error('Ocurrió un error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  }, [actionType, asesorLogin, motivo, ofertaId, onClose, onSuccess, isInTransit, error, success]);

  return (
    <BaseModal 
      title={`Gestionar pedido: ${ofertaId}`}
      isOpen={isOpen} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <fieldset disabled={isLoading} className="border-0 p-0 m-0">
          <div className="btn-group mb-4 w-100 shadow-sm" role="group" aria-label="Tipo de gestión">
            <input
              type="radio"
              className="btn-check"
              name="actionType"
              id="liberar"
              autoComplete="off"
              checked={actionType === 'liberar'}
              onChange={() => setActionType('liberar')}
              disabled={!isInTransit}
            />
            <label
              className={`btn btn-outline-primary${!isInTransit ? ' disabled opacity-50' : ''}`}
              htmlFor="liberar"
              title={!isInTransit ? 'El pedido no tiene un asesor asignado' : ''}
            >
              Liberar pedido
            </label>
            <input
              type="radio"
              className="btn-check"
              name="actionType"
              id="reasignar"
              autoComplete="off"
              checked={actionType === 'reasignar'}
              onChange={() => setActionType('reasignar')}
            />
            <label className="btn btn-outline-primary" htmlFor="reasignar">
              {isInTransit ? 'Reasignar pedido' : 'Asignar pedido'}
            </label>
          </div>

          {actionType === 'reasignar' && (
            <div className="mb-3 animate__animated animate__fadeIn">
              <label htmlFor="asesorLogin" className="form-label font-dm-bold">Asesor*</label>
              <input
                type="text"
                className="form-control bg-light"
                id="asesorLogin"
                placeholder="Ej: asesor123"
                value={asesorLogin}
                onChange={(e) => setAsesorLogin(e.target.value)}
                ref={loginRef}
                autoFocus={!isInTransit}
                required
                aria-required="true"
                aria-label="Asesor"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="motivo" className="form-label font-dm-bold">Motivo de la gestión *</label>
            <textarea
              className="form-control bg-light"
              id="motivo"
              rows={3}
              placeholder="Describa brevemente el motivo..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              ref={motivoRef}
              required
              aria-required="true"
              aria-label="Motivo de la gestión"
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="button button-gray me-2"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button button-blue"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                'Confirmar gestión'
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </BaseModal>
  );
};

export default ManagementModal;

