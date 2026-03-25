import { useEffect, useState } from "react";
import SolicitarTurnoForm from './SolicitarTurnoForm';

const API_URL = '/api';

export default function ClientePortal({ cliente, onLogout, isMobile, currentTab, onTabChange }) {
  const [misTurnos, setMisTurnos] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cliente && cliente.id) {
      cargarDatos();
    }
  }, [cliente]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [tratamientosRes, promocionesRes, galeriaRes] = await Promise.all([
        fetch(`${API_URL}/tratamientos`).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${API_URL}/promociones`).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${API_URL}/galeria`).catch(() => ({ ok: false, json: () => [] }))
      ]);

      if (tratamientosRes.ok) {
        setTratamientos(await tratamientosRes.json());
      }
      if (promocionesRes.ok) {
        setPromociones(await promocionesRes.json());
      }
      if (galeriaRes.ok) {
        setGaleria(await galeriaRes.json());
      }
      
      // Cargar turnos del cliente
      if (cliente.id) {
        try {
          const turnosRes = await fetch(`${API_URL}/auth/cliente/${cliente.id}`);
          if (turnosRes.ok) {
            const data = await turnosRes.json();
            setMisTurnos(data.turnos || []);
          }
        } catch (e) {
          console.log('No se pudieron cargar turnos');
        }
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'inicio':
        return (
          <SolicitarTurnoForm 
            cliente={cliente} 
            tratamientos={tratamientos}
          />
        );

      case 'quiensoy':
        return (
          <div className="card">
            <div className="card-header">
              <h2>👩 Quien soy</h2>
              <p className="card-subtitle">Conocé a quien te va a atender</p>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <img 
                src="/fotos/abi.jpg" 
                alt="Abigail Berenice Villegas"
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid var(--primary)',
                  marginBottom: '20px'
                }}
              />
              <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Abigail Berenice Villegas</h3>
              <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>✨ Tengo 21 años</p>
              <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>📍 Soy de Florentino Ameghino</p>
              <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>💇‍♀️ Me formé en peluquería en <strong>Instituto de Belleza</strong></p>
              <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>📚 Complementando mi formación con diversos cursos de especialización</p>
              <p style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--gray)', fontStyle: 'italic' }}>
                Me encuentro en constante capacitación con el objetivo de brindar un servicio de calidad y actualizado a las nuevas tendencias.
              </p>
              <div style={{ 
                background: 'var(--primary-light)', 
                padding: '20px', 
                borderRadius: '12px',
                marginTop: '15px'
              }}>
                <p style={{ fontSize: '1rem', color: 'var(--dark)' }}>
                  Agradezco profundamente la confianza de cada clienta, sus recomendaciones y el acompañamiento en mi crecimiento profesional. 💕
                </p>
              </div>
            </div>
          </div>
        );

      case 'servicios':
        return (
          <div className="card">
            <div className="card-header">
              <h2>💆 Nuestros Servicios</h2>
              <p className="card-subtitle">Conocé todos nuestros servicios</p>
            </div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>
            ) : tratamientos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💆</div>
                <h3>Próximamente</h3>
                <p>Estamos preparando nuestros servicios</p>
              </div>
            ) : (
              <div className="tratamientos-grid" style={{ padding: '20px' }}>
                {tratamientos.map(trat => (
                  <div key={trat.id} className="tratamiento-card">
                    {trat.imagen_url && (
                      <img 
                        src={trat.imagen_url} 
                        alt={trat.nombre}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                      />
                    )}
                    <div className="tratamiento-header">
                      <h3>{trat.nombre}</h3>
                      <span className="tratamiento-precio">
                        {parseFloat(trat.precio) > 0 ? `$${trat.precio}` : 'Consultar'}
                      </span>
                    </div>
                    <div className="tratamiento-info">
                      ⏱️ {trat.duracion} minutos
                    </div>
                    {trat.descripcion && (
                      <div className="tratamiento-descripcion">
                        {trat.descripcion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'promociones':
        return (
          <div className="card">
            <div className="card-header">
              <h2>🎉 Promociones</h2>
              <p className="card-subtitle">Aprovechá nuestras ofertas</p>
            </div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>
            ) : promociones.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No hay promociones activas</h3>
                <p>Visitá pronto para ver nuestras ofertas</p>
              </div>
            ) : (
              <div className="promociones-grid" style={{ padding: '20px' }}>
                {promociones.map(promo => (
                  <div key={promo.id} className="promocion-card">
                    {promo.imagen_url && (
                      <div className="promocion-imagen">
                        <img src={promo.imagen_url} alt={promo.titulo} />
                      </div>
                    )}
                    <div className="promocion-content">
                      <h3>{promo.titulo}</h3>
                      {promo.descripcion && <p>{promo.descripcion}</p>}
                      {promo.precio_especial && (
                        <div className="promocion-precio">
                          <span className="precio-especial">${promo.precio_especial}</span>
                        </div>
                      )}
                      {promo.fecha_fin && (
                        <div className="promocion-vigencia">
                          ⏰ Válido hasta: {new Date(promo.fecha_fin).toLocaleDateString('es-AR')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'galeria':
        return (
          <div className="card">
            <div className="card-header">
              <h2>📸 Galería</h2>
              <p className="card-subtitle">Nuestros trabajos</p>
            </div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>
            ) : galeria.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📸</div>
                <h3>Galería vacía</h3>
                <p>Visitá pronto para ver nuestras fotos</p>
              </div>
            ) : (
              <div className="galeria-grid" style={{ padding: '20px' }}>
                {galeria.map(item => (
                  <div key={item.id} className="galeria-item">
                    <img src={item.imagen_url} alt={item.titulo || 'Trabajo'} />
                    {item.titulo && (
                      <div className="galeria-overlay">
                        <h4>{item.titulo}</h4>
                        {item.categoria && <span className="galeria-categoria">{item.categoria}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'instagram':
        return (
          <div className="card">
            <div className="card-header">
              <h2>📱 Seguinos en Instagram</h2>
              <p className="card-subtitle">Mirás nuestros trabajos y novedades</p>
            </div>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📸</div>
              <h3 style={{ marginBottom: '15px' }}>@hairstyleabii</h3>
              <p style={{ marginBottom: '30px', fontSize: '1.1rem', color: 'var(--gray)' }}>
                Seguinos para ver nuestras últimas creaciones, promociones exclusivas y consejos de belleza
              </p>
              <a 
                href="https://www.instagram.com/hairstyleabii?igsh=NGZ1dGxzdmJodHZz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ 
                  display: 'inline-flex', 
                  padding: '16px 40px', 
                  fontSize: '1.1rem',
                  textDecoration: 'none'
                }}
              >
                📸 Ir a Instagram
              </a>
            </div>
          </div>
        );

      case 'mis-turnos':
        return (
          <div className="card">
            <div className="card-header">
              <h2>📋 Mis Turnos</h2>
              <p className="card-subtitle">Historial de tus turnos</p>
            </div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>
            ) : misTurnos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No tenés turnos</h3>
                <p>Solicitá tu primer turno</p>
              </div>
            ) : (
              <div style={{ padding: '10px' }}>
                {misTurnos.map(turno => (
                  <div key={turno.id} className="turno-card" style={{ marginBottom: '15px' }}>
                    <div className="turno-card-header">
                      <strong>{turno.tratamiento}</strong>
                      <span className={`estado estado-${turno.estado}`}>{turno.estado}</span>
                    </div>
                    <div className="turno-card-body">
                      <div>📅 {new Date(turno.fecha).toLocaleDateString('es-AR')}</div>
                      <div>🕐 {turno.hora}</div>
                      <div>💰 {parseFloat(turno.precio) > 0 ? `$${turno.precio}` : 'Consultar'}</div>
                      {turno.notas && <div>📝 {turno.notas}</div>}
                    </div>
                    {turno.estado !== 'cancelado' && turno.estado !== 'completado' && (
                      <div className="turno-card-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a 
                          href={`https://wa.me/543388673804?text=Hola! Quiero modificar mi turno del ${new Date(turno.fecha).toLocaleDateString('es-AR')} a las ${turno.hora} - ${turno.tratamiento}. Mi nombre es ${cliente.nombre}. ¿Podemos cambiar el horario o fecha?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-edit-small"
                          style={{ textDecoration: 'none', background: 'var(--info)', color: 'white' }}
                        >
                          ✏️ Editar
                        </a>
                        <a 
                          href={`https://wa.me/543388673804?text=Hola! Quiero cancelar mi turno del ${new Date(turno.fecha).toLocaleDateString('es-AR')} a las ${turno.hora}. Mi nombre es ${cliente.nombre}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-delete"
                          style={{ textDecoration: 'none' }}
                        >
                          ❌ Cancelar
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'solicitar':
        return (
          <SolicitarTurnoForm 
            cliente={cliente} 
            tratamientos={tratamientos}
          />
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'inicio', icon: '🏠', label: 'Inicio' },
    { id: 'solicitar', icon: '➕', label: 'Turno' },
    { id: 'mis-turnos', icon: '📅', label: 'Turnos' },
    { id: 'servicios', icon: '💆', label: 'Servicios' },
    { id: 'promociones', icon: '🎉', label: 'Promos' },
    { id: 'galeria', icon: '📸', label: 'Galería' },
    { id: 'quiensoy', icon: '👩', label: 'Quien soy' }
  ];

  if (isMobile) {
    return (
      <div className="cliente-portal" style={{ flex: 1 }}>
        <div style={{ padding: '10px 10px 90px 10px' }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="cliente-portal" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
          <div>
            <h3 style={{ margin: 0 }}>👋 {cliente.nombre}</h3>
            <small>Cliente</small>
          </div>
          <button onClick={onLogout} className="btn-secondary">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={currentTab === tab.id ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: '1', minWidth: '120px', fontSize: '14px', padding: '10px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
