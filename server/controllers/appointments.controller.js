export const getAppointments = (req, res) => {
  res.json({ message: "Lista de turnos (próximamente desde base de datos)" });
};

export const createAppointment = (req, res) => {
  const { clientName, date, service } = req.body;

  res.json({
    message: "Turno creado correctamente",
    data: { clientName, date, service }
  });
};
