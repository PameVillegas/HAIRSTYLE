import React, { useEffect, useState } from "react";

export default function ClientePortal() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reemplazá con la URL correcta de tu backend
  const API_URL = "http://localhost:3001/api/appointments";

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al cargar los turnos");
        const data = await response.json();
        setTurnos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  if (loading) return <p>Cargando turnos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Portal del Cliente</h1>
      {turnos.length === 0 ? (
        <p>No tienes turnos programados.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tratamiento</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.id}</td>
                <td>{turno.tratamiento_id}</td>
                <td>{turno.fecha}</td>
                <td>{turno.hora}</td>
                <td>{turno.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
