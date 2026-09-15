const { formatearMensaje } = require('../utils');

module.exports = {
  nome: 'dado',
  alias: ['dice', 'd'],
  descricao: 'Lanzar un dado',
  uso: '!dado',
  
  async executar(socket, chat, args, remitente, mensagem) {
    const resultado = Math.floor(Math.random() * 6) + 1;
    const emojis = ['🎲', '🎲', '🎲', '🎲', '🎲', '🎲'];
    
    const msg = `
╭━━━ 🎲 DADO 🎲 ━━━╮
┃
┃ ${emojis[resultado - 1]} Sacaste: ${resultado}
┃
╰━━━━━━━━━━━━━━━━━╯
    `.trim();

    socket.sendMessage(chat, { text: msg });
  }
};