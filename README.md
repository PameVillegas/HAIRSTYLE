# 💆 Sistema de Gestión de Turnos - Beauty

Aplicación para gestionar turnos de tratamientos de belleza con notificaciones automáticas por WhatsApp.

## 🚀 Características

- ✅ Gestión de clientes
- ✅ Creación y seguimiento de turnos
- ✅ Notificaciones automáticas por WhatsApp Web
- ✅ Estados de turnos (pendiente, confirmado, completado)
- ✅ Tratamientos: Alisado, Tratamiento Capilar, Depilación Facial, etc.

## 📋 Requisitos

- Node.js 18+
- WhatsApp en tu teléfono

## 🔧 Instalación Rápida

Ejecuta el archivo `instalar.bat` o manualmente:

```bash
npm install
cd server
npm install
cd ../client
npm install
```

## ▶️ Ejecutar la aplicación

Ejecuta el archivo `iniciar.bat` o manualmente:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Esto iniciará:
- Backend en http://localhost:3000
- Frontend en http://localhost:5173

## 📱 Envío de Mensajes WhatsApp

### Modo Actual: Manual

Cuando creas un turno:
1. El mensaje se muestra en la consola del servidor
2. Se guarda automáticamente en `mensajes-pendientes.txt`
3. Copia el mensaje y envíalo por WhatsApp

**Ventajas:**
- ✅ Funciona inmediatamente sin configuración
- ✅ Sin problemas de compatibilidad
- ✅ Control total sobre los mensajes

### Archivo de mensajes

Todos los mensajes se guardan en: `mensajes-pendientes.txt`

Puedes abrirlo con el Bloc de notas y copiar los mensajes.

## 🎯 Uso

1. **Agregar Clientes**: Ir a la pestaña "Clientes" y agregar información
   - Formato de teléfono: +5491123456789 (con código de país)
2. **Crear Turno**: Seleccionar cliente, tratamiento, fecha y hora
3. **WhatsApp Automático**: Al crear el turno, se envía automáticamente
4. **Gestionar Estados**: Cambiar el estado según avance

## 📊 Base de Datos

Base de datos en memoria (se reinicia al cerrar el servidor).
Los datos se pierden al reiniciar.

## 🛠️ Tecnologías

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **WhatsApp**: whatsapp-web.js (gratis, usa WhatsApp Web)

## 📝 Notas Importantes

- Los números deben incluir código de país: +54 (Argentina)
- Mantén el servidor corriendo para envío automático
- Si WhatsApp no está conectado, los mensajes se guardan en `mensajes-pendientes.txt`
- La primera conexión puede tardar 1-2 minutos
