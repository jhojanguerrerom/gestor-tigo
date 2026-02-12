import { useState } from "react";
import { Icon } from '@/icons/Icon'

/**
 * Case assignment and resolution form (visual only).
 */
export default function CaseResolutionForm() {
  const [accionAuto, setAccionAuto] = useState("");

  const subaccionesPorAccion: Record<string, string[]> = {
    Asignado: [
      "Se busca elemento con red libre",
      "Se busca elemento con red libre /Dirección Estado E",
      "Se corrige dirección Estado E",
    ],
    Cancelado: [
      "Dirección no existe/errada",
      "Sin cobertura",
      "Red copada",
      "Garantia en el ingreso",
      "Minipoligono",
      "Gpon Extendido",
    ],
    Reconfigurar: ["Cobertura GPON", "Cobertura HFC"],
  };

  return (
    <>
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Pedidos de trabajo</h1>
        <p className="text-body-secondary mb-0">
          Espacio de trabajo para la gestión de pedidos.
        </p>
      </header>

      <div className="row">
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
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
                    <select className="form-select" id="TipoServicio">
                      <option>Seleccionar</option>
                      <option>Opcción A</option>
                      <option>Opción B</option>
                      <option>Opción C</option>
                    </select>
                  </div>

                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="user-call" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                    >
                      Deme pedido
                    </button>
                  </div>
                  <hr className="my-4"/>
                  <div className="col-md-12 mt-0">
                    <label className="form-label" htmlFor="oferta">
                      Buscar oferta
                    </label>
                    <input
                      className="form-control"
                      id="oferta"
                      type="text"
                      placeholder="Ingresar oferta"
                    />
                  </div>
                  <div className="col-md-12 d-flex justify-content-md-end align-items-center">
                    <Icon name="look-for" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
                    >
                      Buscar
                    </button>
                  </div>
                  <hr className="my-4"/>
                  <div className="col-md-12 d-flex justify-content-md-end mt-0 mb-2 align-items-center">
                    <Icon name="edit" size="xl" className="me-2" />
                    <button
                      className="button button-blue w-100"
                      type="button"
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
              <div className="mb-3">
                <h2 className="h5 mb-1">Detalle:</h2>
              </div>

              <form className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="OfertaSiebel">
                      Oferta Siebel
                    </label>
                    <input className="form-control" id="OfertaSiebel" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="PedidoFenix">
                      Pedido Fenix
                    </label>
                    <input className="form-control" id="PedidoFenix" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="ConceptoCola">
                      Concepto o cola
                    </label>
                    <input className="form-control" id="ConceptoCola" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Segmento">
                      Segmento
                    </label>
                    <input className="form-control" id="Segmento" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Direccion">
                      Dirección
                    </label>
                    <input className="form-control" id="Direccion" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Coordenadas">
                      Coordenadas
                    </label>
                    <input className="form-control" id="Coordenadas" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Paginacion">
                      Paginación
                    </label>
                    <input className="form-control" id="Paginacion" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="NodoIdTap">
                      Nodo ID TAP
                    </label>
                    <input className="form-control" id="NodoIdTap" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Megagold">
                      Megagold
                    </label>
                    <input className="form-control" id="Megagold" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="FechaIngreso">
                      Fecha y hora de ingreso
                    </label>
                    <input className="form-control" id="FechaIngreso" type="datetime-local" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="Accion">
                      Acción
                    </label>
                    <select
                      className="form-select"
                      id="Accion"
                      value={accionAuto}
                      onChange={(event) => setAccionAuto(event.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Asignado">Asignado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Reconfigurar">Reconfigurar</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="SubAccion">
                      Subacción
                    </label>
                    <select
                      className="form-select"
                      id="SubAccion"
                      disabled={!accionAuto}
                    >
                      <option value="">Seleccionar</option>
                      {(subaccionesPorAccion[accionAuto] ?? []).map((subaccion) => (
                        <option key={subaccion} value={subaccion}>
                          {subaccion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="Observacion">
                      Observación
                    </label>
                    <textarea className="form-control" id="Observacion" rows={4} />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
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
      
    </>
  )
}
