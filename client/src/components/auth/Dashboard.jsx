import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    fetch('/api/tratamientos')
      .then(res => res.json())
      .then(data => setTreatments(data))
      .catch(err => console.error('Error cargando tratamientos:', err));
  }, []);

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
              {treatments.length === 0 ? (
                <p>Cargando tratamientos...</p>
              ) : (
                treatments.map(t => (
                  <div key={t.id} className="treatment-item">
                    <span>💫 {t.nombre}</span>
                    <span className="price">
                      {t.precio === "0.00"
                        ? "Consultar"
                        : `$${parseFloat(t.precio).toLocaleString('es-AR')}`}
                    </span>
                  </div>
                ))
              )}
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
