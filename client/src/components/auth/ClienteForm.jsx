import { useState } from "react";

export default function ClienteForm({ cliente, onChange, onSubmit, onCancel, isEditing, loading }) {
  const [formData, setFormData] = useState({
    username: cliente?.username || '',
    nombre: cliente?.nombre || '',
    telefono: cliente?.telefono || '',
    email: cliente?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (onChange) onChange({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>👤 {isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
        <p className="card-subtitle">{isEditing ? 'Modifica los datos del cliente' : 'Agrega los datos del nuevo cliente'}</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Usuario *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Nombre y apellido"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Número de WhatsApp"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Contraseña {isEditing ? '(dejar vacío para mantener)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder={isEditing ? 'Nueva contraseña' : 'Contraseña'}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                background: '#673ab7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '14px 20px',
                  background: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
