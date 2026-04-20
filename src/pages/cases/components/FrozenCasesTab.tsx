import { useMemo, useState, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { useToast } from '@/context/ToastContext';

// Interfaz para los datos estáticos de prueba
interface FrozenCase {
  id: string;
  oferta: string;
  pedido_id: string;
  fecha_congelado: string;
}

export default function FrozenCasesTab({ }: { refreshKey: number }) {
  const { success, error } = useToast();
  
  // Estado para el buscador (Requerido por tu DataTable)
  const [searchQuery, setSearchQuery] = useState('');

  // Datos estáticos de prueba mientras se desarrollan los endpoints
  const [data, setData] = useState<FrozenCase[]>([
    { id: '1', oferta: 'OFR-123', pedido_id: 'PED-999', fecha_congelado: '2024-03-10T10:00:00' },
    { id: '2', oferta: 'OFR-456', pedido_id: 'PED-888', fecha_congelado: '2024-03-11T14:30:00' },
    { id: '3', oferta: 'OFR-789', pedido_id: 'PED-777', fecha_congelado: '2024-03-12T09:15:00' },
  ]);

  // Función para simular el descongelado localmente
  const handleUnfreeze = useCallback(async (ofertaId: string) => {
    try {
      // Simulación de delay de API
      // await enlistmentService.unfreeze(ofertaId); 
      
      setData(prev => prev.filter(item => item.oferta !== ofertaId));
      success(`Caso ${ofertaId} descongelado correctamente (Simulado)`);
    } catch (e) {
      error("Error al descongelar el caso");
    }
  }, [success, error]);

  // Definición de columnas
  const columns = useMemo(() => [
    { header: 'Oferta' },
    { header: 'Pedido' },
    { header: 'Fecha Congelado' },
    { header: 'Acciones' }
  ], []);

  // Función para el buscador local (indica por qué campos filtrar)
  const getSearchText = useCallback((row: FrozenCase) => {
    return `${row.oferta} ${row.pedido_id}`;
  }, []);

  return (
    <DataTable
      rows={data}
      columns={columns}
      tableId="frozenTable"
      // Props de búsqueda (Obligatorias según tu interfaz)
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      getSearchText={getSearchText}
      // Paginación local (Tu componente la maneja si no pasas currentPage/total)
      pageSize={10}
      renderRow={(row: FrozenCase) => (
        <tr key={row.id}>
          <td>
            <span className="fw-bold text-primary">{row.oferta}</span>
          </td>
          <td>{row.pedido_id}</td>
          <td>
            <span className="small">
              {new Date(row.fecha_congelado).toLocaleString('es-CO')}
            </span>
          </td>
          <td>
            <button 
              className="badge rounded-pill text-bg-bluelight border-0 p-2"
              onClick={() => handleUnfreeze(row.oferta)}
              title="Mover a bandeja de entrada"
            >
              <span>Descongelar</span>
            </button>
          </td>
        </tr>
      )}
    />
  );
}