import { useState, useMemo, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { userService } from '@/api/services/userService';
import type { User } from '@/api/services/userService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { useBootstrapTooltips } from '@/hooks/useBootstrapTooltips'; // 1. Importar el hook

interface UserTableProps {
  refreshKey: number;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export default function UserTable({ refreshKey, onEdit, onToggleStatus }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFn = useCallback((page: number, limit: number, search: string) => {
    return userService.getUsers(page, limit, search);
  }, []);

  const { data, total, totalPages, currentPage, setCurrentPage, loading } = useEnlistmentTable({
    pageSize: 10,
    searchQuery,
    refreshKey,
    fetchFn
  });

  // 2. Inicializar el hook de tooltips para que se recarguen cuando cambie la data o la página
  useBootstrapTooltips([data, currentPage]);

  const columns = useMemo(() => [
    { header: 'Usuario' },
    { header: 'Nombre' },
    { header: 'Identificación' },
    { header: 'Correo' },
    { header: 'Perfil' },
    { header: 'Estado' },
    { header: 'Acciones' }
  ], []);

  return (
    <>
      {loading && <Loading fullScreen text="Cargando usuarios..." />}
      <DataTable
        rows={data}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={total}
        totalPages={totalPages}
        loading={loading}
        showSearch={true}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        searchPlaceholder="Buscar por usuario o nombre..."
        // 3. Pasar las dependencias al DataTable (si tu componente DataTable lo requiere)
        tooltipDeps={[data, currentPage]}
        renderRow={(user: User) => (
          <tr key={user.id}>
            <td>
              <div className="d-flex align-items-center">
                <Icon name="user" size="lg" className="me-2" />
                <span 
                  className='badge text-bg-blue w-100' 
                  data-bs-toggle="tooltip" 
                  title={`${user.login}`} // El tooltip aparecerá al pasar el mouse
                >
                  {user.login}
                </span>
              </div>
            </td>
            <td>
              <span className={`cell-text ${!user.full_name ? 'text-muted fst-italic opacity-75' : 'fw-bold'}`} data-bs-toggle="tooltip" title={user.full_name || 'Sin nombre'}>
                {user.full_name || 'Sin nombre'}
              </span>
            </td>
            <td>
              <span className={`cell-text ${!user.user_identify ? 'text-muted fst-italic opacity-75' : ''}`} data-bs-toggle="tooltip" title={`${user.user_identify || 'Sin identificación'}`}>
                {user.user_identify || 'Sin identificación'}
              </span>
            </td>
            <td>
              <span className={`cell-text ${!user.email ? 'text-muted fst-italic opacity-75' : ''}`} data-bs-toggle="tooltip" title={user.email || 'Sin correo'}>
                {user.email || 'Sin correo'}
              </span>
            </td>
            <td>
              <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={user.profile_id === 1 ? 'Administrador' : user.profile_id === 3 ? 'Supervisor' : user.profile_id === 4 ? 'Asesor' : 'Espectador'}>
                {user.profile_id === 1 ? 'Administrador' : user.profile_id === 3 ? 'Supervisor' : user.profile_id === 4 ? 'Asesor' : 'Espectador'}
              </span>
            </td>
            <td>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input cursor-pointer" 
                  type="checkbox" 
                  checked={user.user_state} 
                  onChange={() => onToggleStatus(user)}
                />
                {user.user_state ? (
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Activo</span>
                ) : (
                  <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">Inactivo</span>
                )}
              </div>
            </td>
            <td>
              <button 
                className="btn btn-link p-0 text-primary" 
                onClick={() => onEdit(user)}
                title="Editar Usuario" // Tooltip nativo del botón
              >
                <Icon name="edit" size="lg" />
              </button>
            </td>
          </tr>
        )}
      />
    </>
  );
}