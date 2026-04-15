import { Fragment, useMemo, useState, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';

interface InTransitOrdersTabProps {
  refreshKey: number;
  onManage: (ofertaId: string, row: any) => void;
}

export default function InTransitOrdersTab({ refreshKey, onManage }: InTransitOrdersTabProps) {
  const tableId = 'transitOrdersTable';
  
  // Mantenemos el estado solo para cumplir con la interfaz de DataTable, 
  // pero no lo usaremos para filtrar.
  const [searchQuery, setSearchQuery] = useState('');

  // fetchFn simplificada: Solo pide los datos paginados al servicio
  const fetchFn = useCallback(async (page: number, limit: number) => {
    return await enlistmentService.getInTransit(page, limit);
  }, []);

  const { data, total, totalPages, currentPage, setCurrentPage, loading } = useEnlistmentTable({
    pageSize: 10,
    searchQuery: '', // Enviamos vacío para que el hook no intente buscar
    refreshKey,
    fetchFn
  });

  const columns = useMemo(() => [
    { header: 'Asesor' }, 
    { header: 'Oferta Siebel' }, 
    { header: 'Pedido Fenix' },
    { header: 'Concepto o cola' }, 
    { header: 'Segmento' }, 
    { header: 'Fecha ingreso' },
    { header: 'Tiempo' }, 
    { header: 'Detalles' }, 
    { header: 'Gestión' }
  ], []);

  return (
    <>
      {loading && <Loading fullScreen text="Cargando pedidos en trámite..." />}
      
      <DataTable
        rows={data}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={total}
        totalPages={totalPages}
        loading={loading}
        // Pasamos props de búsqueda vacías para evitar errores de TS
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={false} // <--- OCULTA EL BUSCADOR VISUALMENTE
        tableId={tableId}
        tooltipDeps={[data, currentPage]}
        getSearchText={() => ''}
        renderRow={(row: any) => {
          const campos = row.campos_dinamicos || {};
          const asesorUser = row.usuario_asignado ||  '-';
          const asesorName = row.usuario_nombre || '-';
          const ofertaIdActual = row.oferta || campos.oferta || '-';
          const fechaIngreso = campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : '-';
          const coordenadas = campos.latitude && campos.longitude ? `${campos.latitude}, ${campos.longitude}` : '-';

          return (
            <Fragment key={row.hash_registro || row.id || ofertaIdActual}>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    <Icon name="user-call" size="lg" className="me-2" />
                    <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={asesorName}>{asesorUser}</span>
                  </div>
                </td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={ofertaIdActual}>{ofertaIdActual}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.pedido_id}>{campos.pedido_id || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.concepto || campos.concepto_id}>{campos.concepto || campos.concepto_id || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.uen}>{campos.uen || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={fechaIngreso}>{fechaIngreso}</span></td>
                <td className="text-center">
                  <span className="badge rounded-pill bg-light text-dark border">{row.tiempo_transcurrido_minutos} min</span>
                </td>
                <td className="text-center">
                  <Icon 
                    name="plus" 
                    size="lg" 
                    className="cursor-pointer" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#details-transit-${row.id || ofertaIdActual}`} 
                  />
                </td>
                <td>
                  <button 
                    className="badge rounded-pill text-bg-bluelight border-0 p-2" 
                    onClick={() => onManage(ofertaIdActual, row)}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
              <tr className="data-details-row">
                <td colSpan={9}>
                  <div className="collapse" id={`details-transit-${row.id || ofertaIdActual}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      <table className="table table-sm table-bordered mb-0 bg-white text-center">
                        <thead className="table-secondary">
                          <tr>
                            <th>Dirección</th>
                            <th>Coordenadas</th>
                            <th>Fecha asignación</th>
                            <th>Nodo ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.direccion}>{campos.direccion || '-'}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={coordenadas}>{coordenadas}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={row.fecha_asignacion ? new Date(row.fecha_asignacion).toLocaleString('es-CO') : '-'}>{row.fecha_asignacion ? new Date(row.fecha_asignacion).toLocaleString('es-CO') : '-'}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.nodo_id}>{campos.nodo_id || '-'}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        }}
      />
    </>
  );
}