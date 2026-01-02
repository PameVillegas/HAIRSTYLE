import { useState, useEffect } from 'react';

const API_URL = '/api';

const TRATAMIENTOS = [
  'Alisado',
  'Tratamiento Capilar',
  'Depilación Facial',
  'Botox Capilar',
  'Keratina',
  'Nutrición Capilar'
];

function App() {
  const [tab, setTab] = useState('turnos');
  const [clientes, setClientes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', email: '' });
  const [editandoCliente, setEditandoCliente] = useState(null);
  const [nuevoTurno, setNuevoTurno] = useState({
    cliente_id: '',
    tratamiento: '',
    fecha: '',
    hora: '',
    notas: ''
  });

  useEffect(() => {
    cargarClientes();
    cargarTurnos();
  }, []);

  const cargarClientes = async () => {
    const res = await fetch(`${API_URL}/clientes`);
    const data = await res.json();
    setClientes(data);
  };

  const cargarTurnos = async () => {
    const res = await fetch(`${API_URL}/turnos`);
    const data = await res.json();
    setTurnos(data);
  };

  const agregarCliente = async (e) => {
    e.preventDefault();
    if (editandoCliente) {
      // Actualizar cliente existente
      await fetch(`${API_URL}/clientes/${editandoCliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
      setEditandoCliente(null);
    } else {
      // Crear nuevo cliente
      await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
    }
    setNuevoCliente({ nombre: '', telefono: '', email: '' });
    cargarClientes();
  };

  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email || ''
    });
    setEditandoCliente(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoCliente(null);
    setNuevoCliente({ nombre: '', telefono: '', email: '' });
  };

  const eliminarCliente = async (id) => {
    if (confirm('¿Eliminar este cliente? Se eliminarán también todos sus turnos.')) {
      await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
      cargarClientes();
      cargarTurnos();
    }
  };

  const agregarTurno = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/turnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoTurno)
    });
    const data = await res.json();
    alert(data.whatsappEnviado ? 'Turno creado y WhatsApp enviado!' : 'Turno creado (error al enviar WhatsApp)');
    setNuevoTurno({ cliente_id: '', tratamiento: '', fecha: '', hora: '', notas: '' });
    cargarTurnos();
  };

  const cambiarEstado = async (id, estado) => {
    await fetch(`${API_URL}/turnos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    cargarTurnos();
  };

  const eliminarTurno = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
      cargarTurnos();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <img src="/logo.jpg" alt="HairStyleAbii Logo" className="logo" />
        <h1>💇 HairStyleAbii</h1>
      </div>
      
      <div className="tabs">
        <button className={`tab ${tab === 'turnos' ? 'active' : ''}`} onClick={() => setTab('turnos')}>
          Turnos
        </button>
        <button className={`tab ${tab === 'nuevo' ? 'active' : ''}`} onClick={() => setTab('nuevo')}>
          Nuevo Turno
        </button>
        <button className={`tab ${tab === 'clientes' ? 'active' : ''}`} onClick={() => setTab('clientes')}>
          Clientes
        </button>
      </div>

      {tab === 'turnos' && (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Lista de Turnos</h2>
          <div className="turnos-list">
            {turnos.map(turno => (
              <div key={turno.id} className="turno-item">
                <div className="turno-header">
                  <div>
                    <strong>{turno.cliente_nombre}</strong>
                    <span className={`estado ${turno.estado}`} style={{ marginLeft: '10px' }}>
                      {turno.estado}
                    </span>
                  </div>
                  <div>
                    <select 
                      value={turno.estado} 
                      onChange={(e) => cambiarEstado(turno.id, e.target.value)}
                      style={{ marginRight: '10px', width: 'auto' }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="completado">Completado</option>
                    </select>
                    <button className="delete" onClick={() => eliminarTurno(turno.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="turno-info">
                  <p>📅 {turno.fecha} - ⏰ {turno.hora}</p>
                  <p>💆 {turno.tratamiento}</p>
                  <p>📱 {turno.telefono}</p>
                  {turno.notas && <p>📝 {turno.notas}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'nuevo' && (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Crear Nuevo Turno</h2>
          <form onSubmit={agregarTurno}>
            <div className="form-group">
              <label>Cliente</label>
              <select 
                value={nuevoTurno.cliente_id} 
                onChange={(e) => setNuevoTurno({...nuevoTurno, cliente_id: e.target.value})}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} - {c.telefono}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tratamiento</label>
              <select 
                value={nuevoTurno.tratamiento} 
                onChange={(e) => setNuevoTurno({...nuevoTurno, tratamiento: e.target.value})}
                required
              >
                <option value="">Seleccionar tratamiento</option>
                {TRATAMIENTOS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input 
                type="date" 
                value={nuevoTurno.fecha}
                onChange={(e) => setNuevoTurno({...nuevoTurno, fecha: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input 
                type="time" 
                value={nuevoTurno.hora}
                onChange={(e) => setNuevoTurno({...nuevoTurno, hora: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Notas (opcional)</label>
              <textarea 
                value={nuevoTurno.notas}
                onChange={(e) => setNuevoTurno({...nuevoTurno, notas: e.target.value})}
                rows="3"
              />
            </div>
            <button type="submit">Crear Turno y Enviar WhatsApp</button>
          </form>
        </div>
      )}

      {tab === 'clientes' && (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>
            {editandoCliente ? 'Editar Cliente' : 'Agregar Cliente'}
          </h2>
          <form onSubmit={agregarCliente}>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono (con código de país, ej: +5491123456789)</label>
              <input 
                type="tel" 
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                placeholder="+5491123456789"
                required
              />
            </div>
            <div className="form-group">
              <label>Email (opcional)</label>
              <input 
                type="email" 
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit">
                {editandoCliente ? 'Actualizar Cliente' : 'Agregar Cliente'}
              </button>
              {editandoCliente && (
                <button type="button" onClick={cancelarEdicion} style={{ background: '#6c757d' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Lista de Clientes</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {clientes.map(c => (
              <div key={c.id} className="turno-item">
                <div className="turno-header">
                  <div>
                    <strong>{c.nombre}</strong>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      📱 {c.telefono}
                      {c.email && <span> • ✉️ {c.email}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => editarCliente(c)}
                      style={{ 
                        background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="delete" 
                      onClick={() => eliminarCliente(c.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
