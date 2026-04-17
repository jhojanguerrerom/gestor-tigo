import { useState, useCallback } from 'react';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import { userService } from '@/api/services/userService';
import type { User } from '@/api/services/userService';
import { useToast } from '@/context/ToastContext';

export default function UsersHomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { success, error } = useToast();

  // Estados para Modal de Formulario (Crear/Editar)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setIsProcessing(true);
      await userService.updateUser(user.id, { user_state: !user.user_state });
      success(`Usuario ${user.login} ${!user.user_state ? 'activado' : 'desactivado'} correctamente`);
      handleRefresh();
    } catch (err) {
      error('Error al cambiar el estado del usuario');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="container py-4">
      {isProcessing && <Loading fullScreen text="Actualizando usuario..." />}

      <header className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center">
          <h1 className="h3 font-dm-bold mb-0">Gestión de Usuarios</h1>
          <button 
            type="button" 
            className="btn btn-link p-0 ms-2" 
            onClick={handleRefresh} 
            title="Actualizar tabla"
          >
            <Icon name="refresh" size="xl" />
          </button>
        </div>
        <div className='d-flex align-items-center'>
          <Icon name="plus" size="lg" className="me-2" />
        <button className="button button-blue align-items-center" onClick={handleOpenCreate}>
          Nuevo Usuario
        </button>
        </div>
      </header>

      <UserTable 
        refreshKey={refreshKey} 
        onEdit={handleOpenEdit} 
        onToggleStatus={handleToggleStatus} 
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        user={selectedUser}
        onSuccess={handleRefresh}
      />
    </section>
  );
}