# 🔧 Solución de Errores - WhatsApp Web

## ❌ Error: "Execution context was destroyed"

Este es el error más común en Windows. Significa que Puppeteer (el navegador que usa WhatsApp Web) no se instaló correctamente.

### Solución 1: Reinstalar dependencias

1. Cierra el servidor si está corriendo (Ctrl+C)
2. Ejecuta: **`instalar-whatsapp.bat`**
3. Espera a que termine (puede tardar 5-10 minutos)
4. Ejecuta: **`activar-whatsapp.bat`**

### Solución 2: Instalación manual

Abre CMD como Administrador y ejecuta:

```cmd
cd C:\Users\TATY\Desktop\HAIRSTYLE\server
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

### Solución 3: Eliminar caché de WhatsApp

```cmd
cd C:\Users\TATY\Desktop\HAIRSTYLE\server
rmdir /s /q .wwebjs_auth
rmdir /s /q .wwebjs_cache
```

Luego vuelve a ejecutar `activar-whatsapp.bat`

---

## ❌ Error: "Cannot find module 'puppeteer-core'"

### Solución:

```cmd
cd server
npm install puppeteer@21.0.0
```

---

## ❌ El código QR no aparece

### Posibles causas:

1. **Puppeteer no se descargó completamente**
   - Ejecuta: `instalar-whatsapp.bat`
   - Espera a que descargue Chromium (~150MB)

2. **Firewall bloqueando la descarga**
   - Desactiva temporalmente el antivirus/firewall
   - Vuelve a ejecutar `instalar-whatsapp.bat`

3. **Conexión a internet lenta**
   - Espera 2-3 minutos después de iniciar el servidor
   - El QR puede tardar en aparecer

---

## ❌ Error: "Protocol error"

### Solución:

1. Elimina la carpeta `.wwebjs_auth`:
   ```cmd
   cd server
   rmdir /s /q .wwebjs_auth
   ```

2. Reinicia el servidor

---

## ❌ El servidor se cierra solo

### Solución:

Verifica que Node.js esté actualizado:

```cmd
node --version
```

Debe ser versión 18 o superior. Si no, descarga desde: https://nodejs.org

---

## ❌ Error: "ENOSPC: System limit for number of file watchers reached"

Este error no debería aparecer en Windows, pero si aparece:

### Solución:

Cambia el script en `server/package.json`:

```json
"scripts": {
  "dev": "node server.js"
}
```

(Quita el `--watch`)

---

## ✅ Verificación de instalación correcta

Ejecuta estos comandos para verificar:

```cmd
cd server
npm list whatsapp-web.js
npm list puppeteer
```

Deberías ver:

```
whatsapp-web.js@1.34.2
puppeteer@21.0.0 (o similar)
```

---

## 🆘 Si nada funciona

### Opción 1: Usar versión manual (sin WhatsApp Web automático)

El sistema ya tiene un respaldo. Si WhatsApp Web no funciona, los mensajes se guardan en `mensajes-pendientes.txt` y puedes copiarlos manualmente.

### Opción 2: Usar otra computadora

WhatsApp Web funciona mejor en:
- Linux
- Mac
- Windows 11 actualizado

### Opción 3: Usar servicio en la nube

Considera usar servicios como:
- Wassenger (gratis hasta 1000 mensajes/mes)
- Twilio (de pago)
- WhatsApp Business API

---

## 📞 Información del sistema

Tu sistema:
- Windows
- Ruta: `C:\Users\TATY\Desktop\HAIRSTYLE`
- Node.js: (ejecuta `node --version` para ver)

---

## 💡 Consejos

1. **Ejecuta CMD como Administrador** para evitar problemas de permisos
2. **Desactiva el antivirus temporalmente** durante la instalación
3. **Usa una conexión a internet estable** (Puppeteer descarga ~150MB)
4. **Ten paciencia** - la primera instalación puede tardar 10-15 minutos
