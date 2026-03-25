import { useState } from "react";

export default function MobileNav({ activeTab, onTabChange, tabs, onLogout, usuario, tipoUsuario }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e91e63' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#e91e63' }}>HairStyle</h1>
            <small style={{ color: '#666' }}>{tipoUsuario === 'admin' ? 'Administrador' : 'Cliente'}</small>
          </div>
        </div>
        <button 
          onClick={onLogout}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          🚪
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '15px', paddingBottom: '90px' }}>
        {/* Contenido se renderiza aquí desde el padre */}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        display: 'flex',
        overflowX: 'auto',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
        padding: '8px 5px',
        gap: '5px',
        zIndex: 100
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flexShrink: 0,
              padding: '10px 8px',
              border: activeTab === tab.id ? '2px solid #e91e63' : '2px solid #ddd',
              background: activeTab === tab.id ? '#fce4ec' : 'white',
              borderRadius: '10px',
              fontSize: '0.7rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              color: activeTab === tab.id ? '#e91e63' : '#666',
              minWidth: '60px'
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{tab.icon}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
