import { useState, useEffect } from 'react';
import { PauseService, type PauseSettings } from '@/api/services/PauseService';
import { useToast } from '@/context/ToastContext';
import { Icon } from '@/icons/Icon';
import Loading from '@/components/Loading';

export default function PauseSettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<PauseSettings>({
    tiempo_minimo_pausa_minutos: 0,
    max_ofertas_pausadas_por_asesor: 0
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await PauseService.getPauseSettings();
      setSettings(res.data);
    } catch (err) {
      error("No se pudo obtener la configuración de pausas");
    } finally {
      setLoading(false);
    }
  };

  const handleStep = (field: keyof PauseSettings, delta: number) => {
    setSettings(prev => ({
      ...prev,
      [field]: Math.max(1, (Number(prev[field]) || 0) + delta)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await PauseService.updatePauseSettings(settings);
      success("Parámetros de pausa actualizados correctamente");
      fetchSettings();
    } catch (err) {
      error("Error al guardar la configuración");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen text="Cargando parámetros de configuración..." />;

  return (
    <div className="container py-4">
      <header className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h3 font-dm-bold mb-0">Configuración de parámetros para pausa de pedidos</h1>
        </div>
        <Icon name="settings" size="xl" />
      </header>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 position-relative">
              {isSubmitting && <Loading fullScreen text="Guardando..."/>}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  {/* Input 1: Tiempo Mínimo */}
                  <div className="col-md-6">
                    <label className="form-label font-dm-bold mb-1">Tiempo mínimo de pausa</label>
                    <p className="text-muted mb-3">Minutos requeridos para permitir pausar.</p>
                    <div className="input-group shadow-sm border rounded">
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        onClick={() => handleStep('tiempo_minimo_pausa_minutos', -1)}
                      >
                        <Icon name="minus" size="xl" />
                      </button>
                      <input
                        type="number"
                        className="form-control border-0 text-center bg-white"
                        value={settings.tiempo_minimo_pausa_minutos}
                        onChange={e => setSettings({...settings, tiempo_minimo_pausa_minutos: parseInt(e.target.value) || 0})}
                        min="1"
                        required
                      />
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        onClick={() => handleStep('tiempo_minimo_pausa_minutos', 1)}
                      >
                        <Icon name="plus" size="xl" />
                      </button>
                    </div>
                  </div>

                  {/* Input 2: Límite por Asesor */}
                  <div className="col-md-6">
                    <label className="form-label font-dm-bold mb-1">Límite por asesor</label>
                    <p className="text-muted mb-3">Máximo de casos pausados simultáneamente.</p>
                    <div className="input-group shadow-sm border rounded">
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        onClick={() => handleStep('max_ofertas_pausadas_por_asesor', -1)}
                      >
                        <Icon name="minus" size="xl" />
                      </button>
                      <input
                        type="number"
                        className="form-control border-0 text-center bg-white"
                        value={settings.max_ofertas_pausadas_por_asesor}
                        onChange={e => setSettings({...settings, max_ofertas_pausadas_por_asesor: parseInt(e.target.value) || 0})}
                        min="1"
                        required
                      />
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        onClick={() => handleStep('max_ofertas_pausadas_por_asesor', 1)}
                      >
                        <Icon name="plus" size="xl" />
                      </button>
                    </div>
                  </div>

                  <div className="col-12 mt-5 pt-4 border-top d-flex justify-content-end align-items-center">
                    <button type="submit" className="button button-blue shadow-sm" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Procesando... <span className="spinner-border spinner-border-sm ms-2" /></>
                      ) : (
                        <>Guardar Cambios <Icon name="send" size="lg" className="ms-2" /></>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {settings.updated_at && (
              <div className="card-footer bg-light border-0 py-3 px-4 text-center">
                <span className="text-muted ">
                  <Icon name="user" size="xl" className="me-2" />
                  Última actualización: <strong>{settings.updated_by || 'Sistema'}</strong> — {new Date(settings.updated_at).toLocaleString('es-CO')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div className="alert alert-info border-0 shadow-sm p-4">
            <h5 className="font-dm-bold text-info-emphasis">
              <Icon name="megaphone" size="xl" className="me-2" />
              ¿Cómo funcionan estos límites?
            </h5>
            <ul className=" mt-3 mb-0 ps-3">
              <li className="mb-2">El <strong>tiempo mínimo</strong> evita que se pausen ofertas recién abiertas sin una gestión previa.</li>
              <li>El <strong>límite por asesor</strong> asegura que la bandeja de entrada no se sature con casos pausados indefinidamente.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}