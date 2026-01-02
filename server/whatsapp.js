import dotenv from 'dotenv';

dotenv.config();

let whatsappEnabled = false;

export function inicializarWhatsApp() {
  console.log('ℹ️  WhatsApp Web automático desactivado');
  console.log('📝 Los mensajes se guardarán en: mensajes-pendientes.txt\n');
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

  console.log('\n═══════════════════════════════════════');
  console.log('📱 NUEVO TURNO CREADO');
  console.log('═══════════════════════════════════════');
  console.log('📞 Cliente:', nombre);
  console.log('📱 Teléfono:', telefono);
  console.log('💆 Tratamiento:', tratamiento);
  console.log('📅 Fecha:', fecha);
  console.log('⏰ Hora:', hora);
  console.log('\n💬 MENSAJE PARA ENVIAR:');
  console.log('───────────────────────────────────────');
  console.log(mensaje);
  console.log('═══════════════════════════════════════\n');

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
    console.log('✅ Mensaje guardado en: mensajes-pendientes.txt');
    console.log('📁 Ubicación:', filePath, '\n');
  } catch (error) {
    console.log('⚠️  No se pudo guardar el archivo:', error.message, '\n');
  }

  return { success: true, messageId: 'manual-' + Date.now() };
}
