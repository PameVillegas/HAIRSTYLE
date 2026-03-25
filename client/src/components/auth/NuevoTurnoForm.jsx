import { useState, useEffect } from "react";

export default function NuevoTurnoForm({ clientes, tratamientos, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    tratamiento_id: '',
    fecha: '',
    hora: '',
    notas: ''
  });

  const diasDisponibles = [1, 3, 4, 5, 6]; // Lun, Mie, Jue, Vie, Sab
  const diasNombres = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };

  const horariosManiana = ['07:00', '08:00', '09:00', '10:00', '11:00'];
  const horariosTarde = ['13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'];

  useEffect(() => {
    if (formData.fecha) {
      const fechaObj = new Date(formData.fecha);
      const diaSemana = fechaObj.getDay();
      if (diaSemana === 2 || diaSemana === 0) {
        setFormData(prev => ({ ...prev, fecha: '', hora: '' }));
        alert('Los martes y domingos no trabajamos. Por favor elegí otro día.');
      }
    }
  }, [formData.fecha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getFechaMinima = () => {
    const hoy = new Date();
    let siguienteDia = new Date(hoy);
    siguienteDia.setDate(hoy.getDate() + 1);
    
    while (diasDisponibles.includes(siguienteDia.getDay()) === false) {
      siguienteDia.setDate(siguienteDia.getDate() + 1);
    }
    
    return siguienteDia.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📅 Solicitar Nuevo Turno</h2>
        <p className="card-subtitle">Agendá un turno para tu clienta</p>
      </div>

      <form onSubmit={handleSubmit} className="form-modern" style={{ padding: '20px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="label-icon">👤</span>
              Cliente
            </label>
            <select
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.telefono ? `(${c.telefono})` : ''}
                </option>
              ))}
            </select>
          </div>

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
                  {t.nombre} {t.precio > 0 ? `- $${parseFloat(t.precio).toLocaleString('es-AR')}` : '- Consultar'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="label-icon">📅</span>
              Fecha (Lunes a Sábado, excepto Martes)
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
            <small className="form-hint">No trabajamos martes ni domingos</small>
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
            <small className="form-hint">Mañana: 7:00-12:00 | Tarde: 13:30-21:00</small>
          </div>
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">📝</span>
            Notas (opcional)
          </label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Observaciones o detalles del servicio..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Guardando...' : '💬 Confirmar por WhatsApp'}
          </button>
        </div>
      </form>
    </div>
  );
}
