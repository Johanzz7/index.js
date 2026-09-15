const { formatearMensaje } = require('../utils');

module.exports = {
  nome: 'moneda',
  alias: ['coin', 'flip'],
  descricao: 'Lanzar una moneda',
  uso: '!moneda',
  
  async executar(socket, chat, args, remitente, mensagem) {
    const resultado = Math.random() < 0.5 ? 'Cara' : 'Cruz';
    const emoji = resultado === 'Cara' ? '🪙' : '🪙';
    
    const msg = `
╭━━━ 🪙 MONEDA 🪙 ━━━╮
┃
┃ ${emoji} Resultado: ${resultado}
┃
╰━━━━━━━━━━━━━━━━━╯
    `.trim();

    socket.sendMessage(chat, { text: msg });
  }
};