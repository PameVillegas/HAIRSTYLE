import { useEffect, useState } from "react";

export default function Dashboard() {
  const [treatments, setTreatments] = useState([]);
  const [stats, setStats] = useState({
    turnosTotal: 0,
    turnosMes: 0,
    clientesTotal: 0,
    clientesNuevos: 0,
    ingresosTotal: 0,
    turnosPendientes: 0,
    turnosCompletados: 0
  });

  useEffect(() => {
    fetch('/api/tratamientos')
      .then(res => res.json())
      .then(data => setTreatments(data))
      .catch(err => console.error('Error cargando tratamientos:', err));
    
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [turnosRes, clientesRes] = await Promise.all([
        fetch('/api/turnos'),
        fetch('/api/clientes')
      ]);
      
      const turnos = await turnosRes.json();
      const clientes = await clientesRes.json();
      
      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const añoActual = hoy.getFullYear();
      
      const turnosMes = turnos.filter(t => {
        const fechaTurno = new Date(t.fecha);
        return fechaTurno.getMonth() === mesActual && fechaTurno.getFullYear() === añoActual;
      });
      
      const clientesNuevos = clientes.filter(c => {
        const fechaCreacion = new Date(c.created_at);
        const mesAtras = new Date();
        mesAtras.setMonth(mesAtras.getMonth() - 1);
        return fechaCreacion >= mesAtras;
      });
      
      const ingresosTotal = turnos
        .filter(t => t.estado === 'completado')
        .reduce((sum, t) => sum + parseFloat(t.precio || 0), 0);
      
      setStats({
        turnosTotal: turnos.length,
        turnosMes: turnosMes.length,
        clientesTotal: clientes.length,
        clientesNuevos: clientesNuevos.length,
        ingresosTotal: ingresosTotal,
        turnosPendientes: turnos.filter(t => t.estado === 'pendiente').length,
        turnosCompletados: turnos.filter(t => t.estado === 'completado').length
      });
      
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📊 Dashboard</h2>
        <p className="card-subtitle">Panel de administración con estadísticas</p>
      </div>

      <div className="stats-grid" style={{ padding: '20px' }}>
        <div className="stat-card stat-primary">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.turnosTotal}</h3>
            <p>Turnos Totales</p>
          </div>
        </div>
        
        <div className="stat-card stat-success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.ingresosTotal.toLocaleString('es-AR')}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
        
        <div className="stat-card stat-warning">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.clientesTotal}</h3>
            <p>Clientes Totales</p>
          </div>
        </div>
        
        <div className="stat-card stat-info">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{stats.clientesNuevos}</h3>
            <p>Clientes Nuevos (mes)</p>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ padding: '0 20px 20px' }}>
        <div className="stat-card" style={{ background: '#fff3cd' }}>
          <div className="stat-icon" style={{ background: '#ffc107' }}>⏳</div>
          <div className="stat-content">
            <h3>{stats.turnosPendientes}</h3>
            <p>Turnos Pendientes</p>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: '#d4edda' }}>
          <div className="stat-icon" style={{ background: '#28a745' }}>✅</div>
          <div className="stat-content">
            <h3>{stats.turnosCompletados}</h3>
            <p>Turnos Completados</p>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: '#cce5ff' }}>
          <div className="stat-icon" style={{ background: '#007bff' }}>📆</div>
          <div className="stat-content">
            <h3>{stats.turnosMes}</h3>
            <p>Turnos Este Mes</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <h3 style={{ marginBottom: '15px' }}>💆 Servicios</h3>
        <div className="treatment-list">
          {treatments.length === 0 ? (
            <p>Cargando servicios...</p>
          ) : (
            treatments.map(t => (
              <div key={t.id} className="treatment-item">
                <span>💫 {t.nombre}</span>
                <span className="price">
                  {parseFloat(t.precio) === 0
                    ? "Consultar"
                    : `$${parseFloat(t.precio).toLocaleString('es-AR')}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="welcome-message" style={{ margin: '0 20px 20px' }}>
        <h3>¡Bienvenido/a a HairStyle! 💇‍♀️</h3>
        <p>Usá las pestañas de arriba para navegar por las diferentes secciones.</p>
      </div>
    </div>
  );
}
