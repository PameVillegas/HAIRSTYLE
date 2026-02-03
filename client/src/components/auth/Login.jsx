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

    // Login temporal mientras arreglamos la base de datos
    if (tipo === 'admin') {
      if ((email === 'admin' && password === 'admin123') || 
          (email === 'Abitu' && password === 'Abitu26')) {
        onLogin({
          id: 1,
          username: email,
          nombre: email === 'admin' ? 'Administrador' : 'Administrador Abitu',
          rol: 'admin'
        }, tipo);
        setLoading(false);
        return;
      } else {
        setError('Credenciales incorrectas. Usa: admin/admin123 o Abitu/Abitu26');
        setLoading(false);
        return;
      }
    }

    // Para clientes, permitir cualquier credencial por ahora
    if (tipo === 'cliente') {
      onLogin({
        id: 2,
        nombre: 'Cliente Demo',
        telefono: email,
        email: email
      }, tipo);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>💇‍♀️ HairStyle</h2>
        <p className="subtitle">Ingresá a tu cuenta</p>

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Usuario o Email"
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
            💡 Admin: usa "admin"/"admin123" o "Abitu"/"Abitu26"
          </p>
        )}
      </form>
    </div>
  );
}
