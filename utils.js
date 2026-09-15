// Función para enviar mensajes
async function enviarMensaje(socket, chat, texto, delay = 0) {
  try {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    await socket.sendMessage(chat, { text: texto });
  } catch (error) {
    console.error('❌ Error enviando mensaje:', error);
  }
}

// Función para enviar reacción
async function enviarReaccion(socket, key, emoji) {
  try {
    await socket.sendMessage(key.remoteJid, {
      react: { text: emoji, key }
    });
  } catch (error) {
    console.error('❌ Error enviando reacción:', error);
  }
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

// Función para formatear mensajes con emojis y símbolos
function formatearMensaje(titulo, contenido, emoji = '🌸') {
  return `
╭━━━ ${emoji} ${titulo} ${emoji} ━━━╮
${contenido}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯
  `.trim();
}

// Función para crear lista formateada
function crearLista(items, emoji = '👤') {
  return items.map((item) => `┃ ${emoji} ${item}`).join('\n');
}

// Función para separador
function separador() {
  return '━━━━━━━━━━━━━━━━━━━━━━━━━';
}

// Función para validar rol
function esRolValido(rol, rolesPermitidos = ['IGL', 'Rifler', 'Support', 'Awper', 'Lurker']) {
  return rolesPermitidos.includes(rol);
}

// Función para formatear perfil
function formatearPerfil(miembro) {
  return `
┃ 👤 Nombre: ${miembro.nombre}
┃ 🎮 Nick: ${miembro.nick}
┃ 🎖️ Rol: ${miembro.rol}
┃ ⭐ Puntos: ${miembro.puntos}
┃ 🟢 Estado: ${miembro.estado}
┃ 📅 Registro: ${miembro.fecha_registro}
  `.trim();
}

// Función para crear tabla de ranking
function crearTablaRanking(miembros) {
  let tabla = '┃ 🏆 RANKING 🏆\n';
  tabla += '┃\n';
  miembros.slice(0, 10).forEach((m, i) => {
    const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}️⃣`;
    tabla += `┃ ${medalla} ${m.nombre} - ${m.puntos} pts\n`;
  });
  return tabla;
}

// Exportar todas las funciones
module.exports = {
  enviarMensaje,
  enviarReaccion,
  obtenerNombre,
  esAdmin,
  esGrupo,
  obtenerUsuarioMencionado,
  formatearMensaje,
  crearLista,
  separador,
  esRolValido,
  formatearPerfil,
  crearTablaRanking
};
