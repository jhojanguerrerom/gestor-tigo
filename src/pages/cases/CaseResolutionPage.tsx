/**
 * Shared case resolution view for all roles.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from '@/icons/Icon';
import { actionService } from '@/api/services/actionService';
import { offerService } from '@/api/services/offerService';
import { useToast } from '@/context/ToastContext';
import OrderHistoryModal from '@/pages/cases/OrderHistoryModal';
import Loading from '@/components/Loading';

const INITIAL_FORM_DATA = {
  oferta: '',
  pedido_id: '',
  concepto_id: '',
  concepto: '',
  direccion: '',
  fecha_creado: '',
  segmento: '',
  coordenadas: '',
  pagina: '',
  nodo_id: '',
  megagold: '',
};

const extractFormData = (campos: any = {}) => {
  const lat = campos.latitude;
  const lng = campos.longitude;
  const coordenadasUnidas = lat && lng ? `${lat}, ${lng}` : lat || lng || '';

  return {
    oferta: campos.oferta || '',
    pedido_id: campos.pedido_id || '',
    concepto_id: campos.concepto_id || '',
    concepto: campos.concepto || '',
    direccion: campos.direccion || '',
    fecha_creado: campos.fecha_creado || '',
    segmento: campos.uen || '',
    coordenadas: coordenadasUnidas,
    pagina: campos.paginacion || '',
    nodo_id: campos.nodo_id || '',
    megagold: campos.megagold || '',
  };
};

export default function CaseResolutionPage() {
  const location = useLocation();
  const isMounted = useRef(true);

  // Estados del Formulario
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [acciones, setAcciones] = useState<any[]>([]);
  const [accionAuto, setAccionAuto] = useState(""); 
  const [subacciones, setSubacciones] = useState<any[]>([]);
  const [subaccion, setSubaccion] = useState(""); 
  const [observacion, setObservacion] = useState("");
  
  // Estados Nuevos para los Conceptos
  const [conceptos, setConcepts] = useState<any[]>([]);
  const [selectedConcepto, setSelectedConcepto] = useState("");

  // Estados de UI
  const [copied, setCopied] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const { success, info, error } = useToast();

  // Función para cargar o refrescar los conceptos disponibles
  const fetchConcepts = useCallback(async () => {
    try {
      const res = await offerService.getConcepts();
      if (isMounted.current) {
        setConcepts(res.data || []);
      }
    } catch (err) {
      console.error("Error al cargar conceptos", err);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    setIsPageLoading(true);

    const initData = async () => {
      try {
        await fetchConcepts(); // Cargamos conceptos primero
        const res = await offerService.getMyOffer();
        if (!isMounted.current) return;
        setFormData(extractFormData(res.data.campos_dinamicos));
      } catch (err) {
        if (!isMounted.current) return;
        info('Solicite un pedido para comenzar a gestionar');
        setFormData(INITIAL_FORM_DATA);
      } finally {
        if (isMounted.current) setIsPageLoading(false);
      }
    };

    initData();
    return () => {
      isMounted.current = false;
    };
  }, [location.pathname, location.key, info, fetchConcepts]);

  // Cargar acciones
  useEffect(() => {
    actionService.getActionsWithSubactions()
      .then((res: any) => {
        const data = res.data || [];
        const accionesActivas = data
          .filter((a: any) => a.is_active)
          .map((a: any) => ({
            ...a,
            subacciones: (a.subacciones || []).filter((s: any) => s.is_active)
          }));
        setAcciones(accionesActivas);
      });
  }, []);

  // Actualizar subacciones al cambiar de acción
  useEffect(() => {
    const accion = acciones.find(a => a.id === accionAuto);
    setSubacciones(accion ? accion.subacciones : []);
    setSubaccion("");
  }, [accionAuto, acciones]);

  const handleDemePedido = () => {
    setIsAssigning(true);
    
    // Armamos el payload. Si seleccionó un concepto, lo enviamos. Si no, mandamos vacío.
    const payload = selectedConcepto ? { concepto: selectedConcepto } : {};

    offerService.freezeOffer(payload)
      .then(res => {
        const campos = res.data.campos_dinamicos || {};
        setFormData(extractFormData(campos));
        info(`Pedido ${campos.oferta || ''} asignado exitosamente`);
        fetchConcepts(); // Refrescamos las cantidades después de tomar un caso
      })
      .catch(() => error('No se pudo asignar pedido. Intente con otro concepto o aleatorio.'))
      .finally(() => setIsAssigning(false));
  };

  const handleCopy = () => {
    const accionNombre = acciones.find(a => a.id === accionAuto)?.nombre;
    const subaccionNombre = subacciones.find(s => s.id === subaccion)?.nombre;
    const texto = `Gestión: ${accionNombre} / Tipificación: ${subaccionNombre} / Observación: ${observacion}`;
    
    if (observacion.trim() && accionNombre && subaccionNombre) {
      navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      info('Texto copiado en el portapapeles');
    } else {
      error('Complete la información antes de copiar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accionAuto || !subaccion || !observacion) {
      error('Acción, Subacción y Observación son campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      oferta: formData.oferta,
      accion_id: accionAuto,
      subaccion_id: subaccion,
      observacion: observacion,
    };

    try {
      await offerService.manageOffer(payload);
      success(`Pedido ${payload.oferta} cerrado exitosamente`);
      
      // LIMPIEZA TOTAL DE ESTADOS
      setFormData(INITIAL_FORM_DATA);
      setAccionAuto("");
      setSubaccion("");
      setObservacion("");
      setSelectedConcepto(""); // <-- AQUÍ ESTÁ LA MAGIA (Devuelve el select a Aleatorio)
      
      fetchConcepts(); // Refrescamos las cantidades
    } catch (err) {
      console.error("Error al gestionar el pedido:", err);
      try {
        await offerService.getMyOffer();
        error('Ocurrió un error al enviar. Por favor, intente de nuevo');
      } catch (verifyErr) {
        error('El pedido ya no se encuentra asignado');
        
        // LIMPIEZA TOTAL DE ESTADOS
        setFormData(INITIAL_FORM_DATA);
        setAccionAuto("");
        setSubaccion("");
        setObservacion("");
        setSelectedConcepto(""); // <-- AQUÍ TAMBIÉN
        
        fetchConcepts();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-4">
      {isPageLoading && <Loading fullScreen text="Cargando información..." />}
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Pedidos de trabajo</h1>
        <p className="text-body-secondary mb-0">
          Espacio de trabajo para la gestión de pedidos.
        </p>
      </header>
      
      <div className="row">
        <div className="col-md-3">
          <div 
            className={`card shadow-sm mb-4 ${formData.oferta ? 'opacity-50' : ''}`} 
            style={formData.oferta ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
          >
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div>
                  <h2 className="h5 mb-1">Asignación de trabajo</h2>
                  <p className="text-body-secondary mb-0">
                    Selecciona el tipo de servicio o ingresa el ID de forma manual.
                  </p>
                </div>

                <div className="row g-3 align-items-end">
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="TipoServicio">
                      Conceptos disponibles
                    </label>
                    <select 
                      className="form-select" 
                      id="TipoServicio" 
                      disabled={!!formData.oferta || isAssigning}
                      value={selectedConcepto}
                      onChange={(e) => setSelectedConcepto(e.target.value)}
                    >
                      <option value="">Cualquiera (Aleatorio)</option>
                      {conceptos.map((c) => (
                        <option key={c.concepto} value={c.concepto}>
                          {c.concepto} ({c.cantidad})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="user-call" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                      onClick={handleDemePedido}
                      disabled={!!formData.oferta || isAssigning}
                    >
                      {isAssigning ? (
                        <>
                          Asignando...
                          <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                        </>
                      ) : (
                        'Deme pedido'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h2 className="h5 mb-1">Detalle:</h2>
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-md-end align-items-center">
                  {formData.oferta && (
                    <>
                      <button
                        className="button button-gray button-small"
                        type="button"
                        onClick={() => setIsHistoryOpen(true)}
                      >
                        Ver historico de pedido
                      </button>
                      <Icon name="look-for" size="md" className="ms-1 align-bottom" />
                    </>
                  )}
                </div>
              </div>

              <form className="row g-3" onSubmit={handleSubmit}>
                  {/* CAMPOS DE SOLO LECTURA */}
                  <div className="col-md-3">
                    <label className="form-label">Oferta Siebel</label>
                    <input className="form-control" type="text" value={formData.oferta || '-'} disabled />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Pedido Fenix</label>
                    <input className="form-control" type="text" value={formData.pedido_id || '-'} disabled />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Concepto o cola</label>
                    <input className="form-control" type="text" value={formData.concepto_id || formData.concepto || '-'} disabled />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Segmento</label>
                    <input className="form-control" type="text" value={formData.segmento || '-'} disabled />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">Dirección</label>
                    <input className="form-control" type="text" value={formData.direccion || '-'} disabled />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Página</label>
                    <input className="form-control" type="text" value={formData.pagina || '-'} disabled />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Coordenadas (latitud y longitud)</label>
                    <input className="form-control" type="text" value={formData.coordenadas || '-'} disabled />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Nodo ID TAP</label>
                    <input className="form-control" type="text" value={formData.nodo_id || '-'} disabled />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Megagold</label>
                    <input className="form-control" type="text" value={formData.megagold || '-'} disabled />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Fecha y hora de ingreso</label>
                    <input className="form-control" type="text" value={formData.fecha_creado ? new Date(formData.fecha_creado).toLocaleString('es-CO') : '-'} disabled />
                  </div>

                  {/* FORMULARIO DE GESTIÓN */}
                  <div className="col-md-2">
                    <label className="form-label" htmlFor="Accion">Acción*</label>
                    <select className="form-select" id="Accion" value={accionAuto} onChange={e => setAccionAuto(e.target.value)} disabled={!formData.oferta} required>
                      <option value="">Seleccionar</option>
                      {acciones.map((accion) => (
                        <option key={accion.id} value={accion.id}>{accion.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="SubAccion">Subacción*</label>
                    <select className="form-select" id="SubAccion" value={subaccion} onChange={e => setSubaccion(e.target.value)} disabled={!accionAuto} required>
                      <option value="">Seleccionar</option>
                      {subacciones.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label" htmlFor="Observacion">Observación*</label>
                    <textarea className="form-control" id="Observacion" rows={4} value={observacion} onChange={e => setObservacion(e.target.value)} disabled={!formData.oferta} required />
                  </div>
                  
                  <div className="col-12 d-flex justify-content-between align-items-center gap-2">
                    <div>
                      <button className="button button-gray button-small" type="button" onClick={handleCopy} title="Copiar acción/subacción/observación" disabled={!formData.oferta}>
                        Copiar texto
                        <Icon name="copy" size="md" className="ms-2" />
                      </button>
                    </div>
                    
                    <button className="button button-blue" type="submit" disabled={isSubmitting || !formData.oferta}>
                      {isSubmitting ? (
                        <>Procesando... <span className="spinner-border spinner-border-sm ms-3" role="status" aria-hidden="true"></span></>
                      ) : (
                        <>Enviar <Icon name="send" size="lg" className="ms-3" /></>
                      )}
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        ofertaId={formData.oferta}
      />
    </section>
  )
}