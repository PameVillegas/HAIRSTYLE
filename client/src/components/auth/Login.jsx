import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tipo === 'admin' ? '/api/auth/admin' : '/api/auth/cliente';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: email, // Para admin, usar email como username
          telefono: email, // Para cliente, usar email como teléfono temporalmente
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, tipo);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>💇‍♀️ HairStyle</h2>
        <p className="subtitle">Ingresá a tu cuenta</p>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
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

        <select value={tipo} onChange={e => setTipo(e.target.value)} disabled={loading}>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {tipo === 'admin' && (
          <p className="admin-hint">
            💡 Admin: usa "admin" como email y "admin123" como contraseña
          </p>
        )}
      </form>
    </div>
  );
}
