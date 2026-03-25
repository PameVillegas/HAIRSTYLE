import { useState, useEffect } from "react";

export default function SolicitarTurnoForm({ cliente, tratamientos }) {
  const [formData, setFormData] = useState({
    tratamiento_id: '',
    fecha: '',
    hora: ''
  });
  const [turnosDelDia, setTurnosDelDia] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const diasDisponibles = [1, 3, 4, 5, 6]; // Lun, Mie, Jue, Vie, Sab
  const horariosManiana = ['07:00', '08:00', '09:00', '10:00', '11:00'];
  const horariosTarde = ['13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'];

  const getDuracion = (tratamientoId) => {
    const tratamiento = tratamientos.find(t => t.id === parseInt(tratamientoId));
    if (!tratamiento) return 60;
    
    const nombre = tratamiento.nombre.toLowerCase();
    
    if (nombre.includes('perfilado')) return 30;
    if (nombre.includes('alisado') || nombre.includes('tratamiento') && !nombre.includes('facial')) return 120;
    if (nombre.includes('facial')) return 90;
    if (nombre.includes('pestaña')) return 120;
    
    return tratamiento.duracion || 60;
  };

  const getDuracionLabel = (minutos) => {
    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      if (mins === 0) return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
      return `${horas}h ${mins}min`;
    }
    return `${minutos} minutos`;
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

  useEffect(() => {
    if (formData.fecha) {
      cargarTurnosDelDia();
    }
  }, [formData.fecha]);

  const cargarTurnosDelDia = async () => {
    try {
      const res = await fetch(`/api/turnos`);
      if (res.ok) {
        const todosTurnos = await res.json();
        const turnosFecha = todosTurnos.filter(t => {
          const fechaTurno = new Date(t.fecha).toISOString().split('T')[0];
          return fechaTurno === formData.fecha && t.estado !== 'cancelado';
        });
        setTurnosDelDia(turnosFecha);
      }
    } catch (err) {
      console.error('Error cargando turnos:', err);
    }
  };

  const horaToMinutes = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToHora = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const isHorarioBloqueado = (horario) => {
    if (!formData.tratamiento_id || !formData.fecha) return false;
    
    const duracion = getDuracion(formData.tratamiento_id);
    const horarioMinutos = horaToMinutes(horario);
    const horarioFinMinutos = horarioMinutos + duracion;

    for (const turno of turnosDelDia) {
      const turnoMinutos = horaToMinutes(turno.hora);
      const turnoDuracion = turno.tratamiento_duracion || 60;
      const turnoFinMinutos = turnoMinutos + turnoDuracion;

      if (horarioMinutos < turnoFinMinutos && horarioFinMinutos > turnoMinutos) {
        return true;
      }
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'tratamiento_id') {
      setFormData(prev => ({ ...prev, tratamiento_id: value, hora: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tratamiento = tratamientos.find(t => t.id === parseInt(formData.tratamiento_id));
    const fechaFormateada = new Date(formData.fecha).toLocaleDateString('es-AR');
    const duracion = getDuracion(formData.tratamiento_id);
    
    const mensaje = `¡Hola! Quiero reservar un turno:%0A%0A👤 Nombre: ${cliente.nombre}%0A📅 Fecha: ${fechaFormateada}%0A🕐 Horario: ${formData.hora}%0A💆 Servicio: ${tratamiento?.nombre || 'Por confirmar'}%0A⏱️ Duración estimada: ${getDuracionLabel(duracion)}`;
    
    window.open(`https://wa.me/543388673804?text=${mensaje}`, '_blank');
    setEnviado(true);
  };

  const handleReset = () => {
    setFormData({ tratamiento_id: '', fecha: '', hora: '' });
    setTurnosDelDia([]);
    setEnviado(false);
  };

  const selectedTratamiento = tratamientos.find(t => t.id === parseInt(formData.tratamiento_id));
  const duracion = formData.tratamiento_id ? getDuracion(formData.tratamiento_id) : null;

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
          {duracion && (
            <small className="form-hint" style={{ color: 'var(--primary)', marginTop: '5px' }}>
              ⏱️ Duración estimada: {getDuracionLabel(duracion)}
            </small>
          )}
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
              disabled={!formData.fecha || !formData.tratamiento_id}
            >
              <option value="">Seleccionar horario</option>
              <optgroup label="Mañana">
                {horariosManiana.map(h => {
                  const bloqueado = isHorarioBloqueado(h);
                  return (
                    <option key={h} value={h} disabled={bloqueado} style={bloqueado ? { color: '#ccc', textDecoration: 'line-through' } : {}}>
                      {h} {bloqueado ? '(ocupado)' : ''}
                    </option>
                  );
                })}
              </optgroup>
              <optgroup label="Tarde">
                {horariosTarde.map(h => {
                  const bloqueado = isHorarioBloqueado(h);
                  return (
                    <option key={h} value={h} disabled={bloqueado} style={bloqueado ? { color: '#ccc', textDecoration: 'line-through' } : {}}>
                      {h} {bloqueado ? '(ocupado)' : ''}
                    </option>
                  );
                })}
              </optgroup>
            </select>
            <small className="form-hint">7:00-12:00 | 13:30-21:00</small>
            {turnosDelDia.length > 0 && formData.fecha && (
              <small className="form-hint" style={{ color: 'var(--info)' }}>
                {turnosDelDia.length} turno(s) ya reservado(s) para este día
              </small>
            )}
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
            <p><strong>💆 Servicio:</strong> {selectedTratamiento?.nombre}</p>
            <p><strong>⏱️ Duración:</strong> {getDuracionLabel(duracion)}</p>
            <p><strong>📅 Fecha:</strong> {new Date(formData.fecha).toLocaleDateString('es-AR')}</p>
            <p><strong>🕐 Horario:</strong> {formData.hora}</p>
            {selectedTratamiento && parseFloat(selectedTratamiento.precio) > 0 && (
              <p><strong>💰 Precio:</strong> ${parseFloat(selectedTratamiento.precio).toLocaleString('es-AR')}</p>
            )}
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
