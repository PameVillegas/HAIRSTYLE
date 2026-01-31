💇‍♀️ HAIRSTYLE ABII – Sistema de Turnos

Aplicación web para la gestión de turnos de peluquería.
Permite organizar citas de clientes, administrar horarios y automatizar recordatorios.

🚀 Tecnologías usadas

Frontend

HTML

CSS

JavaScript

(React si lo estás usando)

Backend

Node.js

Express

MySQL

dotenv

CORS

📁 Estructura del proyecto
HAIRSTYLE/
│
├── client/                → Frontend
├── server/
│   ├── config/            → Configuración de base de datos
│   ├── database/          → Esquema SQL
│   ├── routes/            → Rutas del servidor
│   ├── services/          → Lógica (ej: WhatsApp)
│   ├── server.js          → Servidor principal
│
├── .env.example           → Variables de entorno de ejemplo
├── package.json
└── README.md

⚙️ Instalación

1️⃣ Clonar el repositorio

git clone https://github.com/PameVillegas/HAIRSTYLE.git
cd HAIRSTYLE


2️⃣ Instalar dependencias del servidor

cd server
npm install


3️⃣ Crear archivo .env

Basarse en .env.example

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hairstyle


4️⃣ Iniciar servidor

npm run dev


Servidor corriendo en:
👉 http://localhost:3000

🗄 Base de datos

Importar el archivo:

server/database/schema.sql


en MySQL.

📌 Funcionalidades

✔ Gestión de turnos
✔ Organización de clientes
✔ Conexión a base de datos MySQL
✔ Servidor Express modular
✔ Preparado para integración con WhatsApp

🛠 Próximas mejoras

Panel administrador

Login de usuarios

Calendario visual

Recordatorios automáticos

Deploy online

👩‍💻 Autora

Pamela Villegas
Técnica en Análisis de Sistemas
Proyecto de práctica profesional