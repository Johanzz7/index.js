// Función para enviar mensaje con delay
async function enviarMensaje(socket, chat, texto, delay = 0) {
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  await socket.sendMessage(chat, { text: texto });
}

// Función para enviar reacción
async function enviarReaccion(socket, key, emoji) {
  await socket.sendMessage(key.remoteJid, {
    react: { text: emoji, key }
  });
}

// Función para obtener nombre del usuario
function obtenerNombre(mensaje) {
  return mensaje.pushName || 'Usuario';
}

// Función para verificar si es administrador
async function esAdmin(socket, chat, usuario) {
  try {
    const grupoData = await socket.groupMetadata(chat);
    const admin = grupoData.participants.find(p => p.id === usuario);
    return admin && admin.admin;
  } catch {
    return false;
  }
}

// Función para verificar si el mensaje es de un grupo
function esGrupo(chat) {
  return chat.includes('@g.us');
}

// Función para obtener ID del usuario mencionado
function obtenerUsuarioMencionado(mensaje) {
  if (mensaje.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
    return mensaje.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }
  return null;
}

module.exports = {
  enviarMensaje,
  enviarReaccion,
  obtenerNombre,
  esAdmin,
  esGrupo,
  obtenerUsuarioMencionado
};
