import { Fragment, useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable'; 
import { Icon } from '@/icons/Icon';
import { actionService } from '@/api/services/actionService';
import ManageCatalogModal from '@/pages/admin/actions/ManageCatalogModal';
import Loading from '@/components/Loading';

export default function ActionsPage() {
  const [acciones, setAcciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado único para controlar el modal
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'accion' | 'subaccion';
    accionId: string;
  }>({
    isOpen: false,
    type: 'accion',
    accionId: ''
  });

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await actionService.getActionsWithSubactions();
      setAcciones(res.data || []);
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const filteredActions = acciones.filter(a => 
    a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Orden' },
    { header: 'Acción' },
    { header: 'Descripción' },
    { header: 'Estado' },
    { header: 'Subacciones' }
  ];

  return (
    <section className="container py-4">
      {/* 2. Componente de Carga Global */}
      {loading && <Loading fullScreen text="Cargando catálogo..." />}

      <header className="mb-4 d-flex align-items-center justify-content-between">
        <h1 className="h3 font-dm-bold mb-0">Lista de Acciones y Subacciones</h1>
        <div className="d-flex align-items-center gap-2">
          {/* Botón superior: Abre el modal en modo 'Acción' */}
          <Icon name="plus" size="lg" className="me-2" />
          <button 
            className="button button-blue" 
            onClick={() => setModalConfig({ isOpen: true, type: 'accion', accionId: '' })}
          >
            Crear Acción
          </button>
        </div>
      </header>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <DataTable<any>
            rows={filteredActions}
            columns={columns}
            loading={loading}
            currentPage={1}
            setCurrentPage={() => {}}
            total={filteredActions.length}
            totalPages={1}
            tooltipDeps={[filteredActions]}
            getSearchText={() => ''}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Buscar acción por nombre..."
            tableId="actionsCatalogTable"
            
            renderRow={(row: any) => (
              <Fragment key={row.id}>
                {/* Fila Principal (Acción) */}
                <tr className="align-middle">
                  <td className="text-center fw-bold text-muted">{row.orden}</td>
                  <td className="fw-bold">{row.nombre}</td>
                  <td>{row.descripcion || '-'}</td>
                  <td>
                    {row.is_active ? (
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Activo</span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">Inactivo</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Icon name="plus" size="lg" 
                      className="cursor-pointer"
                      data-bs-toggle="collapse"
                      data-bs-target={`#subactions-${row.id}`}
                      aria-expanded="false"
                    />

                  </td>
                </tr>

                {/* Fila Colapsable (Subacciones) */}
                <tr className="data-details-row bg-light">
                  <td colSpan={5} className="p-0 border-0">
                    <div className="collapse" id={`subactions-${row.id}`} data-bs-parent="#actionsCatalogTable">
                      <div className="p-4 bg-light border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold text-secondary mb-0">Subacciones de "{row.nombre}"</h6>
                          
                          <div>
                            {/* Botón interno: Abre el modal en modo 'Subacción' y le pasa el ID del padre */}
                            <Icon name="plus" size="lg" className="me-1" />
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setModalConfig({ isOpen: true, type: 'subaccion', accionId: row.id })}
                            >
                              Añadir Subacción
                            </button>
                          </div>
                        </div>
                        
                        {(row.subacciones && row.subacciones.length > 0) ? (
                          <div className="table-responsive bg-white rounded border">
                            <table className="table table-sm table-hover mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th className="text-center" style={{ width: '80px' }}>Orden</th>
                                  <th>Nombre</th>
                                  <th className="text-center" style={{ width: '100px' }}>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.subacciones.map((sub: any) => (
                                  <tr key={sub.id}>
                                    <td className="text-center text-muted">{sub.orden}</td>
                                    <td>{sub.nombre}</td>
                                    <td className="text-center p-2">
                                      {sub.is_active ? (
                                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Activo</span>
                                      ) : (
                                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">Inactivo</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="alert alert-secondary mb-0 text-center border-0 bg-white">
                            No hay subacciones configuradas para esta acción.
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            )}
          />
        </div>
      </div>

      {/* Instancia ÚNICA del Modal */}
      <ManageCatalogModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} 
        onSuccess={fetchCatalog}
        acciones={acciones} 
        initialType={modalConfig.type}
        initialAccionId={modalConfig.accionId}
      />
    </section>
  );
}