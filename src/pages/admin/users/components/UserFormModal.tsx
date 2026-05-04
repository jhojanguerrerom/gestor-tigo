import { useState, useEffect, useCallback, useRef } from 'react';
import BaseModal from '@/components/BaseModal';
import { userService } from '@/api/services/userService';
import type { User } from '@/api/services/userService';
import { useToast } from '@/context/ToastContext';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

const INITIAL_STATE = {
  login: '',
  user_identify: '',
  full_name: '',
  profile_id: 4,
  email: '',
  user_state: true
};

const UserFormModal = ({ isOpen, onClose, user, onSuccess }: UserFormModalProps) => {
  const [formData, setFormData] = useState<any>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  // Refs para manejo de foco como en tu ejemplo
  const loginRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Resetear campos y manejar foco al abrir
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({ ...user });
        setTimeout(() => nameRef.current?.focus(), 100);
      } else {
        setFormData(INITIAL_STATE);
        setTimeout(() => loginRef.current?.focus(), 100);
      }
    }
  }, [isOpen, user]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.login.trim()) {
      error('El login es obligatorio');
      loginRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        await userService.updateUser(user.id, formData);
        success(`Usuario ${formData.login} actualizado correctamente`);
      } else {
        await userService.createUser(formData);
        success(`Usuario ${formData.login} creado exitosamente`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      error('Ocurrió un error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  }, [formData, user, onClose, onSuccess, error, success]);

  return (
    <BaseModal 
      title={user ? `Editar usuario: ${user.login}` : 'Crear nuevo usuario'}
      isOpen={isOpen} 
      onClose={onClose}
      size="modal-lg"
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <fieldset disabled={isLoading} className="border-0 p-0 m-0">
          <div className="row g-3">
            {/* Login - Solo editable al crear */}
            <div className="col-md-6 mb-3">
              <label htmlFor="userLogin" className="form-label font-dm-bold">Usuario*</label>
              <input
                type="text"
                className={`form-control ${user ? 'bg-secondary-subtle' : 'bg-light'}`}
                id="userLogin"
                placeholder="Ej: jguerrero"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                ref={loginRef}
                disabled={!!user}
                required
              />
            </div>

            {/* Identificación */}
            <div className="col-md-6 mb-3">
              <label htmlFor="userIdentify" className="form-label font-dm-bold">Identificación*</label>
              <input
                type="number"
                className="form-control bg-light"
                id="userIdentify"
                placeholder="CC"
                value={formData.user_identify}
                onChange={(e) => setFormData({ ...formData, user_identify: e.target.value })}
                required
              />
            </div>

            {/* Nombre Completo */}
            <div className="col-md-12 mb-3">
              <label htmlFor="fullName" className="form-label font-dm-bold">Nombre Completo*</label>
              <input
                type="text"
                className="form-control bg-light"
                id="fullName"
                placeholder="Ej: Jhojan David Guerrero Medina"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                ref={nameRef}
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label htmlFor="userEmail" className="form-label font-dm-bold">Correo electrónico*</label>
              <input
                type="email"
                className="form-control bg-light"
                id="userEmail"
                placeholder="usuario@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Perfil */}
            <div className="col-md-6 mb-4">
              <label htmlFor="profileId" className="form-label font-dm-bold">Perfil del sistema*</label>
              <select 
                id="profileId"
                className="form-select bg-light"
                value={formData.profile_id} 
                onChange={e => setFormData({...formData, profile_id: Number(e.target.value)})}
                required
              >
                <option value={1}>Administrador</option>
                <option value={3}>Supervisor</option>
                <option value={4}>Asesor</option>
                <option value={5}>Espectador</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3">
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
                <>{user ? 'Actualizar usuario' : 'Crear usuario'}</>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </BaseModal>
  );
};

export default UserFormModal;