import { useState } from "react";

export default function SolicitarTurnoForm({ cliente, tratamientos }) {
  const [formData, setFormData] = useState({
    tratamiento_id: '',
    fecha: '',
    hora: ''
  });
  const [enviado, setEnviado] = useState(false);

  const diasDisponibles = [1, 3, 4, 5, 6]; // Lun, Mie, Jue, Vie, Sab
  const horariosManiana = ['07:00', '08:00', '09:00', '10:00', '11:00'];
  const horariosTarde = ['13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFechaMinima = () => {
    const hoy = new Date();
    let siguienteDia = new Date(hoy);
    siguienteDia.setDate(hoy.getDate() + 1);
    
    while (!diasDisponibles.includes(siguienteDia.getDay())) {
      siguienteDia.setDate(siguienteDia.getDate() + 1);
    }
    
    return siguienteDia.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tratamiento = tratamientos.find(t => t.id === parseInt(formData.tratamiento_id));
    const fechaFormateada = new Date(formData.fecha).toLocaleDateString('es-AR');
    
    const mensaje = `¡Hola! Quiero reservar un turno:%0A%0A👤 Nombre: ${cliente.nombre}%0A📅 Fecha: ${fechaFormateada}%0A🕐 Horario: ${formData.hora}%0A💆 Servicio: ${tratamiento?.nombre || 'Por confirmar'}`;
    
    window.open(`https://wa.me/543388673804?text=${mensaje}`, '_blank');
    setEnviado(true);
  };

  const handleReset = () => {
    setFormData({ tratamiento_id: '', fecha: '', hora: '' });
    setEnviado(false);
  };

  if (enviado) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>✅ ¡Solicitud Enviada!</h2>
          <p className="card-subtitle">Te contactaremos para confirmar tu turno</p>
        </div>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱</div>
          <h3>¡Tu solicitud fue enviada por WhatsApp!</h3>
          <p style={{ marginTop: '15px', color: 'var(--gray)' }}>
            Te contactaremos pronto para confirmar tu turno.
          </p>
          <p style={{ marginTop: '10px', color: 'var(--gray)' }}>
            También podés editar o cancelar tu turno desde "Mis Turnos"
          </p>
          <div style={{ marginTop: '25px' }}>
            <button onClick={handleReset} className="btn-secondary">
              Solicitar otro turno
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>📅 Solicitar Turno</h2>
        <p className="card-subtitle">Completá los datos y te contactaremos</p>
      </div>

      <form onSubmit={handleSubmit} className="form-modern" style={{ padding: '20px' }}>
        <div className="form-group">
          <label>
            <span className="label-icon">💆</span>
            Servicio
          </label>
          <select
            name="tratamiento_id"
            value={formData.tratamiento_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Seleccionar servicio</option>
            {tratamientos.map(t => (
              <option key={t.id} value={t.id}>
                {t.nombre} {parseFloat(t.precio) > 0 ? `- $${parseFloat(t.precio).toLocaleString('es-AR')}` : '- Consultar'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="label-icon">📅</span>
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="form-control"
              min={getFechaMinima()}
              required
            />
            <small className="form-hint">Lunes a Sábado (no trabajamos Martes)</small>
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🕐</span>
              Horario
            </label>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="form-control"
              required
              disabled={!formData.fecha}
            >
              <option value="">Seleccionar horario</option>
              <optgroup label="Mañana">
                {horariosManiana.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </optgroup>
              <optgroup label="Tarde">
                {horariosTarde.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </optgroup>
            </select>
            <small className="form-hint">7:00-12:00 | 13:30-21:00</small>
          </div>
        </div>

        {formData.tratamiento_id && formData.fecha && formData.hora && (
          <div style={{ 
            background: 'var(--light)', 
            padding: '20px', 
            borderRadius: '12px',
            marginTop: '10px'
          }}>
            <h4 style={{ marginBottom: '10px' }}>📋 Resumen de tu solicitud:</h4>
            <p><strong>👤 Cliente:</strong> {cliente.nombre}</p>
            <p><strong>💆 Servicio:</strong> {tratamientos.find(t => t.id === parseInt(formData.tratamiento_id))?.nombre}</p>
            <p><strong>📅 Fecha:</strong> {new Date(formData.fecha).toLocaleDateString('es-AR')}</p>
            <p><strong>🕐 Horario:</strong> {formData.hora}</p>
          </div>
        )}

        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            className="btn-primary btn-large"
            disabled={!formData.tratamiento_id || !formData.fecha || !formData.hora}
          >
            📱 Enviar por WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
