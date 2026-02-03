import React from "react";

export default function Tabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'turnos', icon: '📅', label: 'Turnos' },
    { id: 'nuevo', icon: '➕', label: 'Nuevo Turno' },
    { id: 'clientes', icon: '👤', label: 'Agregar Cliente' },
    { id: 'lista-clientes', icon: '📋', label: 'Clientes' },
    { id: 'promociones', icon: '🎉', label: 'Promociones' },
    { id: 'galeria', icon: '📸', label: 'Galería' },
    { id: 'mensajes', icon: '💬', label: 'Mensajes' }
  ];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
