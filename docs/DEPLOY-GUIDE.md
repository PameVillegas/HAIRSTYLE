# 🚀 Guía de Despliegue - HairStyleAbii

## 🌐 Opciones para Link Personalizado "hairstyle-abi"

### 1. **Render.com** (GRATIS - Recomendado)

#### Pasos:
1. **Crear cuenta en Render.com**
   - Ve a https://render.com
   - Regístrate con GitHub/Google

2. **Conectar repositorio**
   - Sube tu código a GitHub
   - En Render: "New" → "Web Service"
   - Conecta tu repositorio

3. **Configurar servicio**
   - **Name**: `hairstyle-abi`
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

4. **Configurar base de datos**
   - En Render: "New" → "PostgreSQL" (gratis)
   - O usar MySQL externo (PlanetScale gratis)

5. **Variables de entorno**:
   ```
   NODE_ENV=production
   DB_HOST=[tu-host-db]
   DB_USER=[tu-usuario-db]
   DB_PASSWORD=[tu-password-db]
   DB_NAME=hairstyle_db
   PORT=3000
   ```

6. **Tu link será**: `https://hairstyle-abi.onrender.com`

---

### 2. **Railway.app** (Fácil)

#### Pasos:
1. **Crear cuenta en Railway.app**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Nuevo proyecto**
   - "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configurar**
   - Railway detecta automáticamente Node.js
   - Agrega base de datos MySQL desde el dashboard

4. **Variables de entorno** (automáticas con Railway)

5. **Dominio personalizado**:
   - En Settings → "Generate Domain"
   - Puedes usar: `hairstyle-abi.up.railway.app`

---

### 3. **Vercel + PlanetScale** (Profesional)

#### Para Frontend (Vercel):
1. **Subir a Vercel**
   - Ve a https://vercel.com
   - Conecta GitHub y despliega carpeta `client`

#### Para Backend (Railway/Render):
1. **Despliega backend** en Railway/Render
2. **Actualiza API_URL** en el frontend

---

## 🗃️ Base de Datos en la Nube

### Opción 1: PlanetScale (MySQL - Gratis)
```bash
# 1. Crear cuenta en planetscale.com
# 2. Crear base de datos "hairstyle-db"
# 3. Obtener connection string
# 4. Usar en variables de entorno
```

### Opción 2: Render PostgreSQL (Gratis)
```bash
# Se crea automáticamente con render.yaml
# Convierte automáticamente las queries MySQL
```

---

## 📱 Configuración para Móviles

### Actualizar CORS para producción:
```javascript
// En server.js
app.use(cors({
  origin: [
    'https://hairstyle-abi.onrender.com',
    'https://hairstyle-abi.vercel.app',
    'http://localhost:5173'
  ]
}));
```

---

## 🔧 Preparar para Despliegue

### 1. Actualizar API_URL en cliente:
```javascript
// client/src/App.jsx
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hairstyle-abi.onrender.com/api'
  : '/api';
```

### 2. Variables de entorno de producción:
```env
NODE_ENV=production
DB_HOST=tu-host-mysql
DB_PORT=3306
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=hairstyle_db
PORT=3000
```

---

## 🌐 Resultado Final

Después del despliegue tendrás:

✅ **Link público**: `https://hairstyle-abi.onrender.com`
✅ **Accesible desde cualquier dispositivo**
✅ **Cualquier red/país**
✅ **Base de datos en la nube**
✅ **SSL automático (HTTPS)**
✅ **Dominio personalizado disponible**

---

## 💰 Costos

- **Render Free**: $0/mes (con limitaciones)
- **Railway Hobby**: $5/mes (sin limitaciones)
- **Vercel Pro**: $20/mes (profesional)
- **Dominio personalizado**: $10-15/año

---

## 🚀 Pasos Rápidos (Render)

1. Sube código a GitHub
2. Conecta a Render.com
3. Configura build commands
4. Agrega variables de entorno
5. ¡Despliega!

**Tu app estará en**: `https://hairstyle-abi.onrender.com`

¿Necesitas ayuda con algún paso específico?