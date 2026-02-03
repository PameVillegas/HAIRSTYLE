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
      
      // Preparar datos según el tipo de usuario
      let requestData;
      if (tipo === 'admin') {
        requestData = {
          username: email, // Para admin, el campo "email" del form es realmente el username
          password: password
        };
      } else {
        requestData = {
          telefono: email, // Para cliente, el campo "email" del form es realmente el teléfono
          password: password
        };
      }
      
      console.log('Intentando login:', { endpoint, requestData, tipo });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        console.log('Login exitoso:', data.user);
        onLogin(data.user, tipo);
      } else {
        console.log('Login falló:', data);
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión: ' + error.message);
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
          type="text"
          placeholder={tipo === 'admin' ? "Usuario" : "Teléfono"}
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
            💡 Admin: usa "admin"/"admin123" o "Abitu"/"Abitu26" (base de datos real)
          </p>
        )}
      </form>
    </div>
  );
}
