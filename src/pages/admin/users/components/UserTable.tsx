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
        searchPlaceholder="Buscar por login o nombre..."
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
              <span className="cell-text" data-bs-toggle="tooltip" title={user.full_name}>
                {user.full_name}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" title={`${user.user_identify}`}>
                {user.user_identify}
              </span>
            </td>
            <td>
              <span className="cell-text" data-bs-toggle="tooltip" title={user.email || 'Sin correo'}>
                {user.email || '-'}
              </span>
            </td>
            <td>
              <span className="badge text-bg-blue">
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
                <span className={`badge ${user.user_state ? 'text-bg-success' : 'text-bg-danger'}`}>
                  {user.user_state ? 'Activo' : 'Inactivo'}
                </span>
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