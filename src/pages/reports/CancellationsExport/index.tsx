import React, { useState, useCallback } from 'react';
import { reportService } from '../../../api/services/reportService';
import { useToast } from '../../../context/ToastContext';
import { downloadExcel } from '../../../utils/downloadExcel';
import { Icon } from '@/icons/Icon';

const CancellationsExport: React.FC = () => {
  // --- ESTADO ---
  const [loading, setLoading] = useState(false);
  const [daysBack, setDaysBack] = useState<number | ''>('');
  // 🟢 Extraemos 'info' del contexto de Toasts
  const { success, error, warning, info } = useToast();

  // --- HANDLERS ---
  const handleStep = (delta: number) => {
    const current = daysBack === '' ? 0 : daysBack;
    const nextValue = current + delta;

    // Controlar el límite inferior nativo
    if (nextValue < 1) {
      setDaysBack(1);
      return;
    }

    if (nextValue > 30) {
      warning('El límite máximo permitido para este reporte es de 30 días');
      setDaysBack(30);
      return;
    }

    setDaysBack(nextValue);
  };

  const handleExport = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🟢 1. Validación cuando el campo está totalmente vacío (Lanza Toast Info)
    if (daysBack === '') {
      info('Debe ingresar la cantidad de días para generar el reporte');
      return;
    }

    // 2. Validación si ingresa manualmente un número menor a 1 (Lanza Toast Danger)
    if (daysBack < 1) {
      error('Por favor, ingresa un número de días válido');
      return;
    }

    // 3. Validación si es mayor a 30 (Lanza Toast Warning)
    if (daysBack > 30) {
      warning('El límite máximo permitido para este reporte es de 30 días');
      return;
    }
    
    setLoading(true);
    try {
      const response = await reportService.exportCancellations(daysBack);

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const rows = text.split(/\r?\n/).filter(Boolean);
        
        if (rows.length <= 1) {
          error('El reporte no contiene registros para el rango de días seleccionado');
          return;
        }

        const headers = rows[0].split(',').map(header => header.trim());

        const data = rows.slice(1).map(row => {
          const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const obj: Record<string, string> = {};
          
          headers.forEach((header, i) => {
            let val = values[i]?.trim() || '';
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1).trim();
            }
            obj[header] = val;
          });
          return obj;
        });

        downloadExcel(data, `cancelaciones_${daysBack}_dias`);
        success('¡Reporte generado y descargado con éxito!');
      };
      
      reader.readAsText(response.data);
    } catch (err: any) {
      const mensajeError = err?.response?.data?.message || 'Error al conectar con el servidor de reportes';
      error(mensajeError);
    } finally {
      setLoading(false);
    }
  }, [daysBack, success, error, warning, info]);

  return (
    <div className="container py-4">
      {/* Encabezado Principal */}
      <header className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h3 font-dm-bold mb-0">Informe de cancelaciones</h1>
        </div>
        <Icon name="settings" size="xl" />
      </header>

      <div className="row">
        {/* Columna del Formulario */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 position-relative">
              
              <form onSubmit={handleExport}>
                <div className="row g-4">
                  
                  {/* Campo de control de rango de días */}
                  <div className="col-md-12">
                    <label className="form-label font-dm-bold mb-1">Rango de días hacia atrás</label>
                    <p className="text-muted mb-3">Establece la cantidad de días hacia atrás para consultar las cancelaciones (Máximo 30 días).</p>
                    
                    <div className="input-group shadow-sm border rounded">
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        disabled={loading}
                        onClick={() => handleStep(-1)}
                      >
                        <Icon name="minus" size="xl" />
                      </button>
                      <input
                        type="number"
                        className="form-control border-0 text-center bg-white"
                        value={daysBack}
                        disabled={loading}
                        onChange={e => {
                          const val = e.target.value;
                          setDaysBack(val === '' ? '' : parseInt(val));
                        }}
                        min="1"
                        // 🟢 Removido 'required' para evitar que HTML5 intercepte el submit antes que nuestro Toast Info
                      />
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        disabled={loading}
                        onClick={() => handleStep(1)}
                      >
                        <Icon name="plus" size="xl" />
                      </button>
                    </div>
                  </div>

                  {/* Acciones del Formulario */}
                  <div className="col-12 mt-4 pt-4 border-top d-flex justify-content-end align-items-center">
                    <button 
                      type="submit" 
                      className="button button-blue shadow-sm" 
                      disabled={loading} 
                      // 🟢 Removido 'daysBack === ""' para permitir el clic y detonar el flujo del Toast Info
                    >
                      {loading ? (
                        <>
                          Procesando... 
                          <span className="spinner-border spinner-border-sm ms-2" />
                        </>
                      ) : (
                        <>
                          Descargar reporte 
                          <Icon name="send" size="lg" className="ms-2" />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </div>

        {/* Panel Informativo Lateral */}
        <div className="col-12 col-lg-6 mt-4 mt-lg-0">
          <div className="alert alert-info border-0 shadow-sm p-4">
            <h5 className="font-dm-bold text-info-emphasis">
              <Icon name="megaphone" size="xl" className="me-2" />
              Estructura del informe
            </h5>
            <p className="mt-3 text-secondary small">
              Al ejecutar la descarga, el sistema generará el reporte de cancelaciones donde estarán listados los conceptos:
            </p>
            <ul className="mt-2 mb-0 ps-3 small text-secondary">
              <li className="mb-2">ANULA.</li>
              <li className="mb-2">ANULA-C.</li>
              <li className="mb-2">ANULA-D.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationsExport;