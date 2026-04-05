import { useState, useEffect } from 'react';
import Registro from './Registro';
import RegistroAdmin from './RegistroAdmin';

export default function Login({ onLogin }) {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarRegistroAdmin, setMostrarRegistroAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Login component mounted');
  }, []);

  console.log('Login component rendering');

  if (mostrarRegistro) {
    return <Registro onBack={() => setMostrarRegistro(false)} />;
  }

  if (mostrarRegistroAdmin) {
    return <RegistroAdmin onBack={() => setMostrarRegistroAdmin(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tipo === 'admin' ? '/api/auth/admin' : '/api/auth/cliente';
      const requestData = { username: email, password: password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.user, tipo);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img 
          src="/fotos/logo.png" 
          alt="HairStyle" 
          className="login-logo"
        />
        <h2>HairStyle</h2>
        <p className="subtitle">Ingresá a tu cuenta</p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />

          <select 
            value={tipo} 
            onChange={e => setTipo(e.target.value)}
            disabled={loading}
            className="login-select"
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {tipo === 'cliente' && (
          <button
            onClick={() => setMostrarRegistro(true)}
            className="login-register-btn"
          >
            📝 ¿No tenés cuenta? Registrate
          </button>
        )}
      </div>
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #e91e63, #9c27b0);
        }
        .login-box {
          background: white;
          padding: 30px;
          border-radius: 16px;
          width: 100%;
          max-width: 360px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .login-logo {
          display: block;
          margin: 0 auto 15px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
        .login-box h2 {
          text-align: center;
          color: #e91e63;
          margin-bottom: 10px;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 20px;
        }
        .login-input, .login-select {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-sizing: border-box;
          font-size: 16px;
        }
        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #e91e63, #9c27b0);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .login-register-btn {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          background: transparent;
          color: #e91e63;
          border: 2px solid #e91e63;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}