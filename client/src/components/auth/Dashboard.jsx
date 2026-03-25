import { useEffect, useState } from "react";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    turnosTotal: 0,
    clientesTotal: 0,
    ingresosTotal: 0,
    turnosPendientes: 0
  });

  useEffect(() => {
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
      
      const ingresosTotal = turnos
        .filter(t => t.estado === 'completado')
        .reduce((sum, t) => sum + parseFloat(t.precio || 0), 0);
      
      setStats({
        turnosTotal: turnos.length,
        clientesTotal: clientes.length,
        ingresosTotal: ingresosTotal,
        turnosPendientes: turnos.filter(t => t.estado === 'pendiente').length
      });
      
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const menuItems = [
    { id: 'turnos', icon: '📅', label: 'Turnos', color: '#e91e63', desc: 'Gestionar turnos' },
    { id: 'nuevo', icon: '➕', label: 'Nuevo Turno', color: '#9c27b0', desc: 'Crear turno' },
    { id: 'clientes', icon: '👤', label: 'Agregar Cliente', color: '#673ab7', desc: 'Registrar cliente' },
    { id: 'lista-clientes', icon: '📋', label: 'Lista Clientes', color: '#3f51b5', desc: 'Ver clientes' },
    { id: 'promociones', icon: '🎉', label: 'Promociones', color: '#2196f3', desc: 'Gestionar promos' },
    { id: 'galeria', icon: '📸', label: 'Galería', color: '#00bcd4', desc: 'Administrar fotos' },
    { id: 'legajos', icon: '📋', label: 'Legajos', color: '#ff9800', desc: 'Planillas anamnesis' },
    { id: 'mensajes', icon: '💬', label: 'Mensajes', color: '#4caf50', desc: 'Ver mensajes' }
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '15px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>💰</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>
            ${stats.ingresosTotal.toLocaleString('es-AR')}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Ingresos</div>
        </div>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '15px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📅</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e91e63' }}>
            {stats.turnosTotal}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Turnos</div>
        </div>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '15px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👥</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9c27b0' }}>
            {stats.clientesTotal}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Clientes</div>
        </div>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '15px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>⏳</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>
            {stats.turnosPendientes}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Pendientes</div>
        </div>
      </div>

      {/* Menu Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '12px'
      }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: item.color,
              border: 'none',
              borderRadius: '16px',
              padding: '20px 15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
            <span style={{ 
              color: 'white', 
              fontWeight: '700', 
              fontSize: '0.95rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {item.label}
            </span>
            <span style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '0.75rem' 
            }}>
              {item.desc}
            </span>
          </button>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        background: '#fce4ec',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#c2185b', fontWeight: '600' }}>
          💇‍♀️ ¡Bienvenida a HairStyle! Tocá una opción para comenzar.
        </p>
      </div>
    </div>
  );
}
