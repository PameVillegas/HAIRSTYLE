import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('cliente');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de login
    onLogin(
      { nombre: 'Usuario Demo', email },
      tipo
    );
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>💇‍♀️ HairStyle</h2>
        <p className="subtitle">Ingresá a tu cuenta</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
