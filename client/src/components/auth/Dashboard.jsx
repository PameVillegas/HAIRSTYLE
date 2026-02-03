import React from "react";

export default function Dashboard() {
  return (
    <div className="card">
      <div className="card-header">
        <h2>📊 Dashboard</h2>
        <p className="card-subtitle">Panel de administración / información general</p>
      </div>
      <div className="card-body">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-icon">📅</div>
            <h3>Gestión de Turnos</h3>
            <p>Administra citas y horarios de tus clientes</p>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-icon">👥</div>
            <h3>Clientes</h3>
            <p>Gestiona la información de tus clientes</p>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-icon">💄</div>
            <h3>Tratamientos</h3>
            <p>Servicios disponibles con precios actualizados</p>
            <div className="treatment-list">
              <div className="treatment-item">
                <span>💫 LIFTING DE PESTAÑAS</span>
                <span className="price">$14.000</span>
              </div>
              <div className="treatment-item">
                <span>✨ Diseño y perfilado de cejas</span>
                <span className="price">$10.000</span>
              </div>
              <div className="treatment-item">
                <span>💇‍♀️ Baños de crema</span>
                <span className="price">$15.000</span>
              </div>
              <div className="treatment-item">
                <span>🧴 Limpiezas faciales</span>
                <span className="price">$20.000</span>
              </div>
              <div className="treatment-item">
                <span>💫 Alisados</span>
                <span className="price">Consultar</span>
              </div>
              <div className="treatment-item">
                <span>💃 Peinados</span>
                <span className="price">Consultar</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-icon">💬</div>
            <h3>WhatsApp</h3>
            <p>Mensajes automáticos para confirmación de turnos</p>
          </div>
        </div>
        
        <div className="welcome-message">
          <h3>¡Bienvenido/a a HairStyle! 💇‍♀️</h3>
          <p>Usa las pestañas de arriba para navegar por las diferentes secciones de tu aplicación.</p>
        </div>
      </div>
    </div>
  );
}
