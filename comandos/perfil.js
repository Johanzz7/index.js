const db = require('../database');
const { formatearMensaje, formatearPerfil } = require('../utils');

module.exports = {
  nome: 'perfil',
  alias: ['profile', 'p'],
  descricao: 'Ver el perfil de un miembro',
  uso: '!perfil <nombre>',
  
  async executar(socket, chat, args, remitente, mensagem) {
    if (args.length === 0) {
      return {
        text: formatearMensaje('❌ ERROR', `
┃ Debes especificar un nombre
┃ Uso: !perfil <nombre>
        `.trim())
      };
    }

    const nombre = args.join(' ');

    db.obtenerMiembro(nombre, (err, miembro) => {
      if (err) {
        return socket.sendMessage(chat, {
          text: formatearMensaje('❌ ERROR', `
┃ Error al buscar el miembro: ${err.message}
          `.trim())
        });
      }

      if (!miembro) {
        return socket.sendMessage(chat, {
          text: formatearMensaje('❌ MIEMBRO NO ENCONTRADO', `
┃ No existe un miembro con el nombre: ${nombre}
          `.trim())
        });
      }

      const perfil = `
╭━━━ 👤 PERFIL 👤 ━━━╮
┃ 📛 Nombre: ${miembro.nombre}
┃ 🎮 Nick: ${miembro.nick}
┃ 🎖️ Rol: ${miembro.rol}
┃ ⭐ Puntos: ${miembro.puntos}
┃ 🟢 Estado: ${miembro.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
┃ 📅 Registro: ${new Date(miembro.fecha_registro).toLocaleDateString('es-ES')}
╰━━━━━━━━━━━━━━━━━━╯
      `.trim();

      socket.sendMessage(chat, { text: perfil });
    });
  }
};
