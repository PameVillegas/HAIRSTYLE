# 🚀 Despliegue Paso a Paso - HairStyleAbii

## 🎯 Objetivo
Tener tu app accesible desde cualquier dispositivo con el link: **hairstyle-abi**

---

## 📋 Preparación (5 minutos)

### 1. Preparar el código
```bash
# Ejecutar script de preparación
deploy-prep.bat
```

### 2. Subir a GitHub
1. Crear repositorio en GitHub llamado `hairstyle-abi`
2. Subir todo el código:
```bash
git init
git add .
git commit -m "Initial commit - HairStyleAbii"
git remote add origin https://github.com/TU-USUARIO/hairstyle-abi.git
git push -u origin main
```

---

## 🌐 Opción 1: Render.com (GRATIS)

### Paso 1: Crear cuenta
1. Ve a https://render.com
2. Regístrate con GitHub

### Paso 2: Crear base de datos
1. En Render Dashboard: **"New"** → **"PostgreSQL"**
2. **Name**: `hairstyle-db`
3. **Plan**: Free
4. Click **"Create Database"**
5. **Guarda la connection info** (la necesitarás)

### Paso 3: Crear web service
1. **"New"** → **"Web Service"**
2. Conecta tu repositorio `hairstyle-abi`
3. **Name**: `hairstyle-abi`
4. **Build Command**: 
   ```
   cd client && npm install && npm run build && cd ../server && npm install
   ```
5. **Start Command**: 
   ```
   cd server && npm start
   ```
6. **Plan**: Free

### Paso 4: Variables de entorno
En la sección **Environment**:
```
NODE_ENV=production
DB_HOST=[host de tu base de datos]
DB_PORT=5432
DB_USER=[usuario de tu base de datos]
DB_PASSWORD=[password de tu base de datos]
DB_NAME=hairstyle_db
```

### Paso 5: Deploy
1. Click **"Create Web Service"**
2. Espera 5-10 minutos
3. **Tu app estará en**: `https://hairstyle-abi.onrender.com`

---

## 🚄 Opción 2: Railway.app (Más rápido)

### Paso 1: Crear cuenta
1. Ve a https://railway.app
2. Regístrate con GitHub

### Paso 2: Nuevo proyecto
1. **"New Project"** → **"Deploy from GitHub repo"**
2. Selecciona `hairstyle-abi`
3. Railway detecta automáticamente Node.js

### Paso 3: Agregar base de datos
1. En el proyecto: **"New"** → **"Database"** → **"Add MySQL"**
2. Railway crea automáticamente las variables de entorno

### Paso 4: Configurar dominio
1. Ve a **Settings** → **"Generate Domain"**
2. Cambia a: `hairstyle-abi.up.railway.app`

### Paso 5: Deploy automático
- Railway despliega automáticamente
- **Tu app estará en**: `https://hairstyle-abi.up.railway.app`

---

## 🔧 Configuración de Base de Datos

### Si usas MySQL en la nube (PlanetScale):
1. Crear cuenta en https://planetscale.com
2. Crear base de datos `hairstyle-db`
3. Obtener connection string
4. Usar en variables de entorno

### Si usas PostgreSQL (Render):
Necesitas convertir las queries MySQL a PostgreSQL. Te ayudo si eliges esta opción.

---

## 📱 Verificar Funcionamiento

### 1. Abrir en navegador
- Ve a tu link: `https://hairstyle-abi.onrender.com`

### 2. Probar en móvil
- Abre el link en tu teléfono
- Verifica que se vea bien
- Prueba todas las funciones

### 3. Probar desde otra red
- Comparte el link con amigos/familia
- Que lo abran desde sus dispositivos
- Verificar que funciona desde cualquier lugar

---

## 🎨 Dominio Personalizado (Opcional)

### Para tener: `https://hairstyleabi.com`

1. **Comprar dominio** (GoDaddy, Namecheap): ~$15/año
2. **En Render/Railway**: 
   - Ve a Settings → Custom Domain
   - Agrega tu dominio
   - Configura DNS según instrucciones

---

## ⚡ Comandos Rápidos

### Render (todo en uno):
```bash
# 1. Preparar
deploy-prep.bat

# 2. Subir a GitHub
git add . && git commit -m "Deploy ready" && git push

# 3. Ir a render.com y seguir pasos arriba
```

### Railway (más simple):
```bash
# 1. Preparar
deploy-prep.bat

# 2. Subir a GitHub  
git add . && git commit -m "Deploy ready" && git push

# 3. Ir a railway.app y conectar repo
```

---

## 🎯 Resultado Final

✅ **Link público**: `https://hairstyle-abi.onrender.com`  
✅ **Accesible desde cualquier dispositivo**  
✅ **Cualquier red WiFi/datos móviles**  
✅ **Funciona en todo el mundo**  
✅ **SSL automático (seguro)**  
✅ **Base de datos en la nube**  

---

## 💡 Tips

- **Render Free**: Se "duerme" después de 15 min sin uso, tarda ~30s en despertar
- **Railway**: Más rápido, $5/mes después de límite gratuito
- **Backup**: Siempre haz backup de tu base de datos
- **Updates**: Cada push a GitHub actualiza automáticamente la app

---

## 🆘 Si necesitas ayuda

1. **Error de build**: Revisa los logs en el dashboard
2. **Error de base de datos**: Verifica las variables de entorno
3. **App no carga**: Espera unos minutos, puede estar "despertando"

¿Listo para desplegar? ¡Empecemos! 🚀