import React, { useEffect, useState } from 'react';
import { offerConfigService } from '../../../api/services/offerConfigService';
import type { OfferConfigRequest, Concepto } from '../../../api/services/offerConfigService';
import { useToast } from '../../../context/ToastContext';
import Loading from '@/components/Loading';
import { Icon } from '@/icons/Icon';
import OfferConfigHistoryModal from './components/OfferConfigHistoryModal';

const initialForm: OfferConfigRequest = {
  nombre_config: '',
  descripcion: '',
  campo_orden: '',
  direccion_orden: 'ASC',
  filtro_conceptos_tipo: 'TODOS',
  conceptos_seleccionados: [],
  filtro_tipo_trabajo: 'TODOS',
  filtro_regional_tipo: 'TODOS',
  regionales_seleccionadas: [],
};

const OffersConfigPage: React.FC = () => {
  const [form, setForm] = useState<OfferConfigRequest>(initialForm);
  const [conceptosSistema, setConceptosSistema] = useState<Concepto[]>([]);
  const [conceptosDisponibles, setConceptosDisponibles] = useState<Concepto[]>([]);
  const [regionales, setRegionales] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const { error, success } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [configRes, conceptosSis, conceptosDisp, regionalesDisp] = await Promise.all([
          offerConfigService.getConfig(),
          offerConfigService.getConceptosSistema(),
          offerConfigService.getConceptosDisponibles(),
          offerConfigService.getRegionalesDisponibles(),
        ]);
        
        setForm({ ...configRes.data });
        setConceptosSistema(conceptosSis.data || []);
        setConceptosDisponibles(conceptosDisp.data || []);
        setRegionales(regionalesDisp.data || []);
      } catch (e) {
        error('Error al cargar la configuración');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // Creamos una copia base del estado anterior con el nuevo valor del input/select
      const updatedForm = { ...prev, [name]: value };

      // Si el usuario cambia el filtro de conceptos a TODOS, limpiamos su arreglo de selección
      if (name === 'filtro_conceptos_tipo' && value === 'TODOS') {
        updatedForm.conceptos_seleccionados = [];
      }

      // Si el usuario cambia el filtro regional a TODOS, limpiamos su arreglo de selección
      if (name === 'filtro_regional_tipo' && value === 'TODOS') {
        updatedForm.regionales_seleccionadas = [];
      }

      return updatedForm;
    });
  };

  const handleToggleItem = (name: 'conceptos_seleccionados' | 'regionales_seleccionadas', itemValue: string) => {
    setForm((prev) => {
      const currentSelection = prev[name] || [];
      const isSelected = currentSelection.includes(itemValue);
      
      const newSelection = isSelected
        ? currentSelection.filter((val) => val !== itemValue)
        : [...currentSelection, itemValue];
        
      return { ...prev, [name]: newSelection };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await offerConfigService.updateConfig(form);
      success('Configuración actualizada correctamente');
    } catch {
      error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen text="Cargando configuración..." />;

  return (
    <section className="container py-4">
      <header className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h3 font-dm-bold mb-0 text-dark">
            Configuración para entrega de ofertas
          </h1>
          <p className="text-muted small mb-0">Gestiona los parámetros y filtros para la distribución automatizada de ofertas en el sistema.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Icon name="look-for" size="lg" className="me-2" />
          <button
            type="button"
            className="button button-blue"
            onClick={() => setShowHistoryModal(true)}
          >
            <Icon name="history" className="me-2" />
            Ver historial de cambios
          </button>
        </div>
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Nombre de la configuración</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="nombre_config" 
                      value={form.nombre_config} 
                      onChange={handleChange} 
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Descripción</label>
                    <textarea 
                      className="form-control"
                      name="descripcion" 
                      rows={1}
                      value={form.descripcion} 
                      onChange={handleChange} />
                  </div>
                </div>

                <div className="p-3 bg-light rounded border">
                  <h6 className="font-dm-bold text-secondary mb-3 small uppercase tracking-wider">Criterio de ordenación</h6>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-muted">Campo de orden</label>
                      <select className="form-select" name="campo_orden" value={form.campo_orden} onChange={handleChange}>
                        <option value="fecha_creado">Fecha Creado (CRM)</option>
                        <option value="created_at">Fecha Creado (Gestor)</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-muted">Dirección de orden</label>
                      <select className="form-select" name="direccion_orden" value={form.direccion_orden} onChange={handleChange}>
                        <option value="ASC">Ascendente</option>
                        <option value="DESC">Descendente</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Filtro tipo de trabajo</label>
                    <select className="form-select" name="filtro_tipo_trabajo" value={form.filtro_tipo_trabajo} onChange={handleChange}>
                      <option value="TODOS">Todos los tipos</option>
                      <option value="NUEVO">Solo Nuevo</option>
                      <option value="CAMBIO">Solo Cambio</option>
                    </select>
                  </div>
                </div>

                {/* Bloque Conceptos Específicos */}
                <div className="p-3 bg-light rounded border">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Filtro de conceptos</label>
                      <select className="form-select mb-3" name="filtro_conceptos_tipo" value={form.filtro_conceptos_tipo} onChange={handleChange}>
                        <option value="TODOS">Todos los conceptos</option>
                        {/* 🟢 Correcto: Mantiene MASCULINO para conceptos según patrón backend */}
                        <option value="ESPECIFICOS">Filtrar por conceptos específicos</option>
                      </select>

                      {form.filtro_conceptos_tipo === 'ESPECIFICOS' && (
                        <div>
                          <label className="form-label small text-muted d-block mb-2">Haz clic sobre los conceptos para seleccionarlos:</label>
                          <div className="d-flex flex-wrap gap-2 overflow-auto p-2 border bg-white rounded" style={{ maxHeight: '200px' }}>
                            {conceptosDisponibles.map((c) => {
                              const isSelected = form.conceptos_seleccionados?.includes(c.concepto);
                              return (
                                <button
                                  key={c.concepto}
                                  type="button"
                                  className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 transition-all ${
                                    isSelected 
                                      ? 'btn-primary shadow-sm fw-medium' 
                                      : 'btn-outline-secondary text-dark border-secondary-subtle bg-light-subtle'
                                  }`}
                                  onClick={() => handleToggleItem('conceptos_seleccionados', c.concepto)}
                                >
                                  <span>{c.concepto}</span>
                                  <span className={`badge ${isSelected ? 'bg-white text-primary' : 'text-bg-blue'} rounded-pill ms-1`}>
                                    {c.cantidad}
                                  </span>
                                </button>
                              );
                            })}
                            {conceptosDisponibles.length === 0 && (
                              <p className="text-muted small w-100 text-center my-2">No hay conceptos disponibles.</p>
                            )}
                          </div>
                          <div className="form-text text-muted mt-1 small">
                            Seleccionados: <span className="fw-bold text-primary">{form.conceptos_seleccionados?.length || 0}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bloque Regionales Específicas */}
                <div className="p-3 bg-light rounded border">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Filtro regional</label>
                      <select className="form-select mb-3" name="filtro_regional_tipo" value={form.filtro_regional_tipo} onChange={handleChange}>
                        <option value="TODOS">Todas las regionales</option>
                        {/* 🔴 Correcto: Cambiado a FEMENINO para cumplir con el validador estricto de regionales */}
                        <option value="ESPECIFICAS">Filtrar por regionales específicas</option>
                      </select>

                      {form.filtro_regional_tipo === 'ESPECIFICAS' && (
                        <div>
                          <label className="form-label small text-muted d-block mb-2">Haz clic sobre las regionales para seleccionarlas:</label>
                          <div className="d-flex flex-wrap gap-2 overflow-auto p-2 border bg-white rounded" style={{ maxHeight: '160px' }}>
                            {regionales.map((r) => {
                              const isSelected = form.regionales_seleccionadas?.includes(r);
                              return (
                                <button
                                  key={r}
                                  type="button"
                                  className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 transition-all ${
                                    isSelected 
                                      ? 'btn-primary shadow-sm fw-medium' 
                                      : 'btn-outline-secondary text-dark border-secondary-subtle bg-light-subtle'
                                  }`}
                                  onClick={() => handleToggleItem('regionales_seleccionadas', r)}
                                >
                                  <span>{r}</span>
                                </button>
                              );
                            })}
                            {regionales.length === 0 && (
                              <p className="text-muted small w-100 text-center my-2">No hay regionales disponibles.</p>
                            )}
                          </div>
                          <div className="form-text text-muted mt-1 small">
                            Seleccionadas: <span className="fw-bold text-primary">{form.regionales_seleccionadas?.length || 0}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-2 align-items-center">
                  <Icon name="check" size="xl" className="me-2"/> 
                  <button 
                    type="submit" 
                    className="button button-blue"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        Guardar Configuración
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 bg-white">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <h3 className="h5 font-dm-bold text-dark mb-1">
                Conceptos activos en sistema
              </h3>
              <p className="text-muted small mb-0">Totalizadores de ofertas por concepto actualmente:</p>
            </div>
            <div className="card-body p-4">
              <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '520px' }}>
                {conceptosSistema.length === 0 ? (
                  <p className="text-muted text-center py-4 small">No hay conceptos del sistema registrados.</p>
                ) : (
                  <ul className="list-group list-group-flush border-top">
                    {conceptosSistema.map((c) => (
                      <li key={c.concepto} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5">
                        <span className="text-dark small fw-medium text-truncate me-2" title={c.concepto}>
                          {c.concepto}
                        </span>
                        <span className="badge text-bg-blue rounded-pill px-2.5">
                          {c.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OfferConfigHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
    </section>
  );
};

export default OffersConfigPage;