# 💇 HairStyleAbii - Sistema de Gestión de Turnos

Sistema profesional de gestión de turnos para salón de belleza con base de datos MySQL, autenticación dual y diseño responsive.

## ✨ Características Principales

### 🔐 Sistema Dual de Autenticación
- **Admin**: Panel completo de gestión (usuario: `admin`, contraseña: `admin123`)
- **Clientes**: Portal para solicitar turnos y ver historial

### 📊 Panel de Administración
- Dashboard con estadísticas en tiempo real
- Gestión completa de turnos (crear, editar, eliminar)
- Administración de clientes
- Control de promociones y galería
- Reportes de ingresos mensuales/anuales
- Mensajes de WhatsApp para copiar y enviar

### 👥 Portal de Clientes
- Solicitud de turnos online
- Visualización de historial personal
- Galería de trabajos realizados
- Promociones del mes

### 📱 Diseño Responsive
- Optimizado para móviles y tablets
- Navegación adaptativa (hamburger menu + bottom nav)
- Touch targets optimizados
- Prevención de zoom en iOS

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **MySQL** con pool de conexiones
- **WhatsApp** (mensajes guardados para envío manual)

### Frontend
- **React** con Vite
- **CSS moderno** con variables y gradientes
- **Responsive design** mobile-first

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+ (MySQL Workbench recomendado)

### 1. Clonar e Instalar
```bash
git clone <repository-url>
cd hairstyle-abii
npm run install-all
```

### 2. Configurar MySQL
1. Abrir MySQL Workbench
2. Crear conexión local (puerto 3306)
3. Configurar usuario `root` con contraseña `123456`
4. La base de datos `hairstyle_db` se crea automáticamente

### 3. Configurar Variables de Entorno
Crear `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=hairstyle_db
PORT=3000
NODE_ENV=development
```

### 4. Iniciar Aplicación
```bash
# Desarrollo (ambos servidores)
npm run dev

# Solo servidor
npm run server

# Solo cliente
npm run client

# Usar script de Windows
iniciar-app.bat
```

## 📋 Datos de Prueba

### Usuario Admin
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Tratamientos Incluidos
- Alisado ($15,000 - 120 min)
- Tratamiento Capilar ($8,000 - 60 min)
- Depilación Facial ($3,000 - 30 min)
- Botox Capilar ($12,000 - 90 min)
- Keratina ($18,000 - 150 min)
- Nutrición Capilar ($7,000 - 60 min)

### Promociones de Ejemplo
- 🎉 Promo Mes del Cabello (20% descuento)
- 💆 Combo Especial ($20,000)
- ✨ Primera Vez (15% descuento)

## 🎯 Funcionalidades Clave

### Gestión de Turnos
- Creación con validación de datos
- Estados: Pendiente, Confirmado, Completado, Cancelado
- Edición para manejar cancelaciones
- Mensajes automáticos para WhatsApp

### Estadísticas y Reportes
- Total de clientes y turnos
- Ingresos mensuales y anuales
- Tratamientos más populares
- Gráficos interactivos

### Sistema de Promociones
- Descuentos por porcentaje
- Precios especiales
- Fechas de vigencia
- Imágenes promocionales

### Galería de Trabajos
- Categorización por tipo de tratamiento
- Imágenes de alta calidad
- Gestión desde panel admin

## 📱 Optimización Móvil

- **Header fijo** con logo y menú hamburguesa
- **Bottom navigation** para acceso rápido
- **Touch targets** de 44px mínimo
- **Prevención de zoom** en inputs iOS
- **Diseño adaptativo** para landscape

## 🔧 Estructura del Proyecto

```
hairstyle-abii/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   └── index.css      # Estilos globales
│   └── dist/              # Build de producción
├── server/                # Backend Node.js
│   ├── database.js        # Configuración MySQL
│   ├── server.js          # Servidor Express
│   └── whatsapp.js        # Integración WhatsApp
└── iniciar-app.bat        # Script de inicio Windows
```

## 🌐 Acceso Remoto

Para acceder desde otros dispositivos en la misma red:
1. Obtener IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Acceder desde otro dispositivo: `http://[IP]:3000`

## 📝 Notas de Desarrollo

- Los mensajes de WhatsApp se guardan en `mensajes-pendientes.txt`
- La base de datos se inicializa automáticamente con datos de ejemplo
- El sistema está optimizado para producción con logs mínimos
- Todas las consultas SQL usan prepared statements para seguridad

## 🎨 Personalización

### Colores del Tema
```css
:root {
  --primary: #e91e63;      /* Rosa principal */
  --secondary: #9c27b0;    /* Púrpura secundario */
  --success: #4caf50;      /* Verde éxito */
  --warning: #ff9800;      /* Naranja advertencia */
  --danger: #f44336;       /* Rojo peligro */
}
```

### Modificar Logo
Reemplazar `client/public/logo.jpg` con imagen de 200x200px

## 🌐 Despliegue Online

Para tener tu app accesible desde cualquier dispositivo con un link como `https://hairstyle-abi.onrender.com`:

### Opción 1: Render.com (Gratis)
1. Ejecutar `deploy-prep.bat`
2. Subir código a GitHub
3. Conectar repositorio en Render.com
4. Configurar variables de entorno
5. ¡Desplegar!

### Opción 2: Railway.app (Rápido)
1. Ejecutar `deploy-prep.bat`
2. Subir código a GitHub  
3. Conectar en Railway.app
4. Deploy automático

**Ver guía completa**: `DESPLIEGUE-PASO-A-PASO.md`

## 🚀 Despliegue en Producción

1. **Build del cliente**:
   ```bash
   npm run build
   ```

2. **Variables de entorno de producción**:
   ```env
   NODE_ENV=production
   PORT=3000
   ```

3. **Iniciar servidor**:
   ```bash
   npm start
   ```

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al desarrollador.

---

**HairStyleAbii** - Sistema profesional de gestión de turnos v1.0.0