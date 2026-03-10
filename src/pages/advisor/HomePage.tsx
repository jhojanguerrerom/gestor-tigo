import { useState, useEffect } from 'react';
import { offerService } from '@/api/services/offerService';
import { Icon } from '@/icons/Icon';

export default function AdvisorHomePage() {
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

  // Cargar datos iniciales si el usuario tiene caso asignado
  useEffect(() => {
    setLoading(true);
    offerService.getMyOffer()
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
      })
      .catch(() => setError('No hay caso asignado'))
      .finally(() => setLoading(false));
  }, []);

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
      })
      .catch(() => setError('No se pudo asignar pedido'))
      .finally(() => setLoading(false));
  };

  return (
    <section className="container py-4">
      <header className="mb-4">
        <h1 className="h3 font-dm-bold mb-2">Gestión de pedidos</h1>
        <p className="text-body-secondary mb-0">Formulario de asignación de pedidos.</p>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <button
                  className="button button-blue w-100 mb-3"
                  type="button"
                  onClick={handleDemePedido}
                  disabled={loading}
                >
                  <Icon name="user-call" size="xl" className="me-2" />
                  Deme pedido
                </button>
                <form className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="OfertaSiebel">Oferta Siebel</label>
                    <input className="form-control" id="OfertaSiebel" type="text" value={formData.oferta} disabled />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="PedidoFenix">Pedido Fenix</label>
                    <input className="form-control" id="PedidoFenix" type="text" value={formData.pedido_id} disabled />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="ConceptoCola">Concepto o cola</label>
                    <input className="form-control" id="ConceptoCola" type="text" value={formData.concepto_id || formData.concepto} disabled />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="Direccion">Dirección</label>
                    <input className="form-control" id="Direccion" type="text" value={formData.direccion} disabled />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="FechaIngreso">Fecha de ingreso</label>
                    <input className="form-control" id="FechaIngreso" type="text" value={formData.fecha_creado} disabled />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
