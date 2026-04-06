
import { Fragment, useState, useMemo, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';

interface OpenOrdersTabProps {
  refreshKey: number;
  onManage: (ofertaId: string, row: any) => void;
}

export default function OpenOrdersTab({ refreshKey, onManage }: OpenOrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const tableId = 'openOrdersTable';

  // Unify fetchFn signature for consistency
  const fetchFn = useCallback((page: number, limit: number, search: string) => {
    return search
      ? enlistmentService.searchByOferta(search, page, limit, 'ABIERTO')
      : enlistmentService.getEnlistments(page, limit, 'ABIERTO');
  }, []);

  const { data, total, totalPages, currentPage, setCurrentPage, loading } = useEnlistmentTable({
    pageSize: 10,
    searchQuery,
    refreshKey,
    fetchFn
  });

  const columns = useMemo(() => [
    { header: 'Asesor' }, { header: 'Oferta Siebel' }, { header: 'Pedido Fenix' },
    { header: 'Concepto o cola' }, { header: 'Segmento' }, { header: 'Fecha ingreso' },
    { header: 'Detalles' }, { header: 'Gestión' }
  ], []);

  // Optionally, implement getSearchText for client-side filtering if needed
  const getSearchText = (row: any) => {
    const campos = row.campos_dinamicos || {};
    return [row.oferta, campos.oferta, campos.pedido_id, campos.concepto, campos.uen]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  };

  return (
    <>
      {loading && <Loading fullScreen text="Cargando pedidos abiertos..." />}
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
        searchPlaceholder="Buscar por oferta"
        tableId={tableId}
        tooltipDeps={[data, searchQuery, currentPage]}
        getSearchText={getSearchText}
        renderRow={(row: any) => {
          const campos = row.campos_dinamicos || {};
          const ofertaIdActual = row.oferta || campos.oferta || '-';
          const fechaIngreso = campos.fecha_creado ? new Date(campos.fecha_creado).toLocaleString('es-CO') : '-';
          const coordenadas = campos.latitude && campos.longitude ? `${campos.latitude}, ${campos.longitude}` : '-';

          return (
            <Fragment key={row.id || ofertaIdActual}>
              <tr>
                <td>
                  <span className="badge text-bg-warning text-dark w-100" data-bs-toggle="tooltip" title="Sin asignar">
                    Sin asignar
                  </span>
                </td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={ofertaIdActual}>{ofertaIdActual}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.pedido_id}>{campos.pedido_id || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.concepto || campos.concepto_id}>{campos.concepto || campos.concepto_id || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.uen}>{campos.uen || '-'}</span></td>
                <td><span className="cell-text" data-bs-toggle="tooltip" title={fechaIngreso}>{fechaIngreso}</span></td>
                <td className="text-center">
                  <Icon name="plus" size="lg" className="cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#details-${row.id || ofertaIdActual}`} />
                </td>
                <td>
                  <button className="badge rounded-pill text-bg-bluelight border-0 p-2" onClick={() => onManage(ofertaIdActual, row)}>Gestionar</button>
                </td>
              </tr>
              <tr className="data-details-row">
                <td colSpan={8}>
                  <div className="collapse" id={`details-${row.id || ofertaIdActual}`} data-bs-parent={`#${tableId}`}>
                    <div className="p-3 bg-light border-top">
                      <table className="table table-sm table-bordered mb-0 bg-white text-center">
                        <thead className="table-secondary">
                          <tr><th>Dirección</th><th>Página</th><th>Coordenadas</th><th>Nodo ID</th><th>Megagold</th></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.direccion}>{campos.direccion || '-'}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.paginacion}>{campos.paginacion || '-'}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={coordenadas}>{coordenadas}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.nodo_id}>{campos.nodo_id || '-'}</span></td>
                            <td><span className="cell-text" data-bs-toggle="tooltip" title={campos.megagold}>{campos.megagold || '-'}</span></td>
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