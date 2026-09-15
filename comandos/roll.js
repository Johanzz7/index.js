const { formatearMensaje } = require('../utils');

module.exports = {
  nome: 'roll',
  alias: ['random', 'rand'],
  descricao: 'Generar número aleatorio',
  uso: '!roll [max]',
  
  async executar(socket, chat, args, remitente, mensagem) {
    let max = 100;
    
    if (args.length > 0 && !isNaN(args[0])) {
      max = parseInt(args[0]);
    }

    if (max <= 0) {
      return socket.sendMessage(chat, {
        text: formatearMensaje('❌ ERROR', 'El número debe ser mayor a 0')
      });
    }

    const resultado = Math.floor(Math.random() * max) + 1;
    
    const msg = `
╭━━━ 🎰 RANDOM 🎰 ━━━╮
┃
┃ 🎲 Número entre 1 y ${max}
┃ 🎯 Resultado: ${resultado}
┃
╰━━━━━━━━━━━━━━━━━╯
    `.trim();

    socket.sendMessage(chat, { text: msg });
  }
};