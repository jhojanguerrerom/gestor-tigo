import { useState, useEffect } from 'react';
import BaseModal from '@/components/BaseModal';
import { actionService } from '@/api/services/actionService';
import { useToast } from '@/context/ToastContext';
import { Icon } from '@/icons/Icon';

type CreationType = 'accion' | 'subaccion';

interface ManageCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  acciones: any[]; // Recibimos las acciones para pintar el select de subacciones
  initialType?: CreationType;
  initialAccionId?: string; // Por si se abre desde el botón "Añadir subacción" de una fila
}

export default function ManageCatalogModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  acciones, 
  initialType = 'accion',
  initialAccionId = ''
}: ManageCatalogModalProps) {
  
  const [creationType, setCreationType] = useState<CreationType>(initialType);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState<number | ''>('');
  const [accionPadreId, setAccionPadreId] = useState(initialAccionId);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  // Resetear y sincronizar el estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCreationType(initialType);
      setAccionPadreId(initialAccionId);
      setNombre('');
      setDescripcion('');
      setOrden('');
    }
  }, [isOpen, initialType, initialAccionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (creationType === 'accion') {
        if (!nombre || !descripcion || orden === '') {
          error('Todos los campos de la acción son obligatorios');
          return;
        }
        await actionService.createAction({ 
          nombre, 
          descripcion, 
          orden: Number(orden) 
        });
        success('Acción creada exitosamente');
      } else {
        if (!accionPadreId || !nombre || orden === '') {
          error('Todos los campos de la subacción son obligatorios');
          return;
        }
        await actionService.createSubaction({ 
          accion_id: accionPadreId, 
          nombre, 
          orden: Number(orden) 
        });
        success('Subacción creada exitosamente');
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      error(`Ocurrió un error al crear la ${creationType}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal 
      title={creationType === 'accion' ? "Crear nueva Acción" : "Crear nueva Subacción"}
      isOpen={isOpen} 
      onClose={onClose}
      size="modal-md"
    >
      {/* Botones de alternancia (Radio Group) */}
      <div className="btn-group mb-4 w-100">
        <input
          type="radio"
          className="btn-check"
          name="creationType"
          id="crearAccion"
          autoComplete="off"
          checked={creationType === 'accion'}
          onChange={() => setCreationType('accion')}
        />
        <label className="btn btn-outline-primary" htmlFor="crearAccion">Acción principal</label>

        <input
          type="radio"
          className="btn-check"
          name="creationType"
          id="crearSubaccion"
          autoComplete="off"
          checked={creationType === 'subaccion'}
          onChange={() => setCreationType('subaccion')}
        />
        <label className="btn btn-outline-primary" htmlFor="crearSubaccion">Subacción</label>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo exclusivo de Subacción */}
        {creationType === 'subaccion' && (
          <div className="mb-3">
            <label htmlFor="accionPadre" className="form-label fw-bold">Acción a la que pertenece *</label>
            <select
              className="form-select"
              id="accionPadre"
              value={accionPadreId}
              onChange={(e) => setAccionPadreId(e.target.value)}
              required
            >
              <option value="">Seleccione una acción...</option>
              {acciones.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {/* Campos compartidos */}
        <div className="mb-3">
          <label htmlFor="nombreItem" className="form-label fw-bold">Nombre *</label>
          <input
            type="text"
            className="form-control"
            id="nombreItem"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* Campo exclusivo de Acción */}
        {creationType === 'accion' && (
          <div className="mb-3">
            <label htmlFor="descripcionAccion" className="form-label fw-bold">Descripción *</label>
            <textarea
              className="form-control"
              id="descripcionAccion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="ordenItem" className="form-label fw-bold">Orden de visualización *</label>
          <input
            type="number"
            className="form-control"
            id="ordenItem"
            value={orden}
            onChange={(e) => setOrden(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            required
          />
        </div>

        {/* Botones de acción */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="button button-gray me-2" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="button button-blue" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>Guardar</>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}