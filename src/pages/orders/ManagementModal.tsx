import { useState, useEffect } from 'react';
import BaseModal from '@/components/BaseModal';
import { offerService } from '@/api/services/offerService';
import { useToast } from '@/context/ToastContext';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  ofertaId: string;
  onSuccess?: () => void;
  isInTransit?: boolean; // Prop para saber si viene de la pestaña "En trámite"
}

type ActionType = 'liberar' | 'reasignar';

const ManagementModal = ({ isOpen, onClose, ofertaId, onSuccess, isInTransit }: ManagementModalProps) => {
  // Por defecto, si no está en trámite, forzamos a 'reasignar'
  const [actionType, setActionType] = useState<ActionType>(isInTransit ? 'liberar' : 'reasignar');
  const [motivo, setMotivo] = useState('');
  const [asesorLogin, setAsesorLogin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (isOpen) {
      setActionType(isInTransit ? 'liberar' : 'reasignar');
    }
  }, [isOpen, isInTransit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (actionType === 'liberar') {
        if (!motivo) {
          error('El motivo es obligatorio');
          return;
        }
        await offerService.unfreezeOffer({ oferta: ofertaId, motivo });
        success('Pedido liberado exitosamente');
      } else {
        if (!motivo || !asesorLogin) {
          error('Todos los campos son obligatorios');
          return;
        }
        await offerService.reassignOffer({ oferta: ofertaId, asesor_login: asesorLogin, motivo });
        success('Pedido reasignado exitosamente');
      }
      setMotivo('');
      setAsesorLogin('');
      onSuccess?.();
      onClose();
    } catch (err) {
      error('Ocurrió un error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal 
      title={`Gestionar pedido: ${ofertaId}`}
      isOpen={isOpen} 
      onClose={onClose}
    >

      <div className="btn-group mb-3 w-100">
        <input
          type="radio"
          className="btn-check"
          name="actionType"
          id="liberar"
          autoComplete="off"
          checked={actionType === 'liberar'}
          onChange={() => setActionType('liberar')}
          disabled={!isInTransit} // Deshabilitado si no está en trámite
        />
        <label 
          className={`btn btn-outline-primary ${!isInTransit ? 'disabled opacity-50' : ''}`} 
          htmlFor="liberar"
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

      <form onSubmit={handleSubmit}>
        {actionType === 'reasignar' && (
          <div className="mb-3">
            <label htmlFor="asesorLogin" className="form-label">Asesor (Login)*</label>
            <input
              type="text"
              className="form-control"
              id="asesorLogin"
              value={asesorLogin}
              onChange={(e) => setAsesorLogin(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="motivo" className="form-label">Motivo*</label>
          <textarea
            className="form-control"
            id="motivo"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="d-flex justify-content-end">
          <button type="button" className="button button-gray me-2" onClick={onClose}>Cancelar</button>
          <button 
            type="submit" 
            className="button button-blue" 
            disabled={isLoading}
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
      </form>
    </BaseModal>
  );
};

export default ManagementModal;