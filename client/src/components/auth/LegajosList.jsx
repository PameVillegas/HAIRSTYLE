import { useState, useEffect } from "react";

export default function LegajosList() {
  const [legajos, setLegajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLegajo, setSelectedLegajo] = useState(null);
  const [filterCliente, setFilterCliente] = useState('');

  useEffect(() => {
    cargarLegajos();
  }, []);

  const cargarLegajos = async () => {
    try {
      const res = await fetch('/api/legajos');
      if (res.ok) {
        const data = await res.json();
        setLegajos(data);
      }
    } catch (err) {
      console.error('Error cargando legajos:', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarLegajo = async (id) => {
    if (confirm('¿Eliminar este legajo?')) {
      try {
        await fetch(`/api/legajos/${id}`, { method: 'DELETE' });
        cargarLegajos();
        setSelectedLegajo(null);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const legajosFiltrados = legajos.filter(l => {
    if (!filterCliente) return true;
    return l.cliente_nombre?.toLowerCase().includes(filterCliente.toLowerCase());
  });

  const renderDatosPersonales = (datos) => (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>📋 Datos Personales</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <p><strong>Nombre:</strong> {datos.nombre}</p>
        <p><strong>Fecha Nac:</strong> {datos.fechaNacimiento || '-'}</p>
        <p><strong>Teléfono:</strong> {datos.telefono}</p>
        <p><strong>Email:</strong> {datos.email || '-'}</p>
        <p><strong>Dirección:</strong> {datos.direccion || '-'}</p>
        <p><strong>Ocupación:</strong> {datos.ocupacion || '-'}</p>
      </div>
    </div>
  );

  const renderSeccion = (titulo, datos, icon = '📋') => {
    const camposLlenos = Object.values(datos).some(v => v && v.trim());
    if (!camposLlenos) return null;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{icon} {titulo}</h4>
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
          {Object.entries(datos).map(([key, value]) => {
            if (!value || !value.trim()) return null;
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <p key={key} style={{ marginBottom: '8px' }}>
                <strong>{label}:</strong> {value}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLegajoDetalle = (legajo) => {
    const datos = legajo.datos;
    
    return (
      <div className="modal-overlay" onClick={() => setSelectedLegajo(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
          <div className="modal-header">
            <div>
              <h2>📋 Legajo de Anamnesis Facial</h2>
              <small style={{ color: 'var(--gray)' }}>
                Cliente: {legajo.cliente_nombre} | Fecha: {new Date(legajo.fecha).toLocaleDateString('es-AR')}
              </small>
            </div>
            <button className="modal-close" onClick={() => setSelectedLegajo(null)}>×</button>
          </div>
          
          <div style={{ padding: '20px' }}>
            {renderDatosPersonales(datos.datosPersonales || {})}
            {renderSeccion('Salud General', datos.saludGeneral || {}, '🏥')}
            {renderSeccion('Hábitos y Estilo de Vida', datos.habitos || {}, '🌿')}
            {renderSeccion('Cuidados y Rutina Cosmética', datos.rutinaCosmetica || {}, '💄')}
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#e3f2fd', 
              borderRadius: '8px',
              border: '2px solid var(--info)'
            }}>
              <h4 style={{ color: 'var(--info)', marginBottom: '10px' }}>🩺 Evaluación Profesional</h4>
              {renderSeccion('', datos.evaluacionProfesional || {}, '')}
            </div>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#e8f5e9', 
              borderRadius: '8px',
              border: '2px solid var(--success)'
            }}>
              <h4 style={{ color: 'var(--success)', marginBottom: '10px' }}>📝 Plan de Tratamiento</h4>
              {renderSeccion('', datos.planTratamiento || {}, '')}
            </div>

            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => eliminarLegajo(legajo.id)}
                className="btn-delete"
                style={{ background: 'var(--danger)' }}
              >
                🗑️ Eliminar Legajo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner">⏳</div>
        <p>Cargando legajos...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre de cliente..."
          value={filterCliente}
          onChange={(e) => setFilterCliente(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {legajosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay legajos registrados</h3>
          <p>Los legajos de anamnesis aparecerán aquí cuando los clientes completen la planilla</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {legajosFiltrados.map(legajo => (
            <div 
              key={legajo.id} 
              className="card"
              style={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent'
              }}
              onClick={() => setSelectedLegajo(legajo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--dark)' }}>
                    👤 {legajo.cliente_nombre}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', color: 'var(--gray)', fontSize: '0.9rem' }}>
                    📅 {new Date(legajo.fecha).toLocaleDateString('es-AR')} | 💆 {legajo.tratamiento}
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: 'var(--gray)', fontSize: '0.85rem' }}>
                    📱 {legajo.cliente_telefono}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    background: legajo.tipo === 'facial' ? '#fce4ec' : '#e3f2fd',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: legajo.tipo === 'facial' ? 'var(--primary)' : 'var(--info)'
                  }}>
                    {legajo.tipo === 'facial' ? '✨ Facial' : '💇‍♀️ Otro'}
                  </div>
                  <small style={{ color: 'var(--gray)', marginTop: '5px', display: 'block' }}>
                    Creado: {new Date(legajo.created_at).toLocaleDateString('es-AR')}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLegajo && renderLegajoDetalle(selectedLegajo)}
    </div>
  );
}
