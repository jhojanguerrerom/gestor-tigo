import { Fragment, useState, useMemo, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { useEnlistmentTable } from '@/hooks/useEnlistmentTable';
import { enlistmentService } from '@/api/services/enlistmentService';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';
import { downloadCSV } from '@/utils/csvUtils';
import { useToast } from '@/context/ToastContext';

interface OpenOrdersTabProps {
  refreshKey: number;
  onManage: (ofertaId: string, row: any) => void;
}

export default function OpenOrdersTab({ refreshKey, onManage }: OpenOrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const tableId = 'openOrdersTable';

  const { success, info, error } = useToast();

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

  const getSearchText = (row: any) => {
    const campos = row.campos_dinamicos || {};
    return [row.oferta, campos.oferta, campos.pedido_id, campos.concepto, campos.uen]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  };

  // --- FUNCIÓN DE EXPORTACIÓN POR LOTES (MAX 1000) ---
  const handleExportAll = async () => {
    if (total === 0) {
      info('No hay registros disponibles para exportar');
      return;
    }

    setIsExporting(true);

    try {
      const MAX_LIMIT = 1000;
      const allRecords: any[] = [];
      // Calculamos cuántas páginas de 1000 necesitamos
      const callsNeeded = Math.ceil(total / MAX_LIMIT);

      for (let i = 1; i <= callsNeeded; i++) {
        const response = await enlistmentService.getEnlistments(i, MAX_LIMIT, 'ABIERTO');
        const batch = response.data?.data || [];
        allRecords.push(...batch);
      }

      if (allRecords.length === 0) {
        info('La consulta no retornó datos');
        return;
      }

      const dataToExport = allRecords.map((row: any) => {
        const c = row.campos_dinamicos || {};
        return {
          oferta: row.oferta || c.oferta || '',
          estado_oferta: row.estado || c.estado_oferta || '',
          usuario_asignado_login: row.usuario_asignado_login || '',
          usuario_asignado_nombre: row.usuario_asignado_nombre || '',
          created_at: row.created_at || '',
          updated_at: row.updated_at || '',
          uen: c.uen || '',
          canal: c.canal || '',
          id_gis: c.id_gis || '',
          row_id: c.row_id || '',
          usuario: c.usuario || '',
          concepto: c.concepto || '',
          megagold: c.megagold || '',
          producto: c.producto || '',
          regional: c.regional || '',
          direccion: c.direccion || '',
          documento: c.documento || '',
          municipio: c.municipio || '',
          pedido_id: c.pedido_id || '',
          comentario: c.comentario || '',
          paginacion: c.paginacion || '',
          pedido_crm: c.pedido_crm || '',
          tecnologia: c.tecnologia || '',
          concepto_id: c.concepto_id || '',
          descripcion: c.descripcion || '',
          responsable: c.responsable || '',
          departamento: c.departamento || '',
          fecha_creado: c.fecha_creado || '',
          fecha_estado: c.fecha_estado || '',
          tipo_scoring: c.tipo_scoring || '',
          tipo_trabajo: c.tipo_trabajo || '',
          disponibilidad: c.disponibilidad || '',
          estado_scoring: c.estado_scoring || '',
          fecha_pendiente: c.fecha_pendiente || '',
          estado_direccion: c.estado_direccion || '',
          estado_pendiente: c.estado_pendiente || '',
          concepto_internet: c.concepto_internet || '',
          concepto_original: c.concepto_original || '',
          usuario_pendiente: c.usuario_pendiente || '',
          estado_estudio_legal: c.estado_estudio_legal || '',
          validacion_anulacion: c.validacion_anulacion || '',
          tipo_transaccion_internet: c.tipo_transaccion_internet || '',
          tipo_transaccion_telefonia: c.tipo_transaccion_telefonia || '',
          tipo_transaccion_television: c.tipo_transaccion_television || '',
          validacion_anulacion_direccion: c.validacion_anulacion_direccion || ''
        };
      });

      downloadCSV(dataToExport, `Pedidos_Abiertos_${new Date().toISOString().split('T')[0]}`);
      success('Informe generado y descargado correctamente');
    } catch (err) {
      console.error("Error al exportar:", err);
      error('Ocurrió un error al intentar generar el archivo');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {(loading || isExporting) && (
        <Loading 
          fullScreen 
          text={isExporting ? "Obteniendo registros en lotes de 1000..." : "Cargando pedidos abiertos..."} 
        />
      )}
      
      <div className="d-flex justify-content-end mb-3 align-items-center">
        <button 
          className="btn btn-outline-primary d-flex align-items-center shadow-sm"
          onClick={handleExportAll}
          disabled={total === 0 || isExporting}
        >
          <Icon name="download" size="lg" className='me-2'/>
          <span>Exportar</span>
        </button>
      </div>

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