/**
 * Shared case resolution view for all roles.
 */
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from '@/icons/Icon';
import { actionService } from '@/api/services/actionService';
import { offerService } from '@/api/services/offerService';
//import { offerManagementService } from '@/api/services/offerManagementService';
import { useToast } from '@/context/ToastContext';
import OrderHistoryModal from '@/pages/cases/OrderHistoryModal';

const INITIAL_FORM_DATA = {
  oferta: '',
  pedido_id: '',
  concepto_id: '',
  concepto: '',
  direccion: '',
  fecha_creado: '',
};

const extractFormData = (campos: any = {}) => ({
  oferta: campos.oferta || '',
  pedido_id: campos.pedido_id || '',
  concepto_id: campos.concepto_id || '',
  concepto: campos.concepto || '',
  direccion: campos.direccion || '',
  fecha_creado: campos.fecha_creado || '',
});

export default function CaseResolutionPage() {
  const location = useLocation();
  const isMounted = useRef(true);

  // Estados
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [acciones, setAcciones] = useState<any[]>([]);
  const [accionAuto, setAccionAuto] = useState(""); 
  const [subacciones, setSubacciones] = useState<any[]>([]);
  const [subaccion, setSubaccion] = useState(""); 
  const [observacion, setObservacion] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const { success, info, error } = useToast();

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);

    const fetchOffer = async () => {
      try {
        const res = await offerService.getMyOffer();
        if (!isMounted.current) return;
        setFormData(extractFormData(res.data.campos_dinamicos));
      } catch (err) {
        if (!isMounted.current) return;
        info('Solicite un pedido para comenzar a gestionar', 'Sin pedido asignado');
        setFormData(INITIAL_FORM_DATA);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchOffer();
    return () => {
      isMounted.current = false;
    };
  }, [location.pathname, location.key, info]);

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
    setLoading(true);
    offerService.freezeOffer()
      .then(res => {
        const campos = res.data.campos_dinamicos || {};
        setFormData(extractFormData(campos));
        info(`Pedido ${campos.oferta || ''} asignado exitosamente`);
      })
      .catch(() => error('No se pudo asignar pedido'))
      .finally(() => setLoading(false));
  };

  const handleCopy = () => {
    const accionNombre = acciones.find(a => a.id === accionAuto)?.nombre || "";
    const subaccionNombre = subacciones.find(s => s.id === subaccion)?.nombre || "";
    const texto = [accionNombre, subaccionNombre, observacion].filter(Boolean).join(" / ");
    
    if (texto) {
      navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accionAuto || !subaccion || !observacion) {
      error('Acción, Subacción y Observación son campos requeridos.');
      return;
    }

    setLoading(true);
    const payload = {
      oferta: formData.oferta,
      accion_id: accionAuto,
      subaccion_id: subaccion,
      observacion: observacion,
    };

    try {
      // 1. Intentamos enviar la gestión
      await offerService.manageOffer(payload);
      
      // Si funciona, mostramos éxito y limpiamos todo
      success(`Pedido ${payload.oferta} cerrado exitosamente.`);
      setFormData(INITIAL_FORM_DATA);
      setAccionAuto("");
      setSubaccion("");
      setObservacion("");

    } catch (err) {
      console.error("Error al gestionar el pedido:", err);

      // 2. Si falla, verificamos si el caso SIGUE siendo tuyo en base de datos
      try {
        await offerService.getMyOffer();
        
        // Si responde bien, el caso sigue siendo tuyo. NO borramos lo que escribiste.
        error('Ocurrió un error al enviar, pero el pedido sigue asignado. Por favor, intenta de nuevo');
        
      } catch (verifyErr) {
        // Si falla, significa que te quitaron el caso. AQUÍ SÍ limpiamos la pantalla.
        error('El pedido fue liberado o ya  no se encuentra asignado');
        setFormData(INITIAL_FORM_DATA);
        setAccionAuto("");
        setSubaccion("");
        setObservacion("");
      }

    } finally {
      // 3. Apagamos el botón de carga siempre
      setLoading(false);
    }
  };

  // Configuración de los campos de solo lectura para evitar repetición en el JSX
  const readOnlyFields = [
    { id: 'OfertaSiebel', label: 'Oferta Siebel', value: formData.oferta },
    { id: 'PedidoFenix', label: 'Pedido Fenix', value: formData.pedido_id },
    { id: 'ConceptoCola', label: 'Concepto o cola', value: formData.concepto_id || formData.concepto },
    { id: 'Segmento', label: 'Segmento', value: '' },
    { id: 'Direccion', label: 'Dirección', value: formData.direccion },
    { id: 'Coordenadas', label: 'Coordenadas', value: '' },
    { id: 'Pagina', label: 'Página', value: '' },
    { id: 'NodoIdTap', label: 'Nodo ID TAP', value: '' },
    { id: 'Megagold', label: 'Megagold', value: '' },
    { id: 'FechaIngreso', label: 'Fecha y hora de ingreso', value: formData.fecha_creado ? new Date(formData.fecha_creado).toLocaleString('es-CO') : '' },
  ];

  return (
    <section className="container py-4">
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Pedidos de trabajo</h1>
        <p className="text-body-secondary mb-0">
          Espacio de trabajo para la gestión de pedidos.
        </p>
      </header>
      
      {loading && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
          <span className="ms-2">Cargando...</span>
        </div>
      )}
      
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
                      Conceptos
                    </label>
                    {/* <select className="form-select" id="TipoServicio" disabled={!!formData.oferta} style={formData.oferta ? { cursor: 'not-allowed' } : {}}> */}
                    <select className="form-select" id="TipoServicio" disabled>
                      <option>Seleccionar</option>
                    </select>
                  </div>

                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="user-call" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                      onClick={handleDemePedido}
                      disabled={!!formData.oferta || loading}
                      style={!!formData.oferta || loading ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                    >
                      Deme pedido
                    </button>
                  </div>
                  {/* <hr className="my-4"/>
                  <div className="col-md-12 mt-0">
                    <label className="form-label" htmlFor="oferta">
                      Buscar oferta
                    </label>
                    <input
                      className="form-control"
                      id="oferta"
                      disabled={!!formData.oferta || loading}
                      type="text"
                      placeholder="Ingresar oferta"
                      style={formData.oferta ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                    />
                  </div>
                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="look-for" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                      disabled={!!formData.oferta}
                      style={formData.oferta ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                    >
                      Buscar
                    </button>
                  </div> */}
                  {/* <hr className="my-4"/>
                  <div className="col-md-12 d-flex justify-content-md-end mt-0 mb-2 align-items-center">
                    <Icon name="edit" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                      disabled={!!formData.oferta}
                      style={formData.oferta ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                    >
                      Ingreso manual
                    </button>
                  </div> */}
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
                  {/* Renderizado dinámico de los campos de solo lectura */}
                  {readOnlyFields.map(field => (
                    <div className="col-md-3" key={field.id}>
                      <label className="form-label" htmlFor={field.id}>
                        {field.label}
                      </label>
                      <input 
                        className="form-control" 
                        id={field.id} 
                        type="text" 
                        value={field.value} 
                        disabled 
                      />
                    </div>
                  ))}

                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Accion">
                      Acción*
                    </label>
                    <select
                      className="form-select"
                      id="Accion"
                      value={accionAuto}
                      onChange={e => setAccionAuto(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {acciones.map((accion) => (
                        <option key={accion.id} value={accion.id}>
                          {accion.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="SubAccion">
                      Subacción*
                    </label>
                    <select
                      className="form-select"
                      id="SubAccion"
                      value={subaccion}
                      onChange={e => setSubaccion(e.target.value)}
                      disabled={!accionAuto}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {subacciones.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label" htmlFor="Observacion">
                      Observación*
                    </label>
                    <textarea 
                      className="form-control" 
                      id="Observacion" 
                      rows={4} 
                      value={observacion} 
                      onChange={e => setObservacion(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="col-12 d-flex justify-content-between align-items-center gap-2">
                    <div>
                      <button
                        className="button button-gray button-small"
                        type="button"
                        onClick={handleCopy}
                        title="Copiar acción/subacción/observación"
                      >
                        Copiar texto
                        <Icon name="copy" size="md" className="ms-2" />
                      </button>
                      {copied && (
                        <span className="ms-2 text-success small">¡Copiado!</span>
                      )}
                    </div>
                    <button
                      className="button button-blue"
                      type="submit"
                      disabled={loading || !formData.oferta}
                    >
                      Enviar
                      <Icon name="send" size="lg" className="ms-3" />
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
