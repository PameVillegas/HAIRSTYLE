import dotenv from 'dotenv';

dotenv.config();

let whatsappEnabled = false;

export function inicializarWhatsApp() {
  // WhatsApp Web automático desactivado - los mensajes se guardan para envío manual
  return null;
}

export function getWhatsAppStatus() {
  return {
    initialized: false,
    ready: false
  };
}

export async function enviarMensajeTurno(telefono, nombre, tratamiento, fecha, hora) {
  const mensaje = `Hola ${nombre}! 👋\n\nTu turno ha sido confirmado:\n\n📅 Fecha: ${fecha}\n⏰ Hora: ${hora}\n💆 Tratamiento: ${tratamiento}\n\n¡Te esperamos!`;

  // Guardar en archivo de texto para fácil acceso
  const fs = await import('fs');
  const mensajeCompleto = `
TURNO CREADO: ${new Date().toLocaleString('es-AR')}
Cliente: ${nombre}
Teléfono: ${telefono}
Tratamiento: ${tratamiento}
Fecha: ${fecha}
Hora: ${hora}

MENSAJE:
${mensaje}

═══════════════════════════════════════
`;
  
  try {
    const path = await import('path');
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.join(__dirname, '..', 'mensajes-pendientes.txt');
    fs.appendFileSync(filePath, mensajeCompleto);
  } catch (error) {
    // Error silencioso - no afecta la funcionalidad principal
  }

  return { success: true, messageId: 'manual-' + Date.now() };
}
