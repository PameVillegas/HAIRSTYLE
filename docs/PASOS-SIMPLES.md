# 🚀 PASOS SIMPLES - Desplegar HairStyleAbii

## ⚡ Opción Más Fácil: Railway.app

### PASO 1: Preparar código (2 minutos)
```bash
# En tu carpeta del proyecto:
deploy-prep.bat
```

### PASO 2: Subir a GitHub (5 minutos)
1. Ve a https://github.com
2. **"New repository"** → Nombre: `hairstyle-abi`
3. En tu carpeta del proyecto:
```bash
git init
git add .
git commit -m "Deploy HairStyleAbii"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/hairstyle-abi.git
git push -u origin main
```

### PASO 3: Desplegar en Railway (5 minutos)
1. Ve a https://railway.app
2. **"Login with GitHub"**
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Selecciona `hairstyle-abi`
5. **"Deploy Now"**

### PASO 4: Agregar base de datos (2 minutos)
1. En tu proyecto Railway: **"New"** → **"Database"** → **"Add MySQL"**
2. Railway conecta automáticamente la base de datos

### PASO 5: Configurar dominio (1 minuto)
1. Ve a **"Settings"** → **"Generate Domain"**
2. Cambia el nombre a: `hairstyle-abi`
3. Tu link será: `https://hairstyle-abi.up.railway.app`

## ✅ ¡LISTO!

**Tu app estará disponible en**: `https://hairstyle-abi.up.railway.app`

- 📱 Funciona en cualquier móvil/tablet/PC
- 🌐 Accesible desde cualquier red
- 🔒 HTTPS automático
- 🗃️ Base de datos incluida

---

## 🆘 Si algo no funciona:

### Error de build:
- Ve a los logs en Railway
- Asegúrate de que `deploy-prep.bat` se ejecutó correctamente

### App no carga:
- Espera 2-3 minutos después del deploy
- Revisa que las variables de entorno estén configuradas

### Base de datos no conecta:
- Railway configura automáticamente las variables
- Si hay error, elimina y vuelve a crear la base de datos

---

## 💰 Costo:
- **Gratis** hasta $5 de uso mensual
- Después: $5/mes
- Para un salón pequeño, normalmente se mantiene gratis

---

## 🔄 Actualizar la app:
Cada vez que hagas cambios:
```bash
git add .
git commit -m "Actualización"
git push
```
Railway actualiza automáticamente tu app.

---

**¿Listo? ¡Empecemos con el PASO 1!** 🚀