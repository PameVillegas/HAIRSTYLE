# 🚀 Guía Paso a Paso - Publicar en Render

## PASO 1: Crear cuenta en GitHub (5 minutos)

### 1.1 Ir a GitHub
- Abre tu navegador
- Ve a: **https://github.com**

### 1.2 Registrarte
- Clic en **"Sign up"** (arriba a la derecha)
- Ingresa tu email
- Crea una contraseña
- Elige un nombre de usuario (ejemplo: `hairstyleabii`)
- Verifica tu email
- ✅ ¡Cuenta creada!

---

## PASO 2: Instalar GitHub Desktop (5 minutos)

### 2.1 Descargar
- Ve a: **https://desktop.github.com**
- Clic en **"Download for Windows"**
- Espera la descarga

### 2.2 Instalar
- Abre el archivo descargado
- Sigue el instalador (Next, Next, Install)
- Abre GitHub Desktop

### 2.3 Iniciar sesión
- En GitHub Desktop, clic en **"Sign in to GitHub.com"**
- Ingresa tu usuario y contraseña de GitHub
- Autoriza GitHub Desktop
- ✅ ¡Conectado!

---

## PASO 3: Subir tu proyecto a GitHub (5 minutos)

### 3.1 Agregar repositorio local
- En GitHub Desktop, clic en **"File"** > **"Add local repository"**
- Clic en **"Choose..."**
- Navega a: `C:\Users\TATY\Desktop\HAIRSTYLE`
- Clic en **"Seleccionar carpeta"**

### 3.2 Crear repositorio
- Si dice "This directory does not appear to be a Git repository"
- Clic en **"create a repository"**
- Name: **hairstyleabii**
- Description: **Sistema de gestión de turnos**
- Clic en **"Create repository"**

### 3.3 Hacer el primer commit
- Verás todos los archivos en la lista
- En el campo "Summary", escribe: **"Primera versión"**
- Clic en **"Commit to main"**

### 3.4 Publicar en GitHub
- Clic en **"Publish repository"** (arriba)
- Desmarca **"Keep this code private"** (o déjalo marcado si prefieres privado)
- Clic en **"Publish repository"**
- Espera unos segundos
- ✅ ¡Proyecto en GitHub!

---

## PASO 4: Crear cuenta en Render (3 minutos)

### 4.1 Ir a Render
- Ve a: **https://render.com**

### 4.2 Registrarte con GitHub
- Clic en **"Get Started"**
- Clic en **"GitHub"** (para registrarte con tu cuenta de GitHub)
- Autoriza Render
- ✅ ¡Cuenta creada!

---

## PASO 5: Publicar tu app en Render (10 minutos)

### 5.1 Crear nuevo servicio
- En Render, clic en **"New +"** (arriba a la derecha)
- Selecciona **"Web Service"**

### 5.2 Conectar repositorio
- Busca **"hairstyleabii"** en la lista
- Clic en **"Connect"** al lado de tu repositorio

### 5.3 Configurar el servicio

Completa los campos:

**Name:** `hairstyleabii`

**Region:** `Oregon (US West)` (o el más cercano)

**Branch:** `main`

**Root Directory:** (dejar vacío)

**Environment:** `Node`

**Build Command:**
```
npm install && cd client && npm install && npm run build && cd ../server && npm install
```

**Start Command:**
```
cd server && npm start
```

**Plan:** Selecciona **"Free"** (gratis)

### 5.4 Variables de entorno (opcional)
- Clic en **"Advanced"**
- Agrega variable:
  - Key: `NODE_ENV`
  - Value: `production`

### 5.5 Crear servicio
- Clic en **"Create Web Service"** (abajo)
- ✅ ¡Iniciando despliegue!

---

## PASO 6: Esperar el despliegue (5-10 minutos)

### 6.1 Ver logs
- Verás los logs en tiempo real
- Aparecerán mensajes como:
  - "Installing dependencies..."
  - "Building client..."
  - "Starting server..."

### 6.2 Esperar "Live"
- Cuando termine, verás **"Live"** en verde (arriba)
- Tu URL estará lista: `https://hairstyleabii.onrender.com`

### 6.3 Probar la app
- Clic en la URL
- ¡Tu app está en línea!
- ✅ ¡Funcionando!

---

## PASO 7: Compartir la URL

Tu app estará en:
```
https://hairstyleabii.onrender.com
```

Comparte esta URL con quien quieras. Podrán acceder desde:
- ✅ Cualquier computadora
- ✅ Cualquier celular
- ✅ Cualquier red WiFi
- ✅ Datos móviles
- ✅ Desde cualquier parte del mundo

---

## 🎉 ¡LISTO!

Tu app está publicada en internet de forma gratuita.

---

## 📝 NOTAS IMPORTANTES

### Limitaciones del plan gratuito:
- La app se "duerme" después de 15 minutos sin uso
- Tarda ~30 segundos en "despertar" al primer acceso
- 750 horas gratis al mes (suficiente para empezar)

### Para actualizar tu app:
1. Haz cambios en tu código local
2. En GitHub Desktop:
   - Escribe un mensaje de commit
   - Clic en "Commit to main"
   - Clic en "Push origin"
3. Render detectará los cambios y actualizará automáticamente

### Si algo sale mal:
- Revisa los logs en Render
- Verifica que todos los archivos estén en GitHub
- Asegúrate de que los comandos de build y start sean correctos

---

## 🆘 ¿PROBLEMAS?

### Error: "Build failed"
- Revisa los logs para ver qué falló
- Verifica que `package.json` esté en la raíz
- Asegúrate de que los comandos sean correctos

### Error: "Application failed to respond"
- Verifica que el puerto sea el correcto (3000)
- Revisa que el servidor esté escuchando en `0.0.0.0`

### La app no carga
- Espera 30 segundos (puede estar "despertando")
- Refresca la página
- Revisa los logs en Render

---

## 💡 CONSEJOS

1. **Guarda la URL**: Anótala o guárdala en favoritos
2. **Comparte con cuidado**: Solo con personas de confianza
3. **Haz backups**: GitHub ya es tu backup automático
4. **Actualiza seguido**: Cada cambio se despliega automáticamente

---

¿Listo para empezar? ¡Sigue los pasos y en 30 minutos tendrás tu app en línea!
