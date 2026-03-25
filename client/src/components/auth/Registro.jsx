import { useState } from 'react';
import './Login.css';

const API_URL = '/api';

export default function Registro({ onBack }) {
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, nombre, telefono, email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        onBack();
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>📝 Registrarse</h2>
        <p className="subtitle">Creá tu cuenta de cliente</p>

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <button 
          type="button" 
          className="btn-link"
          onClick={onBack}
          disabled={loading}
        >
          ← Volver al login
        </button>
      </form>
    </div>
  );
}
