import { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/auth/Dashboard';
import ClientePortal from './components/auth/ClientePortal';
import Header from './components/auth/Header';
import Tabs from './components/auth/Tabs';
import MobileNav from './components/auth/MobileNav';
import TurnosList from './components/auth/TurnosList';
import NuevoTurnoForm from './components/auth/NuevoTurnoForm';
import ClienteForm from './components/auth/ClienteForm';
import ClientesList from './components/auth/ClientesList';
import EditarTurnoModal from './components/auth/EditarTurnoModal';
import GestionPromociones from './components/auth/GestionPromociones';
import GestionGaleria from './components/auth/GestionGaleria';
import useIsMobile from './hooks/useIsMobile';

const API_URL = import.meta.env.PROD ? '/api' : '/api';

function App() {
  // Hook para detectar dispositivos móviles
  const { isMobile, isTablet } = useIsMobile();

  // Estado de autenticación
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null); // 'admin' o 'cliente'

  // Estados para admin
  const [tab, setTab] = useState('dashboard');
  const [clientes, setClientes] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', email: '' });
  const [editandoCliente, setEditandoCliente] = useState(null);
  const [editandoTurno, setEditandoTurno] = useState(null);
  const [nuevoTurno, setNuevoTurno] = useState({
    cliente_id: '',
    tratamiento_id: '',
    fecha: '',
    hora: '',
    notas: ''
  });
  const [mensajesWhatsApp, setMensajesWhatsApp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tipoUsuario === 'admin') {
      cargarDatos();
    }
  }, [tipoUsuario]);

  const handleLogin = (user, tipo) => {
    setUsuario(user);
    setTipoUsuario(tipo);
    if (tipo === 'admin') {
      setTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setTipoUsuario(null);
    setTab('dashboard');
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarClientes(),
        cargarTratamientos(),
        cargarTurnos()
      ]);
    } catch (err) {
      setError('Error cargando datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarClientes = async () => {
    const res = await fetch(`${API_URL}/clientes`);
    if (!res.ok) throw new Error('Error cargando clientes');
    const data = await res.json();
    setClientes(data);
  };

  const cargarTratamientos = async () => {
    const res = await fetch(`${API_URL}/tratamientos`);
    if (!res.ok) throw new Error('Error cargando tratamientos');
    const data = await res.json();
    setTratamientos(data);
  };

  const cargarTurnos = async () => {
    const res = await fetch(`${API_URL}/turnos`);
    if (!res.ok) throw new Error('Error cargando turnos');
    const data = await res.json();
    setTurnos(data);
  };

  const agregarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (editandoCliente) {
        await fetch(`${API_URL}/clientes/${editandoCliente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoCliente)
        });
        setSuccess('Cliente actualizado correctamente');
        setEditandoCliente(null);
      } else {
        await fetch(`${API_URL}/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoCliente)
        });
        setSuccess('Cliente agregado correctamente');
      }
      setNuevoCliente({ nombre: '', telefono: '', email: '' });
      cargarClientes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email || ''
    });
    setEditandoCliente(cliente);
    setTab('clientes');
  };

  const cancelarEdicion = () => {
    setEditandoCliente(null);
    setNuevoCliente({ nombre: '', telefono: '', email: '' });
  };

  const eliminarCliente = async (id) => {
    if (confirm('¿Eliminar este cliente? Se eliminarán también todos sus turnos.')) {
      try {
        await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
        setSuccess('Cliente eliminado correctamente');
        cargarClientes();
        cargarTurnos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const agregarTurno = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const cliente = clientes.find(c => c.id === parseInt(formData.cliente_id));
      const tratamiento = tratamientos.find(t => t.id === parseInt(formData.tratamiento_id));
      
      const fechaFormateada = new Date(formData.fecha).toLocaleDateString('es-AR');
      
      // Registrar turno en la base de datos
      const res = await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: formData.cliente_id,
          tratamiento_id: formData.tratamiento_id,
          fecha: formData.fecha,
          hora: formData.hora,
          notas: formData.notas,
          estado: 'pendiente'
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error creando turno');
      }
      
      // Abrir WhatsApp con mensaje
      const mensajeWhatsApp = `Hola! Quiero reservar un turno:%0A%0A📅 Fecha: ${fechaFormateada}%0A🕐 Horario: ${formData.hora}%0A💇‍♀️ Servicio: ${tratamiento?.nombre || 'Por confirmar'}%0A👤 Cliente: ${cliente?.nombre || 'Por confirmar'}${formData.notas ? '%0A📝 Notas: ' + formData.notas : ''}`;
      
      window.open(`https://wa.me/543388673804?text=${mensajeWhatsApp}`, '_blank');
      
      setSuccess('Turno registrado y esperando confirmación por WhatsApp');
      cargarTurnos();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await fetch(`${API_URL}/turnos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      cargarTurnos();
      setSuccess('Estado actualizado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarTurno = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      try {
        await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
        setSuccess('Turno eliminado correctamente');
        cargarTurnos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const editarTurno = (turno) => {
    setEditandoTurno(turno);
  };

  const guardarTurnoEditado = async (id, formData) => {
    try {
      const res = await fetch(`${API_URL}/turnos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error actualizando turno');
      }

      setSuccess('Turno actualizado correctamente');
      setEditandoTurno(null);
      cargarTurnos();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Auto-hide alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Si no hay usuario logueado, mostrar login
  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  // Si es cliente, mostrar portal de cliente
  if (tipoUsuario === 'cliente') {
    const clienteTabs = [
      { id: 'inicio', icon: '🏠', label: 'Inicio' },
      { id: 'quiensoy', icon: '👩', label: 'Quien soy' },
      { id: 'servicios', icon: '💆', label: 'Servicios' },
      { id: 'promociones', icon: '🎉', label: 'Promos' },
      { id: 'galeria', icon: '📸', label: 'Galería' },
      { id: 'mis-turnos', icon: '📅', label: 'Mis Turnos' },
      { id: 'instagram', icon: '📱', label: 'Instagram' },
      { id: 'solicitar', icon: '➕', label: 'Turno' }
    ];

    return (
      <div className={`app-container ${isMobile ? 'mobile' : ''}`}>
        {isMobile && (
          <MobileNav
            activeTab={tab}
            onTabChange={setTab}
            tabs={clienteTabs}
            onLogout={handleLogout}
            usuario={usuario}
            tipoUsuario={tipoUsuario}
          />
        )}
        <div className={`main-content ${isMobile ? 'mobile-content' : ''}`}>
          <ClientePortal 
            cliente={usuario} 
            onLogout={handleLogout}
            isMobile={isMobile}
            currentTab={tab}
            onTabChange={setTab}
          />
        </div>
      </div>
    );
  }

  // Si es admin, mostrar panel completo
  const adminTabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'turnos', icon: '📅', label: 'Turnos' },
    { id: 'nuevo', icon: '➕', label: 'Nuevo Turno' },
    { id: 'clientes', icon: '👤', label: 'Agregar Cliente' },
    { id: 'lista-clientes', icon: '📋', label: 'Clientes' },
    { id: 'promociones', icon: '🎉', label: 'Promociones' },
    { id: 'galeria', icon: '📸', label: 'Galería' },
    { id: 'mensajes', icon: '💬', label: 'Mensajes' }
  ];

  return (
    <div className={`app-container ${isMobile ? 'mobile' : ''}`}>
      {isMobile ? (
        <MobileNav
          activeTab={tab}
          onTabChange={setTab}
          tabs={adminTabs}
          onLogout={handleLogout}
          usuario={usuario}
          tipoUsuario={tipoUsuario}
        />
      ) : (
        <div className="admin-header">
          <Header />
          <button onClick={handleLogout} className="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      )}

      <div className={`main-content ${isMobile ? 'mobile-content' : ''}`}>
        <div className="container">
          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              ✅ {success}
            </div>
          )}
          
          {loading && (
            <div className="alert alert-info">
              🔄 Cargando...
            </div>
          )}
          
          {!isMobile && <Tabs activeTab={tab} onTabChange={setTab} />}

      {tab === 'dashboard' && <Dashboard />}

      {tab === 'turnos' && (
        <div className="card">
          <div className="card-header">
            <h2>📅 Lista de Turnos</h2>
            <p className="card-subtitle">Gestiona todos los turnos agendados</p>
          </div>
          <TurnosList 
            turnos={turnos}
            onEstadoChange={cambiarEstado}
            onDelete={eliminarTurno}
            onEdit={editarTurno}
          />
        </div>
      )}

      {editandoTurno && (
        <EditarTurnoModal
          turno={editandoTurno}
          clientes={clientes}
          tratamientos={tratamientos}
          onClose={() => setEditandoTurno(null)}
          onSave={guardarTurnoEditado}
        />
      )}

      {tab === 'nuevo' && (
        <NuevoTurnoForm
          clientes={clientes}
          tratamientos={tratamientos}
          onSubmit={agregarTurno}
          loading={loading}
        />
      )}

      {tab === 'mensajes' && (
        <div className="card">
          <div className="card-header">
            <h2>💬 Mensajes para WhatsApp</h2>
            <p className="card-subtitle">Copia y envía los mensajes a tus clientes</p>
          </div>
          {mensajesWhatsApp.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No hay mensajes pendientes</h3>
              <p>Cuando crees un turno, el mensaje aparecerá aquí</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {mensajesWhatsApp.map(msg => (
                <div key={msg.id} className="turno-card">
                  <div className="turno-card-header">
                    <div>
                      <strong>📞 {msg.cliente}</strong>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                        {msg.telefono} • {msg.fecha}
                      </div>
                    </div>
                  </div>
                  <div className="turno-card-body">
                    <div style={{ 
                      background: '#f0f0f0', 
                      padding: '15px', 
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}>
                      {msg.mensaje}
                    </div>
                  </div>
                  <div className="turno-card-footer">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(msg.mensaje);
                        setSuccess('Mensaje copiado al portapapeles');
                      }}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      📋 Copiar Mensaje
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'clientes' && (
        <ClienteForm
          cliente={nuevoCliente}
          onChange={setNuevoCliente}
          onSubmit={agregarCliente}
          onCancel={cancelarEdicion}
          isEditing={!!editandoCliente}
          loading={loading}
        />
      )}

      {tab === 'lista-clientes' && (
        <div className="card">
          <div className="card-header">
            <h2>📋 Lista de Clientes</h2>
            <p className="card-subtitle">Gestiona la información de tus clientes</p>
          </div>
          <ClientesList
            clientes={clientes}
            onEdit={editarCliente}
            onDelete={eliminarCliente}
          />
        </div>
      )}

      {tab === 'promociones' && <GestionPromociones />}

      {tab === 'galeria' && <GestionGaleria />}
        </div>
      </div>
    </div>
  );
}

export default App;
