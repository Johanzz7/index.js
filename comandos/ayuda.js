const { formatearMensaje } = require('../utils');
const fs = require('fs');
const path = require('path');

module.exports = {
  nome: 'ayuda',
  alias: ['help', 'comandos', 'cmds'],
  descricao: 'Ver todos los comandos disponibles',
  uso: '!ayuda [comando]',
  
  async executar(socket, chat, args, remitente, mensagem) {
    const comandosDir = path.join(__dirname);
    const archivos = fs.readdirSync(comandosDir).filter(file => file.endsWith('.js') && file !== 'ayuda.js');
    
    if (args.length > 0) {
      // Buscar comando específico
      const nombreComando = args[0].toLowerCase();
      const archivo = archivos.find(f => {
        try {
          const cmd = require(`./${f}`);
          return cmd.nome === nombreComando || (cmd.alias && cmd.alias.includes(nombreComando));
        } catch (e) {
          return false;
        }
      });

      if (!archivo) {
        return socket.sendMessage(chat, {
          text: formatearMensaje('❌ COMANDO NO ENCONTRADO', `No existe el comando: ${nombreComando}`)
        });
      }

      try {
        const cmd = require(`./${archivo}`);
        const info = `
╭━━━ 📖 INFO COMANDO 📖 ━━━╮
┃ 📛 Nombre: ${cmd.nome}
┃ 📝 Descripción: ${cmd.descricao}
┃ 🎯 Uso: ${cmd.uso}
┃ 🔤 Alias: ${cmd.alias ? cmd.alias.join(', ') : 'Ninguno'}
┃ 🔐 Admin: ${cmd.admin ? 'Sí' : 'No'}
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
        `.trim();
        return socket.sendMessage(chat, { text: info });
      } catch (e) {
        return socket.sendMessage(chat, {
          text: formatearMensaje('❌ ERROR', `Error al cargar el comando: ${e.message}`)
        });
      }
    }

    // Listar todos los comandos
    let contenido = '┃ 📚 COMANDOS DISPONIBLES\n┃\n';
    
    const comandos = [];
    archivos.forEach(archivo => {
      try {
        const cmd = require(`./${archivo}`);
        comandos.push(cmd);
      } catch (e) {
        console.error(`Error cargando ${archivo}:`, e);
      }
    });

    // Agrupar por categorías
    const gestión = comandos.filter(c => ['miembros', 'registrar', 'perfil', 'warn'].includes(c.nome));
    const entrenamientos = comandos.filter(c => ['entreno', 'scrim'].includes(c.nome));
    const diversión = comandos.filter(c => ['dado', 'moneda', '8ball', 'roll', 'rps'].includes(c.nome));
    const otros = comandos.filter(c => ['anuncio'].includes(c.nome));

    if (gestión.length > 0) {
      contenido += '┃ 👥 GESTIÓN\n';
      gestión.forEach(c => {
        contenido += `┃   ${c.nome} - ${c.descricao}\n`;
      });
      contenido += '┃\n';
    }

    if (entrenamientos.length > 0) {
      contenido += '┃ ⚔️ ENTRENAMIENTOS\n';
      entrenamientos.forEach(c => {
        contenido += `┃   ${c.nome} - ${c.descricao}\n`;
      });
      contenido += '┃\n';
    }

    if (diversión.length > 0) {
      contenido += '┃ 🎮 DIVERSIÓN\n';
      diversión.forEach(c => {
        contenido += `┃   ${c.nome} - ${c.descricao}\n`;
      });
      contenido += '┃\n';
    }

    if (otros.length > 0) {
      contenido += '┃ 📢 OTROS\n';
      otros.forEach(c => {
        contenido += `┃   ${c.nome} - ${c.descricao}\n`;
      });
      contenido += '┃\n';
    }

    contenido += '┃ 💡 Usa: !ayuda <comando> para más info';

    const msg = `╭━━━ 📖 AYUDA 📖 ━━━╮
${contenido}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    socket.sendMessage(chat, { text: msg });
  }
};
