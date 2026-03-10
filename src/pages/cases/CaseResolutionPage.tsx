/**
 * Shared case resolution view for all roles.
 */
import { useState, useRef, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Icon } from '@/icons/Icon';
import { actionService } from '@/api/services/actionService';
import { offerService } from '@/api/services/offerService';

export default function CaseResolutionPage() {
  const location = useLocation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    const fetchOffer = async () => {
      try {
        const res = await offerService.getMyOffer();
        if (!isMounted.current) return;
        const campos = res.data.campos_dinamicos || {};
        setFormData(prev => ({
          ...prev,
          oferta: campos.oferta || '',
          pedido_id: campos.pedido_id || '',
          concepto_id: campos.concepto_id || '',
          concepto: campos.concepto || '',
          direccion: campos.direccion || '',
          fecha_creado: campos.fecha_creado || '',
        }));
        setError('');
      } catch (err) {
        if (!isMounted.current) return;
        setError('No hay caso asignado');
        setFormData(prev => ({
          ...prev,
          oferta: '',
          pedido_id: '',
          concepto_id: '',
          concepto: '',
          direccion: '',
          fecha_creado: '',
        }));
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    fetchOffer();
    return () => {
      isMounted.current = false;
    };
  }, [location.pathname, location.key]);
  // Estado y lógica del form
    const [acciones, setAcciones] = useState<any[]>([]);
    const [accionAuto, setAccionAuto] = useState(""); // id de acción
    const [subacciones, setSubacciones] = useState<any[]>([]);
    const [subaccion, setSubaccion] = useState(""); // id de subacción
    const observacionRef = useRef<HTMLTextAreaElement>(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
      oferta: '',
      pedido_id: '',
      concepto_id: '',
      concepto: '',
      direccion: '',
      fecha_creado: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Handler para "Deme pedido"
    const handleDemePedido = () => {
      setLoading(true);
      offerService.freezeOffer()
        .then(res => {
          const campos = res.data.campos_dinamicos || {};
          setFormData({
            oferta: campos.oferta || '',
            pedido_id: campos.pedido_id || '',
            concepto_id: campos.concepto_id || '',
            concepto: campos.concepto || '',
            direccion: campos.direccion || '',
            fecha_creado: campos.fecha_creado || '',
          });
          setError(''); // Limpiar error al asignar caso
        })
        .catch(() => setError('No se pudo asignar pedido'))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
      actionService.getActionsWithSubactions()
        .then((res: any) => {
          // Filtrar solo acciones activas y subacciones activas
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

    useEffect(() => {
      // Actualizar subacciones cuando cambia la acción seleccionada
      const accion = acciones.find(a => a.id === accionAuto);
      setSubacciones(accion ? accion.subacciones : []);
      setSubaccion("");
    }, [accionAuto, acciones]);

  const handleCopy = () => {
      const observacion = observacionRef.current?.value || "";
      const accionNombre = acciones.find(a => a.id === accionAuto)?.nombre || "";
      const subaccionNombre = subacciones.find(s => s.id === subaccion)?.nombre || "";
      const texto = [accionNombre, subaccionNombre, observacion].filter(Boolean).join(" / ");
      if (texto) {
        navigator.clipboard.writeText(texto);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
  };

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
          <span className="ms-2">Cargando oferta...</span>
        </div>
      )}
      <div className="row">
        <div className="col-md-3">
          <div className={`card shadow-sm mb-4 ${formData.oferta ? 'opacity-50' : ''}`} style={formData.oferta ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}>
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
                      {/* ...existing code... */}
                    </select>
                  </div>

                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="user-call" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                      onClick={handleDemePedido}
                      disabled={!!formData.oferta || loading}
                      style={!!formData.oferta || loading ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                  <hr className="my-4"/>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-body">
              {formData.oferta ? (
                <span className="badge bg-warning text-dark mb-3" style={{position: 'relative', zIndex: 2}}>Caso en gestión</span>
              ) : error ? (
                <span className="badge bg-danger text-light mb-3" style={{position: 'relative', zIndex: 2}}>{error}</span>
              ) : null}
              {/* <div className="mb-3">
                <h2 className="h5 mb-1">Detalle:</h2>
              </div> */}

              <form className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="OfertaSiebel">
                      Oferta Siebel
                    </label>
                    <input className="form-control" id="OfertaSiebel" type="text" value={formData.oferta} disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="PedidoFenix">
                      Pedido Fenix
                    </label>
                    <input className="form-control" id="PedidoFenix" type="text" value={formData.pedido_id} disabled />
                  </div>
                   <div className="col-md-3">
                    <label className="form-label" htmlFor="ConceptoCola">
                      Concepto o cola
                    </label>
                      <input className="form-control" id="ConceptoCola" type="text" value={formData.concepto_id ? formData.concepto_id : formData.concepto} disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Segmento">
                      Segmento
                    </label>
                    <input className="form-control" id="Segmento" type="text" disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Direccion">
                      Dirección
                    </label>
                    <input className="form-control" id="Direccion" type="text" value={formData.direccion} disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Coordenadas">
                      Coordenadas
                    </label>
                    <input className="form-control" id="Coordenadas" type="text" disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Pagina">
                      Página
                    </label>
                    <input className="form-control" id="Pagina" type="text" disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="NodoIdTap">
                      Nodo ID TAP
                    </label>
                    <input className="form-control" id="NodoIdTap" type="text" disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Megagold">
                      Megagold
                    </label>
                    <input className="form-control" id="Megagold" type="text" disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="FechaIngreso">
                      Fecha y hora de ingreso
                    </label>
                    <input className="form-control" id="FechaIngreso" type="text" value={formData.fecha_creado} disabled />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Accion">
                      Acción
                    </label>
                    <select
                      className="form-select"
                      id="Accion"
                      value={accionAuto}
                      onChange={event => setAccionAuto(event.target.value)}
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
                      Subacción
                    </label>
                    <select
                      className="form-select"
                      id="SubAccion"
                      value={subaccion}
                      onChange={e => setSubaccion(e.target.value)}
                      disabled={!accionAuto}
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
                      Observación
                    </label>
                    <textarea className="form-control" id="Observacion" rows={4} ref={observacionRef} />
                  </div>
                  <div className="col-12 d-flex justify-content-between align-items-center gap-2">
                    <div>
                      <button
                        className="button button-outline-blue"
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
                    <button className="button button-blue" type="button">
                      Enviar
                      <Icon name="send" size="lg" className="ms-3" />
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
