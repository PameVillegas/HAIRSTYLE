// Base de datos en memoria (temporal)
const clientes = [];
const turnos = [];
let clienteIdCounter = 1;
let turnoIdCounter = 1;

const db = {
  prepare: (query) => {
    return {
      all: () => {
        if (query.includes('SELECT * FROM clientes')) return clientes;
        if (query.includes('SELECT t.*, c.nombre')) {
          return turnos.map(t => {
            const cliente = clientes.find(c => c.id === t.cliente_id);
            return { ...t, cliente_nombre: cliente?.nombre, telefono: cliente?.telefono };
          });
        }
        return [];
      },
      get: (id) => {
        if (query.includes('SELECT * FROM clientes WHERE id')) {
          return clientes.find(c => c.id === parseInt(id));
        }
        if (query.includes('turnos')) {
          return turnos.find(t => t.id === parseInt(id));
        }
        return null;
      },
      run: (...params) => {
        if (query.includes('INSERT INTO clientes')) {
          const [nombre, telefono, email] = params;
          const cliente = { id: clienteIdCounter++, nombre, telefono, email };
          clientes.push(cliente);
          return { lastInsertRowid: cliente.id };
        }
        if (query.includes('UPDATE clientes')) {
          const [nombre, telefono, email, id] = params;
          const cliente = clientes.find(c => c.id === parseInt(id));
          if (cliente) {
            cliente.nombre = nombre;
            cliente.telefono = telefono;
            cliente.email = email;
          }
          return { changes: 1 };
        }
        if (query.includes('DELETE FROM clientes')) {
          const [id] = params;
          const index = clientes.findIndex(c => c.id === parseInt(id));
          if (index > -1) clientes.splice(index, 1);
          return { changes: 1 };
        }
        if (query.includes('INSERT INTO turnos')) {
          const [cliente_id, tratamiento, fecha, hora, notas] = params;
          const turno = { 
            id: turnoIdCounter++, 
            cliente_id: parseInt(cliente_id), 
            tratamiento, 
            fecha, 
            hora, 
            notas, 
            estado: 'pendiente' 
          };
          turnos.push(turno);
          return { lastInsertRowid: turno.id };
        }
        if (query.includes('UPDATE turnos')) {
          const [estado, id] = params;
          const turno = turnos.find(t => t.id === parseInt(id));
          if (turno) turno.estado = estado;
          return { changes: 1 };
        }
        if (query.includes('DELETE FROM turnos')) {
          const [id] = params;
          const index = turnos.findIndex(t => t.id === parseInt(id));
          if (index > -1) turnos.splice(index, 1);
          return { changes: 1 };
        }
        return { changes: 0 };
      }
    };
  }
};

export default db;
