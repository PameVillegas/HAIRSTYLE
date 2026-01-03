-- Base de datos HairStyleAbii
-- Fase 1: Estructura básica con tratamientos y precios

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tratamientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  duracion INT DEFAULT 60 COMMENT 'Duración en minutos',
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  tratamiento_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'completado', 'cancelado') DEFAULT 'pendiente',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id)
);

-- Insertar tratamientos por defecto
INSERT INTO tratamientos (nombre, precio, duracion, descripcion) VALUES
('Alisado', 15000, 120, 'Alisado permanente'),
('Tratamiento Capilar', 8000, 60, 'Tratamiento nutritivo'),
('Depilación Facial', 3000, 30, 'Depilación completa facial'),
('Botox Capilar', 12000, 90, 'Botox para el cabello'),
('Keratina', 18000, 150, 'Tratamiento de keratina'),
('Nutrición Capilar', 7000, 60, 'Nutrición profunda');
