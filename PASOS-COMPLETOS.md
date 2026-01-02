# 📱 Guía Completa - Envío Automático de WhatsApp

## ✅ Pasos para que la app envíe mensajes automáticamente

### 1️⃣ INSTALAR DEPENDENCIAS

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd server
npm install
```

Esto instalará `whatsapp-web.js` y `qrcode-terminal`.

---

### 2️⃣ INICIAR EL SERVIDOR

En la misma terminal:

```bash
npm run dev
```

O simplemente ejecuta el archivo: **`activar-whatsapp.bat`**

---

### 3️⃣ VINCULAR WHATSAPP WEB

Cuando el servidor inicie, verás algo como esto en la consola:

```
═══════════════════════════════════════
📱 ESCANEA ESTE CÓDIGO QR CON WHATSAPP
═══════════════════════════════════════

█████████████████████████████████
█████████████████████████████████
███ ▄▄▄▄▄ █▀█ █▄▄▀▄█ ▄▄▄▄▄ ███
███ █   █ █▀▀▀█ ▀ ▄█ █   █ ███
███ █▄▄▄█ █▀ █▀▀█▄██ █▄▄▄█ ███
...
```

**Ahora en tu teléfono:**

1. Abre **WhatsApp**
2. Ve a **Configuración** (⚙️)
3. Toca **Dispositivos vinculados**
4. Toca **"Vincular un dispositivo"**
5. **Escanea el código QR** que aparece en la consola

---

### 4️⃣ ESPERAR CONFIRMACIÓN

Verás este mensaje cuando esté listo:

```
✅ WhatsApp conectado y listo!
```

**¡Listo!** La sesión se guarda automáticamente. No necesitarás escanear el QR nuevamente.

---

### 5️⃣ INICIAR LA APLICACIÓN WEB

Abre otra terminal y ejecuta:

```bash
cd client
npm run dev
```

O ejecuta el archivo: **`iniciar.bat`**

Abre tu navegador en: **http://localhost:5173**

---

### 6️⃣ PROBAR EL ENVÍO

1. Ve a la pestaña **"Clientes"**
2. Agrega un cliente con su número de WhatsApp
   - Formato: **+5491123456789** (con código de país)
3. Ve a **"Nuevo Turno"**
4. Completa el formulario y haz clic en **"Crear Turno y Enviar WhatsApp"**

**El mensaje se enviará automáticamente** 🎉

---

## 🔍 Verificar que funciona

En la consola del servidor verás:

```
═══════════════════════════════════════
📱 ENVIANDO MENSAJE DE TURNO
═══════════════════════════════════════
📞 Cliente: María García
📱 Teléfono: +5491123456789
💆 Tratamiento: Alisado
📅 Fecha: 2026-01-15
⏰ Hora: 14:00
📤 Enviando a: 5491123456789@c.us
✅ Mensaje enviado exitosamente!
═══════════════════════════════════════
```

---

## ⚠️ Solución de Problemas

### El código QR no aparece
- Verifica que instalaste las dependencias: `npm install`
- Asegúrate de estar en la carpeta `server`

### Error al escanear el QR
- Verifica tu conexión a internet
- Asegúrate de tener WhatsApp actualizado
- Cierra otras sesiones de WhatsApp Web

### El mensaje no se envía
- Verifica que el servidor esté corriendo
- Revisa que el número tenga el formato correcto: +5491123456789
- Mira la consola del servidor para ver errores

### WhatsApp se desconecta
- Reinicia el servidor
- Si persiste, elimina la carpeta `.wwebjs_auth` y vuelve a vincular

---

## 📝 Notas Importantes

✅ **La sesión se guarda**: Solo vinculas WhatsApp una vez
✅ **Respaldo automático**: Si falla, el mensaje se guarda en `mensajes-pendientes.txt`
✅ **Formato de número**: Siempre con código de país (+54 para Argentina)
✅ **Servidor activo**: Debe estar corriendo para envío automático

---

## 🎯 Resumen Rápido

```bash
# 1. Instalar
cd server
npm install

# 2. Iniciar servidor y vincular WhatsApp
npm run dev
# (Escanear QR con WhatsApp)

# 3. En otra terminal, iniciar cliente
cd client
npm run dev

# 4. Abrir navegador
# http://localhost:5173

# 5. Crear turno y listo!
```

---

¡Eso es todo! Ahora tu app enviará mensajes automáticamente por WhatsApp. 🚀
