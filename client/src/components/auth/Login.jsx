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

  const wrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #e91e63, #9c27b0)'
  };

  const boxStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  };

  const logoStyle = {
    display: 'block',
    margin: '0 auto 15px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const registerBtnStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    background: 'transparent',
    color: '#e91e63',
    border: '2px solid #e91e63',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  return (
    <div style={wrapperStyle}>
      <div style={boxStyle}>
        <img 
          src="/fotos/logo.png" 
          alt="HairStyle" 
          style={logoStyle}
        />
        <h2 style={{textAlign: 'center', color: '#e91e63', marginBottom: '10px'}}>HairStyle</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Ingresá a tu cuenta</p>

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
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
          />

          <select 
            value={tipo} 
            onChange={e => setTipo(e.target.value)}
            disabled={loading}
            style={inputStyle}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {tipo === 'cliente' && (
          <button
            onClick={() => setMostrarRegistro(true)}
            style={registerBtnStyle}
          >
            📝 ¿No tenés cuenta? Registrate
          </button>
        )}
      </div>
    </div>
  );
}