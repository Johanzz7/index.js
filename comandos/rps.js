const { formatearMensaje } = require('../utils');

module.exports = {
  nome: 'rps',
  alias: ['piedrapapeltijera', 'ppt'],
  descricao: 'Jugar piedra, papel o tijera',
  uso: '!rps <piedra|papel|tijera>',
  
  async executar(socket, chat, args, remitente, mensagem) {
    const opciones = ['piedra', 'papel', 'tijera'];
    
    if (args.length === 0) {
      return socket.sendMessage(chat, {
        text: formatearMensaje('❌ ERROR', `
┃ Usa: !rps piedra
┃       !rps papel
┃       !rps tijera
        `.trim())
      });
    }

    const eleccion = args[0].toLowerCase();
    
    if (!opciones.includes(eleccion)) {
      return socket.sendMessage(chat, {
        text: formatearMensaje('❌ OPCIÓN INVÁLIDA', `
┃ Elige: piedra, papel o tijera
        `.trim())
      });
    }

    const botEleccion = opciones[Math.floor(Math.random() * opciones.length)];
    
    let resultado = '';
    if (eleccion === botEleccion) {
      resultado = '🟡 Empate';
    } else if (
      (eleccion === 'piedra' && botEleccion === 'tijera') ||
      (eleccion === 'papel' && botEleccion === 'piedra') ||
      (eleccion === 'tijera' && botEleccion === 'papel')
    ) {
      resultado = '✅ ¡Ganaste!';
    } else {
      resultado = '❌ Perdiste';
    }

    const emojis = { piedra: '🪨', papel: '📄', tijera: '✂️' };
    
    const msg = `
╭━━━ ✊ PIEDRA PAPEL TIJERA ✊ ━━━╮
┃
┃ 👤 Tu elección: ${emojis[eleccion]} ${eleccion}
┃ 🤖 Bot elige: ${emojis[botEleccion]} ${botEleccion}
┃
┃ ${resultado}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
    `.trim();

    socket.sendMessage(chat, { text: msg });
  }
};